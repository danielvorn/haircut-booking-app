import { TbLock, TbMail, TbUser } from 'react-icons/tb'
import { useRegisterMutation } from '../mutations/auth.mutation'

interface Credentials {
  username: string
  password: string
  email: string
}

const Register: React.FC = () => {
  const { mutate: registerUser, isLoading, isError, error } = useRegisterMutation()

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const credentials: Credentials = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      email: formData.get('email') as string
    }

    registerUser(credentials)
  }

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-md w-full">
        <form
          method="post"
          onSubmit={handleRegister}
          className="rounded-md p-14 shadow-lg color-component-primary">
          <h2 className="font text-xl mb-6 text-neutral-800 dark:text-neutral-100">Sign Up</h2>
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
            <div className="font-light flex items-center rounded-md p-2 mb-4 shadow-xl bg-white text-black">
              <TbMail className="text-lg" />
              <input
                type="email"
                id="email"
                name="email"
                className="flex-grow w-full ml-2 outline-none bg-white"
                placeholder="Email"
              />
            </div>
            {isError && (
              <div className="flex justify-start text-sm">
                <p className="text-red-400">Registration failed. Please try again.</p>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-neutral-500 text-neutral-100 hover:bg-neutral-700 hover:text-neutral-200 dark:bg-neutral-500 dark:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900 w-full py-2 px-4 rounded">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
