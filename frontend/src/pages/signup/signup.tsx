
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from "../../store/store"
import { registerUser, updateRegister } from '../../features/authSlice'
import style from './signup.module.css'
import { Text } from '../../components/Text/text'

export const signup = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { inputs, loading, error, success } = useSelector(
    (state: RootState) => state.auth
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(registerUser(inputs))
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
        />

        {error && <p>{error}</p>}
        {success && <p>Account created successfully!</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className={style.login}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  )
}