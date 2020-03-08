import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getConnection } from 'typeorm'
import { AppModule } from '../src/app/app.module'
import { AuthService } from '../src/auth/auth.service'
import { ProjectsService } from '../src/projects/projects.service'
import { User } from '../src/users/user.entity'
import { UsersService } from '../src/users/users.service'
import { expectForbidden, request } from './lib'
import { authUsersMocks, createProjectData, projectsMocks } from './mocks'

const API_URL = '/admin/projects'

describe('AdminProjectsController (e2e)', () => {
  let app: INestApplication

  let authService: AuthService
  let usersService: UsersService
  let projectsService: ProjectsService

  let authUser: User
  let authAdmin: User

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()

    authService = moduleFixture.get(AuthService)
    usersService = moduleFixture.get(UsersService)
    projectsService = moduleFixture.get(ProjectsService)

    await app.init()

    const connection = getConnection()
    await connection.synchronize(true)

    authUser = await usersService.createUser(authUsersMocks[1])
    authAdmin = await usersService.createAdmin(authUsersMocks[0])
  })

  afterEach(async () => {
    const connection = getConnection()
    await connection.synchronize(true)
    await connection.close()
  })

  describe(`${API_URL} (POST)`, () => {
    test('create project', async () => {
      const projectData = createProjectData(projectsMocks[0], {
        userId: authUser.id,
      })
      const token = await authService.createToken(authAdmin.id)

      const res = await request(app.getHttpServer(), {
        path: `${API_URL}`,
        method: 'post',
        token,
        data: projectData,
      })

      expect(res.status).toBe(201)
      expect(res.body).toEqual({
        data: {
          id: expect.any(Number),
          title: projectData.title,
          description: projectData.description,
          userId: projectData.userId,
          user: authUser,
          vacantions: expect.any(Array),
        },
      })

      expect(res.body.data.vacantions).toHaveLength(2)
      expect(res.body.data.vacantions).toEqual([
        {
          id: expect.any(Number),
          title: projectData.vacantions[0].title,
          projectId: res.body.data.id,
        },
        {
          id: expect.any(Number),
          title: projectData.vacantions[1].title,
          projectId: res.body.data.id,
        },
      ])
    })

    test('forbidden by user role', async () => {
      const token = await authService.createToken(authUser.id)
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}`,
        method: 'post',
        token,
      })

      expectForbidden({ status: res.status, body: res.body })
    })
  })

  describe(`${API_URL}/:id (GET)`, () => {
    test('return project', async () => {
      const project = await projectsService.create({
        ...projectsMocks[0],
        userId: authUser.id,
      })
      const token = await authService.createToken(authAdmin.id)

      const res = await request(app.getHttpServer(), {
        method: 'get',
        path: `${API_URL}/${project.id}`,
        token,
      })

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        data: {
          id: expect.any(Number),
          title: projectsMocks[0].title,
          description: projectsMocks[0].description,
          userId: authUser.id,
          user: authUser,
          vacantions: expect.any(Array),
        },
      })
      expect(res.body.data.vacantions).toHaveLength(2)
      expect(res.body.data.vacantions).toEqual([
        {
          id: expect.any(Number),
          title: project.vacantions[0].title,
          projectId: project.id,
        },
        {
          id: expect.any(Number),
          title: project.vacantions[1].title,
          projectId: project.id,
        },
      ])
    })

    test('forbidden for user role', async () => {
      const token = await authService.createToken(authUser.id)
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/34`,
        method: 'get',
        token,
      })

      expectForbidden({ status: res.status, body: res.body })
    })
  })

  describe(`${API_URL}/:id (PUT)`, () => {
    test('update project', async () => {
      const project = await projectsService.create({
        ...projectsMocks[0],
        userId: authUser.id,
      })
      const newProjectData = createProjectData(projectsMocks[1], {
        userId: project.userId,
      })
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/${project.id}`,
        method: 'put',
        token: await authService.createToken(authAdmin.id),
        data: {
          ...newProjectData,
          vacantions: [
            ...newProjectData.vacantions,
            {
              id: project.vacantions[0].id,
              title: `${project.vacantions[0].title}:updated`,
              projectId: project.id,
            },
          ],
        },
      })
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        data: {
          id: project.id,
          ...newProjectData,
          user: authUser,
          vacantions: expect.any(Array),
        },
      })
      expect(res.body.data.vacantions).toHaveLength(3)
      expect(res.body.data.vacantions).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            title: projectsMocks[1].vacantions[0].title,
            projectId: project.id,
          },
          {
            id: expect.any(Number),
            title: projectsMocks[1].vacantions[1].title,
            projectId: project.id,
          },
          {
            id: project.vacantions[0].id,
            title: `${project.vacantions[0].title}:updated`,
            projectId: project.id,
          },
        ])
      )
    })

    test('forbidden by user role', async () => {
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/44`,
        method: 'put',
        token: await authService.createToken(authUser.id),
      })

      expectForbidden({ status: res.status, body: res.body })
    })
  })

  describe(`${API_URL}/:id (DELETE)`, () => {
    test('forbidden for user role', async () => {
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/44`,
        method: 'delete',
        token: await authService.createToken(authUser.id),
      })

      expectForbidden({ status: res.status, body: res.body })
    })

    test('delete project', async () => {
      const project = await projectsService.create(
        createProjectData(projectsMocks[0], { userId: authUser.id })
      )

      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/${project.id}`,
        method: 'delete',
        token: await authService.createToken(authAdmin.id),
      })

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ data: { affected: 1 } })
    })
  })

  describe(`${API_URL} (GET)`, () => {
    test('forbidden for user role', async () => {
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}`,
        method: 'get',
        token: await authService.createToken(authUser.id),
      })

      expectForbidden({ status: res.status, body: res.body })
    })

    test('return projects', async () => {
      await Promise.all(
        projectsMocks.map((projectMock) =>
          projectsService.create(
            createProjectData(projectMock, { userId: authUser.id })
          )
        )
      )

      const res = await request(app.getHttpServer(), {
        path: `${API_URL}`,
        method: 'get',
        token: await authService.createToken(authAdmin.id),
      })

      expect(res.status).toBe(200)

      expect(res.body.data).toHaveLength(projectsMocks.length)
      expect(res.body.count).toBe(projectsMocks.length)
    })
  })
})
