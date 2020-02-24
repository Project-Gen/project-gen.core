import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getConnection } from 'typeorm'
import { AppModule } from '../src/app/app.module'
import { AuthService } from '../src/auth/auth.service'
import { Role, User } from '../src/users/user.entity'
import { UsersService } from '../src/users/users.service'
import { expectForbidden, request } from './lib'
import { createUserData, usersMocks, authUsersMocks } from './mocks'

const API_URL = '/admin/users'

describe('AdminUsersController (e2e)', () => {
  let app: INestApplication

  let usersService: UsersService
  let authService: AuthService

  let authUser: User
  let authAdmin: User

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()

    usersService = moduleFixture.get(UsersService)
    authService = moduleFixture.get(AuthService)

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
    test('forbidden by user role', async () => {
      const token = await authService.createToken(authUser.id)
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}`,
        method: 'post',
        token,
      })

      expectForbidden({ status: res.status, body: res.body })
    })

    test('create user', async () => {
      const userData = createUserData(usersMocks[0], { role: Role.Admin })

      const token = await authService.createToken(authAdmin.id)
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}`,
        method: 'post',
        token,
        data: userData,
      })
      expect(res.status).toBe(201)
      expect(res.body).toEqual({
        data: {
          id: expect.any(Number),
          email: userData.email,
          passwordHash: expect.any(String),
          role: userData.role,
        },
      })
    })
  })

  describe(`${API_URL}/:id (PUT)`, () => {
    test('forbidden by user role', async () => {
      const token = await authService.createToken(authUser.id)
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/33`,
        method: 'put',
        token,
      })

      expectForbidden({ status: res.status, body: res.body })
    })

    test('update user', async () => {
      const user = await usersService.createUser(usersMocks[0])
      const userUpdateData = createUserData(usersMocks[1], { role: Role.Admin })

      const token = await authService.createToken(authAdmin.id)
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/${user.id}`,
        method: 'put',
        token,
        data: userUpdateData,
      })
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        data: {
          id: user.id,
          email: userUpdateData.email,
          passwordHash: expect.any(String),
          role: userUpdateData.role,
        },
      })
    })
  })

  describe(`${API_URL}/:id (GET)`, () => {
    test('forbidden by user role', async () => {
      const token = await authService.createToken(authUser.id)
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/33`,
        method: 'get',
        token,
      })

      expectForbidden({ status: res.status, body: res.body })
    })

    test('return user', async () => {
      const user = await usersService.createUser(usersMocks[0])

      const token = await authService.createToken(authAdmin.id)
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/${user.id}`,
        method: 'get',
        token,
      })
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        data: {
          id: user.id,
          email: user.email,
          passwordHash: expect.any(String),
          role: user.role,
        },
      })
    })
  })

  describe(`${API_URL}/:id (DELETE)`, () => {
    test('forbidden by user role', async () => {
      const token = await authService.createToken(authUser.id)
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/33`,
        method: 'delete',
        token,
      })

      expectForbidden({ status: res.status, body: res.body })
    })

    test('delete user', async () => {
      const user = await usersService.createUser(usersMocks[0])

      const token = await authService.createToken(authAdmin.id)
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}/${user.id}`,
        method: 'delete',
        token,
      })
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        data: {
          affected: 1,
        },
      })
    })
  })

  describe(`${API_URL} (GET)`, () => {
    test('forbidden by user role', async () => {
      const token = await authService.createToken(authUser.id)
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}`,
        method: 'get',
        token,
      })

      expectForbidden({ status: res.status, body: res.body })
    })

    test('return users', async () => {
      const token = await authService.createToken(authAdmin.id)
      await Promise.all(usersMocks.map(u => usersService.createUser(u)))
      const res = await request(app.getHttpServer(), {
        path: `${API_URL}`,
        method: 'get',
        token,
      })

      expect(res.status).toEqual(200)
      expect(res.body.data).toHaveLength(usersMocks.length + authUsersMocks.length)
      expect(res.body.count).toEqual(usersMocks.length + authUsersMocks.length)
    })
  })
})
