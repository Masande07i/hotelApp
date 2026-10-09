import type { PayloadAction } from '@reduxjs/toolkit'; 
import { createAsyncThunk, createSlice} from '@reduxjs/toolkit'

export interface SignupInputs {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface AuthUser {
  id: number
  name: string
  email: string
  profile_image: string | null
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

interface AuthState {
  inputs: SignupInputs
  user: AuthUser | null
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: AuthState = {
  inputs: {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  user: null,
  loading: false,
  error: null,
  success: false
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: SignupInputs, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || 'Registration failed'
        )
      }

      return data.user as AuthUser
    } catch {
      return thunkAPI.rejectWithValue('Unable to connect to the server')
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateRegister: (state, action: PayloadAction<Partial<SignupInputs>>) => {
      state.inputs = { ...state.inputs, ...action.payload }
    },
    clearForm: (state) => {
      state.inputs = initialState.inputs
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.success = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = false
      })
  }
})

export const { updateRegister, clearForm } = authSlice.actions

export default authSlice.reducer