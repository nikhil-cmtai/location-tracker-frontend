import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin`;

interface PopulatedField {
  _id: string;
  hierarchyName?: string;
  levelName?: string;
  username?: string;
}

export interface UserManagement {
  _id: string;
  username: string;
  email: string;
  phone: string;
  hierarchy: PopulatedField;
  role: string;
  userLevel: PopulatedField;
  userAdmin: PopulatedField;
  parentId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface UsersState {
  users: UserManagement[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/users`, { withCredentials: true });
    return response.data.message;
  }
);

export const addNewUser = createAsyncThunk(
  'users/addNewUser',
  async (
    newUser: {
      username: string;
      email: string;
      password: string;
      phone: string;
      hierarchy: string;
      role: string;
      userLevel: string;
      userAdmin: string;
      parentId: string;
      status: 'active' | 'inactive';
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/adduser`, newUser, { withCredentials: true });
      toast.success('User added successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Failed to add user: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (
    updatedUser: {
      id: string;
      username: string;
      email: string;
      phone: string;
      hierarchy: string;
      role: string;
      userLevel: string;
      userAdmin: string;
      parentId: string;
      status: 'active' | 'inactive';
    },
    thunkAPI
  ) => {
    try {
      const { id, ...updateData } = updatedUser;
      const response = await axios.put(`${API_BASE_URL}/adduser/${id}`, updateData, { withCredentials: true });
      toast.success('User updated successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Failed to update user: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(addNewUser.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        } else {
          state.status = 'idle';
        }
      });
  },
});

export default usersSlice.reducer;

