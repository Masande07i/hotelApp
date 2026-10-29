import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from "../../store/store"
import { registerUser, updateRegister } from '../../features/authSlice'
import style from './signup.module.css'
import { Text } from '../../components/Text/text'
import { Button } from '../../components/button/button'
import { useNavigate, Link } from 'react-router-dom'

export const signup = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { inputs, loading, error } = useSelector((state: RootState) => state.auth)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (inputs.password !== inputs.confirmPassword) {
      return
    }

    try {
      await dispatch(registerUser(inputs)).unwrap()
      navigate('/login')
    } catch {
      // The error is displayed from Redux state.
    }
  }

  return (
    <div className={style.signup}>
      <form className={style.form} onSubmit={handleSubmit}>
        <Text variant="h1">Create Account</Text>
        <Text variant="p">Join Havenly and find your perfect stay.</Text>

        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          value={inputs.name}
          onChange={(event) =>
            dispatch(updateRegister({ name: event.target.value }))
          }
          required
        />

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={inputs.email}
          onChange={(event) =>
            dispatch(updateRegister({ email: event.target.value }))
          }
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={inputs.password}
          onChange={(event) =>
            dispatch(updateRegister({ password: event.target.value }))
          }
          required
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={inputs.confirmPassword}
          onChange={(event) =>
            dispatch(updateRegister({ confirmPassword: event.target.value }))
          }
          required
        />

        {inputs.password !== inputs.confirmPassword &&
          inputs.confirmPassword && (
            <p>Passwords do not match.</p>
          )}

        {error && <p>{error}</p>}

        <Button
          label={loading ? 'Creating Account...' : 'Create Account'}
          type="submit"
        />

        <Text variant="p" className={style.login}>
          Already have an account? <Link to="/login">Log in</Link>
        </Text>
      </form>
    </div>
  )
}