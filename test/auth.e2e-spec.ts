import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getConnection } from 'typeorm'
import { AppModule } from '../src/app/app.module'
import { AuthService } from '../src/auth/auth.service'
import { Role } from '../src/users/user.entity'
import { UsersService } from '../src/users/users.service'
import { request, expectUnauhorized } from './lib'
import { createUserData, usersMocks } from './mocks'

const API_URL = '/auth'

describe('AuthController (e2e)', () => {
  let app: INestApplication

  let usersService: UsersService
  let authService: AuthService

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
  })

  afterEach(async () => {
    const connection = getConnection()
    await connection.close()
  })

  describe(`${API_URL}/register (POST)`, () => {
    test('register user', async () => {
      const res = await request(app.getHttpServer(), {
        method: 'post',
        path: `${API_URL}/register`,
        data: usersMocks[0],
      })

      expect(res.status).toBe(201)
      expect(res.body).toEqual({
        data: {
          user: {
            id: expect.any(Number),
            email: usersMocks[0].email,
            passwordHash: expect.any(String),
            role: Role.User,
          },
          token: expect.any(String),
        },
      })
    })
    test.todo('user already exist')
  })

  describe(`${API_URL}/login (POST)`, () => {
    test('login user', async () => {
      const user = await usersService.createUser(usersMocks[0])

      const res = await request(app.getHttpServer(), {
        method: 'post',
        path: `${API_URL}/login`,
        data: usersMocks[0],
      })

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        data: {
          user: {
            id: user.id,
            email: user.email,
            passwordHash: expect.any(String),
            role: user.role,
          },
          token: expect.any(String),
        },
      })
    })

    test.todo('user not exist')
    test.todo('incorrect password')
  })

  describe(`${API_URL}/user (GET)`, () => {
    test('return unauhorized error', async () => {
      const res = await request(app.getHttpServer(), {
        method: 'get',
        path: `${API_URL}/user`,
      })

      expectUnauhorized({ status: res.status, body: res.body })
    })

    test('return authenticated user', async () => {
      const user = await usersService.createUser(usersMocks[0])
      const token = await authService.createToken(user.id)
      const res = await request(app.getHttpServer(), {
        method: 'get',
        path: `${API_URL}/user`,
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
})
