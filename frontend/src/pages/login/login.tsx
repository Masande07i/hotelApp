import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../store/store'
import { loginUser, updateLogin } from '../../features/authSlice'
import style from './login.module.css'
import { Text } from '../../components/Text/text'
import { Button } from '../../components/button/button'
import { useNavigate, Link } from 'react-router-dom'

export const login = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { loginInputs, loading, error } = useSelector(
    (state: RootState) => state.auth
  )

 
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  try {
    const result = await dispatch(loginUser(loginInputs)).unwrap()

    if (result.user.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/')
    }
  } catch {
    // The error is displayed from Redux state.
  }
}

  return (
    <div className={style.login}>
      <form className={style.form} onSubmit={handleSubmit}>
        <Text variant="h1">Welcome Back</Text>
        <Text variant="p">Log in to your account</Text>

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={loginInputs.email}
          onChange={(event) =>
            dispatch(updateLogin({ email: event.target.value }))
          }
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={loginInputs.password}
          onChange={(event) =>
            dispatch(updateLogin({ password: event.target.value }))
          }
          required
        />

        {error && <p>{error}</p>}

        <Button
          label={loading ? 'Logging in...' : 'Log in'}
          type="submit"
        />

        <Text variant="p" className={style.signup}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Text>
      </form>
    </div>
  )
}