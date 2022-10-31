import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react'
import { FormStrategy } from 'remix-auth-form'
import type {
  ErrorMessages,
  ServerFormInfo,
  Validations,
} from 'remix-validity-state'
import {
  useValidatedInput,
  FormContextProvider,
  validateServerFormData,
} from 'remix-validity-state'
import { authenticator } from '~/services/auth.server'
import { commitSession, getSession } from '~/services/session.server'
import { safeRedirect } from '~/utils/misc'

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  })
  const session = await getSession(request.headers.get('cookie'))
  const error = session.get(authenticator.sessionErrorKey)
  return json(
    { formError: error?.message },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  )
}
type MyFormValidations = {
  username: Validations
  password: Validations
}

type ActionData = {
  serverFormInfo: ServerFormInfo<MyFormValidations>
}

const formValidations: MyFormValidations = {
  username: {
    required: true,
    minLength: 2,
    maxLength: 15,
  },
  password: {
    type: 'password',
    required: true,
    minLength: 6,
    maxLength: 100,
  },
}

const errorMessages: ErrorMessages = {
  valueMissing: (_, name) => `The ${name} field is required`,
  typeMismatch: (_, name) => `The ${name} field is invalid`,
  tooShort: (minLength, name) =>
    `The ${name} field must be at least ${minLength} characters`,
  tooLong: (maxLength, name) =>
    `The ${name} field must be less than ${maxLength} characters`,
}

export async function action({ request }: ActionArgs) {
  const formData = await request.clone().formData()
  const serverFormInfo = await validateServerFormData(formData, formValidations)
  if (!serverFormInfo.valid) {
    return json<ActionData>({ serverFormInfo }, { status: 400 })
  }
  const remember = formData.get('remember') === 'on'
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')

  const userId = await authenticator.authenticate(FormStrategy.name, request, {
    failureRedirect: '/login',
  })
  const session = await getSession(request.headers.get('cookie'))
  session.set(authenticator.sessionKey, userId)

  const newCookie = await commitSession(session, {
    maxAge: remember
      ? 60 * 60 * 24 * 7 // 7 days
      : undefined,
  })
  return redirect(redirectTo, {
    headers: { 'Set-Cookie': newCookie },
  })
}

export const meta: MetaFunction = () => {
  return {
    title: 'Login - Hotel Rental',
  }
}

function NameField() {
  const field = useValidatedInput<MyFormValidations>({ name: 'username' })
  return (
    <div>
      <label
        {...field.getLabelAttrs({
          className: 'block text-sm font-medium text-gray-700 capitalize',
        })}
      >
        Username
      </label>
      <div className="mt-1">
        <input
          {...field.getInputAttrs({
            autoFocus: true,
            autoComplete: 'username',
            className:
              'w-full rounded border border-gray-500 px-2 py-1 text-lg',
          })}
        />

        {field.info.touched && field.info.errorMessages ? (
          <ul {...field.getErrorsAttrs({ className: '' })}>
            {Object.values(field.info.errorMessages).map(msg => (
              <li className="pt-1 text-red-700" key={msg}>
                {msg}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

function PasswordField() {
  const field = useValidatedInput<MyFormValidations>({ name: 'password' })
  return (
    <div>
      <label
        {...field.getLabelAttrs({
          className: 'block text-sm font-medium text-gray-700 capitalize',
        })}
      >
        Password
      </label>
      <div className="mt-1">
        <input
          {...field.getInputAttrs({
            autoFocus: false,
            autoComplete: 'current-password',
            className:
              'w-full rounded border border-gray-500 px-2 py-1 text-lg',
          })}
        />

        {field.info.touched && field.info.errorMessages ? (
          <ul {...field.getErrorsAttrs({ className: '' })}>
            {Object.values(field.info.errorMessages).map(msg => (
              <li className="pt-1 text-red-700" key={msg}>
                {msg}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const redirectTo = searchParams.get('redirectTo') || '/'

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <FormContextProvider
          value={{
            formValidations,
            errorMessages: errorMessages,
            serverFormInfo: actionData?.serverFormInfo,
          }}
        >
          <Form
            method="post"
            className="space-y-6"
            aria-invalid={data.formError ? true : undefined}
            aria-describedby="form-error"
          >
            <NameField />
            <PasswordField />

            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <input type="hidden" name="redirectTo" value={redirectTo} />
            {data.formError ? (
              <div className="pt-1 text-red-700" id="form-error">
                {data.formError}
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-6">
              <button
                type="submit"
                className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Log in
              </button>
            </div>
          </Form>
        </FormContextProvider>

        <Link to="/signup" className="text-blue-600 underline">
          New here?
        </Link>
      </div>
    </div>
  )
}
