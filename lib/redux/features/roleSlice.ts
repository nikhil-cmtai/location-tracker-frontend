import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rbac`;

export interface Role {
  _id?: string;
  role: string;
  hierarchy?:  {name:string,_id:string,level:number};
  hierarchyOrder?: number;
  userLevel?: {name:string,_id:string,level:number};
  userLevelOrder?: number;
  permissions: any; // Permissions object can be complex, using 'any' for now
}

interface RoleState {
  roles: Role[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RoleState = {
  roles: [],
  status: 'idle',
  error: null,
};

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
  const response = await axios.get(`${API_BASE_URL}/role`, { withCredentials: true });
  return response.data.data;
});

export const addNewRole = createAsyncThunk('roles/addNewRole', async (newRole: Omit<Role, '_id' | 'permissions'>, thunkAPI) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/role`, newRole, { withCredentials: true });
    toast.success('Role added successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.error || error.message;
    toast.error(`Failed to add Role: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateRole = createAsyncThunk('roles/updateRole', async (updatedRole: Pick<Role, '_id' | 'role' | 'hierarchy' | 'hierarchyOrder' | 'userLevel' | 'userLevelOrder' | 'permissions'>, thunkAPI) => {
  try {
    const { _id, ...roleData } = updatedRole;
    const response = await axios.put(`${API_BASE_URL}/role/${_id}`, roleData, { withCredentials: true });
    toast.success('Role updated successfully!');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.error || error.message;
    toast.error(`Failed to update Role: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch roles';
      })
      .addCase(addNewRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      });
  },
});

export default roleSlice.reducer;