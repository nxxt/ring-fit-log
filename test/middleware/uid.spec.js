import middleware from '~/middleware/uid'
import getLoginUser from '~/utils/getLoginUser'

let mockError = false
const uid = '12345'
const error = jest.fn()
const $axios = {
  post: jest.fn((url, data) => {
    if (mockError) {
      return Promise.reject('mock error')
    }
    return Promise.resolve({ data: { uid } })
  })
}

const cb = () => {}
const loginUser = {
  username: 'username',
  strategy: 'github',
  identifier: 'abcde',
  email: 'aaa@example.com',
  photoURL: 'example'
}

jest.mock('~/utils/getLoginUser')
getLoginUser.mockImplementation(() => {
  return loginUser
})

describe('~/middleware/uid', () => {
  beforeEach(() => {
    mockError = false
  })
  describe('正常系', () => {
    describe('未ログイン && cookieにuidがない', () => {
      const app = {
        $cookies: {
          get() {
            return ''
          },
          set: jest.fn()
        }
      }
      const $auth = { loggedIn: false }
      const context = { error, $axios, app, $auth }
      test('$axios.postが呼ばれない', async () => {
        await middleware(context, cb)
        expect($axios.post).toHaveBeenCalledTimes(0)
      })
    })
    describe('未ログイン && cookieにuidがある', () => {
      const app = {
        $cookies: {
          get() {
            return uid
          },
          set: jest.fn()
        }
      }
      const $auth = { loggedIn: false }
      const context = { error, $axios, app, $auth }
      test('$axios.postが呼ばれない', async () => {
        await middleware(context, cb)
        expect($axios.post).toHaveBeenCalledTimes(0)
      })
    })
    describe('ログイン済 && cookieにuidがある', () => {
      const app = {
        $cookies: {
          get() {
            return uid
          },
          set: jest.fn()
        }
      }
      const $auth = { loggedIn: true }
      const context = { error, $axios, app, $auth }
      test('$axios.postが呼ばれない', async () => {
        await middleware(context, cb)
        expect($axios.post).toHaveBeenCalledTimes(0)
      })
    })

    describe('ログイン済 && cookieにuidがない', () => {
      const app = {
        $cookies: {
          get() {
            return ''
          },
          set: jest.fn()
        }
      }
      const $auth = { loggedIn: true }
      const context = { error, $axios, app, $auth }
      test('$axios.postが正しいurlとデータで呼ばれる', async () => {
        await middleware(context, cb)
        expect($axios.post.mock.calls[0][0]).toEqual('/api/users')
        expect($axios.post.mock.calls[0][1]).toEqual({ user: loginUser })
      })

      test('cookieに返却されたuidがセットされる', () => {
        expect(app.$cookies.set.mock.calls[0][0]).toEqual('userId')
        expect(app.$cookies.set.mock.calls[0][1]).toEqual(uid)
      })
    })
  })

  describe('異常系', () => {
    describe('$axiosでエラーが発生したとき', () => {
      test('error関数が呼ばれる', async () => {
        mockError = true
        const app = {
          $cookies: {
            get() {
              return ''
            },
            set: jest.fn()
          }
        }
        const $auth = { loggedIn: true }
        const context = { error, $axios, app, $auth }
        await middleware(context, cb)
        expect(error).toHaveBeenCalled()
      })
    })
  })
})
