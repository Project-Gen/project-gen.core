import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { getConnection } from 'typeorm'
import { AuthModule } from '../src/auth/auth.module'
import { AppModule } from '../src/app.module'
import { UsersService } from '../src/users/users.service'
import { AuthService } from '../src/auth/auth.service'

const AUTH_URL = '/auth'

describe('AuthController (e2e)', () => {
  let app: INestApplication

  let usersService: UsersService
  let authService: AuthService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    usersService = moduleFixture.get<UsersService>(UsersService)
    authService = moduleFixture.get<AuthService>(AuthService)

    await app.init()

    const connection = getConnection()
    await connection.synchronize(true)
  })

  afterEach(async () => {
    const connection = getConnection()
    await connection.close()
  })

  describe(`/${AUTH_URL}/register (POST)`, () => {
    test('success register user', async () => {
      const userData = { email: 'user@email.com', password: 'userpassword' }
      const res = await request(app.getHttpServer())
        .post(`${AUTH_URL}/register`)
        .send(userData)
      expect(res.status).toBe(201)
      expect(res.body).toEqual({
        data: {
          user: {
            id: expect.any(Number),
            email: userData.email,
            passwordHash: expect.any(String),
          },
          token: expect.any(String),
        },
      })
    })
    test.todo('user already exist')
  })

  describe(`/${AUTH_URL}/login (POST)`, () => {
    test('success login user', async () => {
      const userData = { email: 'user@email.com', password: 'userpassword' }
      await usersService.create(userData)
      const res = await request(app.getHttpServer())
        .post(`${AUTH_URL}/login`)
        .send(userData)
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        data: {
          user: {
            id: expect.any(Number),
            email: userData.email,
            passwordHash: expect.any(String),
          },
          token: expect.any(String),
        },
      })
    })

    test.todo('user not exist')
    test.todo('incorrect password')
  })

  describe(`/${AUTH_URL}/user (GET)`, () => {
    test('return authenticated user', async () => {
      const userData = { email: 'user@email.com', password: 'userpassword' }
      const user = await usersService.create(userData)
      const token = await authService.createToken(user.id)
      const res = await request(app.getHttpServer())
        .get(`${AUTH_URL}/user`)
        .set({ Authorization: `Bearer ${token}` })

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        data: {
          id: expect.any(Number),
          email: userData.email,
          passwordHash: expect.any(String),
        },
      })
    })
  })
})
