import * as supertest from 'supertest'

type RequestConfig = {
  data?: any
  token?: string
  path: string
  method: 'get' | 'post' | 'put' | 'delete'
}

export const request = async (app: any, { data, token, path, method }: RequestConfig) => {
  const headers: { Authorization?: string; [header: string]: string } = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const req = supertest(app)
    [method](path)
    .set(headers)

  if (data) {
    req.send(data)
  }

  return req
}

interface ExpectFn {
  ({ status: number, body: any }): void
}

export const expectForbidden: ExpectFn = ({ status, body }: { status: number; body: any }) => {
  expect(status).toBe(403)
  expect(body).toEqual({
    error: 'Forbidden',
    message: 'Forbidden resource',
    statusCode: 403,
  })
}

export const expectUnauhorized: ExpectFn = ({ status, body }: { status: number; body: any }) => {
  expect(status).toBe(401)
  expect(body).toEqual({
    error: 'Unauthorized',
    statusCode: 401,
  })
}
