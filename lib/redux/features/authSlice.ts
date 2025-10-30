import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const AUTH_API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth`;

interface Hierarchy {
  _id: string;
  name: string;
  level: number;
}

interface User {
  _id: string;
  username: string;
  email: string;
  phone: number;
  hierarchy: Hierarchy;
  roleName: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  forgotPasswordStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  resetPasswordStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  forgotPasswordMessage: string | null;
  resetPasswordMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: true,
  status: 'idle',
  error: null,
  forgotPasswordStatus: 'idle',
  resetPasswordStatus: 'idle',
  forgotPasswordMessage: null,
  resetPasswordMessage: null,
};

export const signupUser = createAsyncThunk('auth/signupUser', async (userData: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/signup`, userData, { withCredentials: true });
    return response.data.user;
  } catch (err: any) {
    return rejectWithValue(err.response.data.message || 'Signup failed');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (loginData: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, loginData, { withCredentials: true });
    return response.data.user;
  } catch (err: any) {
    return rejectWithValue(err.response.data.message || 'Login failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await axios.post(`${AUTH_API_URL}/logout`, {}, { withCredentials: true });
});

export const checkAuthStatus = createAsyncThunk('auth/checkAuthStatus', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/check`, {}, { withCredentials: true });
    return response.data.user;
  } catch (err: any) {
    return rejectWithValue('Not authenticated');
  }
});

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword', 
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/forgotpassword`, { email });
      return response.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword', 
  async (resetData: { token: string; password: string; confirmPassword: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/resetpassword`, resetData);
      return response.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reset password');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearForgotPasswordState: (state) => {
      state.forgotPasswordStatus = 'idle';
      state.forgotPasswordMessage = null;
    },
    clearResetPasswordState: (state) => {
      state.resetPasswordStatus = 'idle';
      state.resetPasswordMessage = null;
    },
    clearAuthErrors: (state) => {
      state.error = null;
      state.forgotPasswordMessage = null;
      state.resetPasswordMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = 'idle';
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = 'failed';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordStatus = 'loading';
        state.forgotPasswordMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordStatus = 'succeeded';
        state.forgotPasswordMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordStatus = 'failed';
        state.forgotPasswordMessage = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordStatus = 'loading';
        state.resetPasswordMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordStatus = 'succeeded';
        state.resetPasswordMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordStatus = 'failed';
        state.resetPasswordMessage = action.payload as string;
      });
  },
});

export const { 
  clearForgotPasswordState, 
  clearResetPasswordState, 
  clearAuthErrors 
} = authSlice.actions;

export default authSlice.reducer;