import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin`;

export interface Hierarchy {
  _id: string;
  name: string;
  level: number;
  createdAt?: string;
  updatedAt?: string;
}

interface HierarchyState {
  hierarchies: Hierarchy[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: HierarchyState = {
  hierarchies: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  updateStatus: 'idle',
};

export const fetchHierarchies = createAsyncThunk(
  'hierarchy/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hierarchy`, { withCredentials: true });
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hierarchies');
    }
  }
);

export const addHierarchy = createAsyncThunk(
  'hierarchy/add',
  async (data: Omit<Hierarchy, '_id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/hierarchy`, data, { withCredentials: true });
      toast.success('Hierarchy added successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add hierarchy';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateHierarchy = createAsyncThunk(
  'hierarchy/update',
  async ({ id, data }: { id: string; data: Omit<Hierarchy, '_id'> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/hierarchy/${id}`, data, { withCredentials: true });
      toast.success('Hierarchy updated successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update hierarchy';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const hierarchySlice = createSlice({
  name: 'hierarchy',
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.createStatus = 'idle';
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch hierarchies
      .addCase(fetchHierarchies.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHierarchies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.hierarchies = action.payload;
        state.error = null;
      })
      .addCase(fetchHierarchies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Add hierarchy
      .addCase(addHierarchy.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(addHierarchy.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.hierarchies.push(action.payload);
        state.error = null;
      })
      .addCase(addHierarchy.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Update hierarchy
      .addCase(updateHierarchy.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateHierarchy.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.hierarchies.findIndex(h => h._id === action.payload._id);
        if (index !== -1) {
          state.hierarchies[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateHierarchy.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetCreateStatus, resetUpdateStatus, clearError } = hierarchySlice.actions;
export default hierarchySlice.reducer;
