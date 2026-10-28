import type { PayloadAction } from '@reduxjs/toolkit'; 
import { createAsyncThunk, createSlice} from '@reduxjs/toolkit'

export interface SignupInputs {
  name: string
  email: string
  password: string
  confirmPassword: string
}
export interface LoginInputs {
  email: string
  password: string
}
interface RegisterResponse {
  message: string
  userId: number
  role: 'customer' | 'admin'
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

interface LoginResponse {
  message: string
  token: string
  user: AuthUser
}

interface UpdateUserProfileInputs {
  name: string
  email: string
}
interface AuthState {
  inputs: SignupInputs
  loginInputs: LoginInputs
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
  success: boolean
  isEditingProfile: boolean
  profileInputs: {
  name: string
  email: string
}
}

const initialState: AuthState = {
  inputs: {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  loginInputs: {
  email: '',
  password: ''
},
  isEditingProfile: false,
  profileInputs: {
    name: '',
    email: ''
  },
  token: null,
  user: null,
  loading: false,
  error: null,
  success: false
}

export const registerUser = createAsyncThunk<
  RegisterResponse,
  SignupInputs,
  { rejectValue: string }
>(
  'auth/registerUser',
  async (userData, thunkAPI) => {
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

      return data as RegisterResponse
    } catch {
      return thunkAPI.rejectWithValue(
        'Unable to connect to the server'
      )
    }
  }
)

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginInputs,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (userData, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || 'Login failed'
        )
      }

      return data as LoginResponse
    } catch {
      return thunkAPI.rejectWithValue(
        'Unable to connect to the server'
      )
    }
  }
)

export const googleLoginUser = createAsyncThunk<
  LoginResponse,
  string,
  { rejectValue: string }
>(
  'auth/googleLoginUser',
  async (idToken, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken })
      })

      const data = await response.json()

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || 'Google login failed'
        )
      }

      return data as LoginResponse
    } catch {
      return thunkAPI.rejectWithValue(
        'Unable to connect to the server'
      )
    }
  }
)

export const updateUserProfile = createAsyncThunk<
  AuthUser,
  UpdateUserProfileInputs,
  { state: { auth: AuthState }; rejectValue: string }
>(
  'auth/updateUserProfile',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || 'Failed to update profile'
        )
      }

      return data.user as AuthUser
    } catch {
      return thunkAPI.rejectWithValue(
        'Unable to connect to the server'
      )
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
   updateLogin: (state, action: PayloadAction<Partial<LoginInputs>>) => {
      state.loginInputs = { ...state.loginInputs, ...action.payload }
},
    clearForm: (state) => {
      state.inputs = initialState.inputs
      state.error = null
      state.success = false
    },
   logout: (state) => {
    localStorage.removeItem("auth")
    state.user = null
    state.token = null
    state.success = false
    state.error = null
    state.isEditingProfile = false
    state.profileInputs = {
      name: '',
      email: ''
    }
  },

   startEditingProfile: (state) => {
  state.isEditingProfile = true
  state.profileInputs = {
    name: state.user?.name ?? '',
    email: state.user?.email ?? ''
  }
    },
    updateProfileInputs: (
      state,
      action: PayloadAction<Partial<{ name: string; email: string }>>
    ) => {
      state.profileInputs = {
        ...state.profileInputs,
        ...action.payload
      }
    },
    cancelEditingProfile: (state) => {
      state.isEditingProfile = false
      state.profileInputs = {
        name: state.user?.name ?? '',
        email: state.user?.email ?? ''
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = false
      })

     .addCase(loginUser.pending, (state) => {
      state.loading = true
      state.error = null
      state.success = false
    })

    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false
      state.token = action.payload.token
      console.log("Token saved after login:", !!action.payload.token)
      state.user = action.payload.user
      localStorage.setItem("auth", JSON.stringify({
        token: action.payload.token,
        user: action.payload.user
  }))
      state.success = true
    })

    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
      state.success = false
      })
      .addCase(googleLoginUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })

      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user

        localStorage.setItem("auth", JSON.stringify({
          token: action.payload.token,
          user: action.payload.user
        }))

        state.success = true
      })

      .addCase(googleLoginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Google login failed'
        state.success = false
      })

    .addCase(updateUserProfile.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(updateUserProfile.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
      state.success = true
      state.isEditingProfile = false
    })
    .addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || 'Failed to update profile'
      state.success = false
    })
  }
})

export const { updateRegister,updateLogin, clearForm,logout,startEditingProfile,updateProfileInputs,cancelEditingProfile} = authSlice.actions

export default authSlice.reducer