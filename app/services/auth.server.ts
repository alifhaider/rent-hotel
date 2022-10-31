import { Authenticator } from 'remix-auth'

import { FormStrategy } from 'remix-auth-form'
import invariant from 'tiny-invariant'
import { sessionStorage } from './session.server'
import { verifyLogin } from '~/models/user.server'

export const authenticator = new Authenticator<string>(sessionStorage, {
  sessionKey: 'token',
})

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get('username')
    const password = form.get('password')

    invariant(typeof username === 'string', 'username must be a string')
    invariant(username.length > 0, 'username must not be empty')

    invariant(
      typeof password === 'string',
      `password must be a string ${JSON.stringify(password)}`,
    )
    invariant(typeof password === 'string', 'password must be a string')
    invariant(password.length > 0, 'password must not be empty')
    const user = await verifyLogin(username, password)
    if (!user) {
      throw new Error('Invalid username or password')
    }

    return user.id
  }),
  FormStrategy.name,
)
