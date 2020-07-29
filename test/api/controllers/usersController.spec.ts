import { mockReq, mockRes } from 'sinon-express-mock'
import AppUser from '~/api/models/User'
import usersConrtoller from '~/api/controllers/usersController'
import Boom from '@hapi/boom'
import { LoginUser } from '~/types/auth'

let mockError = false

jest.mock('~/api/models/User', () => ({
  findOne: jest.fn(() => {
    return AppUser
  }),
  findOrCreate: jest.fn((user: LoginUser) => {
    if (mockError) {
      throw new Error('mock error')
    }
    return { _id: '12345', ...user }
  })
}))

describe('~/api/controllers/userController', () => {
  const request = {
    body: {
      user: {
        username: 'test',
        storategy: 'google',
        identifier: '12345',
        emil: 'aaa@example.com',
        photoURL: 'http://example.com'
      }
    }
  }
  const req = mockReq(request)
  const res = mockRes()
  const next = jest.fn()

  describe('正常系', () => {
    test('uidが返される', async () => {
      await usersConrtoller.create(req, res, next)

      expect(res.status.calledWith(200)).toBeTruthy()
      expect(res.json.calledWith({ uid: '12345' })).toBeTruthy()
    })
  })

  describe('異常系', () => {
    test('エラーが発生したとき、nextが呼ばれる', async () => {
      mockError = true
      await usersConrtoller.create(req, res, next)

      expect(next).toHaveBeenCalled()
      const err = Boom.boomify(next.mock.calls[0][0])
      expect(err.output.statusCode).toEqual(500)
    })
  })
})
