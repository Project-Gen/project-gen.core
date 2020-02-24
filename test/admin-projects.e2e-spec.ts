import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getConnection } from 'typeorm'
import { AppModule } from '../src/app/app.module'
import { AuthService } from '../src/auth/auth.service'
import { ProjectsService } from '../src/projects/projects.service'
import { UsersService } from '../src/users/users.service'
import { expectForbidden, request } from './lib'
import { createProjectData, projectsMocks, usersMocks } from './mocks'

const API_URL = '/admin/projects'

describe('ProjectsController (e2e)', () => {
  let app: INestApplication

  let authService: AuthService
  let usersService: UsersService
  let projectsService: ProjectsService

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
  })

  afterEach(async () => {
    const connection = getConnection()
    await connection.synchronize(true)
    await connection.close()
  })

  describe(`${API_URL} (POST)`, () => {
    test('create project', async () => {
      const projectData = {
        title: 'test',
        description: 'test',
        userId: 1,
      }
      const userData = {
        email: 'test@email.com',
        password: 'testpassword',
      }
      const user = await usersService.createAdmin(userData)
      const token = await authService.createToken(user.id)

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
          userId: 1,
        },
      })
    })

    test('forbidden by user role', async () => {
      const projectData = {
        title: 'test',
        description: 'test',
        userId: 1,
      }
      const userData = {
        email: 'test@email.com',
        password: 'testpassword',
      }
      const user = await usersService.createUser(userData)
      const token = await authService.createToken(user.id)

      const res = await request(app.getHttpServer(), {
        path: `${API_URL}`,
        method: 'post',
        token,
        data: projectData,
      })

      expectForbidden({ status: res.status, body: res.body })
    })
  })

  describe(`${API_URL}/:id (GET)`, () => {
    test('get project', async () => {
      const projectData = {
        title: 'test',
        description: 'test',
        userId: 1,
      }
      const userData = {
        email: 'test@email.com',
        password: 'testpassword',
      }
      const user = await usersService.createAdmin(userData)
      const project = await projectsService.create({ ...projectData, userId: user.id })
      const token = await authService.createToken(user.id)

      const res = await request(app.getHttpServer(), {
        method: 'get',
        path: `${API_URL}/${project.id}`,
        token,
      })

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        data: {
          id: expect.any(Number),
          title: projectData.title,
          description: projectData.description,
          userId: 1,
        },
      })
    })

    test('forbidden for user role', async () => {
      const userData = {
        email: 'test@email.com',
        password: 'testpassword',
      }
      const user = await usersService.createUser(userData)
      const token = await authService.createToken(user.id)

      const projectData = {
        title: 'test',
        description: 'test',
        userId: user.id,
      }
      const project = await projectsService.create(projectData)

      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/${project.id}`,
        method: 'get',
        token,
        data: projectData,
      })

      expectForbidden({ status: res.status, body: res.body })
    })
  })

  describe(`${API_URL}/:id (PUT)`, () => {
    test('update project', async () => {
      const user = await usersService.createAdmin(usersMocks[0])
      const project = await projectsService.create(
        createProjectData(projectsMocks[0], {
          userId: user.id,
        }),
      )
      const newProjectData = createProjectData(projectsMocks[1], { userId: project.userId })
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/${project.id}`,
        method: 'put',
        token: await authService.createToken(user.id),
        data: newProjectData,
      })
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        data: {
          id: project.id,
          ...newProjectData,
        },
      })
    })

    test('forbidden by user role', async () => {
      const user = await usersService.createUser(usersMocks[0])
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/44`,
        method: 'put',
        token: await authService.createToken(user.id),
      })

      expectForbidden({ status: res.status, body: res.body })
    })
  })

  describe(`${API_URL}/:id (DELETE)`, () => {
    test('forbidden for user role', async () => {
      const user = await usersService.createUser(usersMocks[0])
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/44`,
        method: 'delete',
        token: await authService.createToken(user.id),
      })

      expectForbidden({ status: res.status, body: res.body })
    })

    test('delete by id', async () => {
      const user = await usersService.createAdmin(usersMocks[0])
      const project = await projectsService.create(createProjectData(projectsMocks[0], { userId: user.id }))

      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/${project.id}`,
        method: 'delete',
        token: await authService.createToken(user.id),
      })

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ data: { affected: 1 } })
    })
  })

  describe(`${API_URL} (GET)`, () => {
    test('forbidden for user role', async () => {
      const user = await usersService.createUser(usersMocks[0])
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}`,
        method: 'get',
        token: await authService.createToken(user.id),
      })

      expectForbidden({ status: res.status, body: res.body })
    })

    test('get all projects', async () => {
      const user = await usersService.createAdmin(usersMocks[0])

      await Promise.all(projectsMocks.map((projectMock) => projectsService.create(createProjectData(projectMock, { userId: user.id }))))

      const res = await request(app.getHttpServer(), {
        path: `${API_URL}`,
        method: 'get',
        token: await authService.createToken(user.id),
      })

      expect(res.status).toBe(200)

      expect(res.body.data).toHaveLength(projectsMocks.length)
      expect(res.body.count).toBe(projectsMocks.length)
    })
  })
})
