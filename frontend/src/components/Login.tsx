import { FcGoogle } from 'react-icons/fc'
import { TbLock, TbUser } from 'react-icons/tb'
import { NavLink } from 'react-router-dom'
import { useLoginMutation } from '../mutations/auth.mutation'
import { SERVER_URL } from '../secrets'

interface Credentials {
  username: string
  password: string
}

const Login: React.FC = () => {
  const { mutate: loginUser, isLoading, isError, error } = useLoginMutation()

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const credentials: Credentials = {
      username: formData.get('username') as string,
      password: formData.get('password') as string
    }

    loginUser(credentials)
  }

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-md w-full">
        <form
          method="post"
          onSubmit={handleLogin}
          className="rounded-md p-14 shadow-lg color-component-primary">
          <h2 className="font text-xl mb-6 text-neutral-800 dark:text-neutral-100">Log in</h2>
          <div className="mb-6 text-light-text">
            <div className="font-light flex items-center rounded-md p-2 mb-4 shadow-xl bg-white text-black">
              <TbUser className="text-lg" />
              <input
                type="text"
                id="username"
                name="username"
                className="flex-grow w-full ml-2 outline-none bg-white"
                placeholder="Username"
              />
            </div>
            <div className="font-light flex items-center rounded-md p-2 mb-4 shadow-xl bg-white text-black">
              <TbLock className="text-lg" />
              <input
                type="password"
                id="password"
                name="password"
                className="flex-grow w-full ml-2 outline-none bg-white"
                placeholder="Password"
              />
            </div>
            {error && (
              <div className="flex justify-start text-sm">
                <p className="text-red-400">Wrong Username or Password</p>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-neutral-500 text-neutral-100 hover:bg-neutral-700 hover:text-neutral-200 dark:bg-neutral-500 dark:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900 w-full py-2 px-4 rounded">
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
          <div className="mt-4">
            <p className="text-center text-sm text-neutral-800 dark:text-neutral-200">Or</p>
            <NavLink
              to={`${SERVER_URL}/auth/google`}
              className="color-accent flex items-center justify-center mt-2 py-2 px-4 rounded">
              <FcGoogle className="mr-2" />
              Log in with Google
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
