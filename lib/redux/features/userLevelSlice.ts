import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin`;

export interface UserLevel {
  _id: string;
  levelName: string;
  description: string;
  order: number;
}

interface UserLevelState {
  userLevels: UserLevel[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserLevelState = {
  userLevels: [],
  status: 'idle',
  error: null,
};

export const fetchUserLevels = createAsyncThunk(
  'userLevel/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/userlevel`, { withCredentials: true });
      return response.data.message || response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user levels';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const addUserLevel = createAsyncThunk(
  'userLevel/add',
  async (data: Omit<UserLevel, '_id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/userlevel`, data, { withCredentials: true });
      toast.success('User Level added successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add user level';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateUserLevel = createAsyncThunk(
  'userLevel/update',
  async ({ id, data }: { id: string; data: Omit<UserLevel, '_id'> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/userlevel/${id}`, data, { withCredentials: true });
      toast.success('User Level updated successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user level';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const userLevelSlice = createSlice({
  name: 'userLevel',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user levels
      .addCase(fetchUserLevels.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserLevels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userLevels = action.payload;
        state.error = null;
      })
      .addCase(fetchUserLevels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Add user level
      .addCase(addUserLevel.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addUserLevel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userLevels.push(action.payload);
        state.error = null;
      })
      .addCase(addUserLevel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Update user level
      .addCase(updateUserLevel.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUserLevel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.userLevels.findIndex(ul => ul._id === action.payload._id);
        if (index !== -1) {
          state.userLevels[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUserLevel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userLevelSlice.actions;
export default userLevelSlice.reducer;