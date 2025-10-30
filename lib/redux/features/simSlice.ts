import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface PopulatedSimService {
  _id: string;
  serviceProviderName: string;
}

export interface PopulatedVltDevice {
    _id: string;
    imeiNumber: number;
}

export interface Sim {
  _id: string;
  imeiNumber: PopulatedVltDevice;
  iccid: String;
  sim: PopulatedSimService;
  primeryMSISDN?: string;
  fallbackSim?: string | PopulatedSimService;
  fallbackMISIDN?: string;
}

interface SimState {
  sims: Sim[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SimState = {
  sims: [],
  status: 'idle',
  error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/operation`;

export const fetchSims = createAsyncThunk('sims/fetchSims', async () => {
  const response = await axios.get(`${API_BASE_URL}/vltsim`, { withCredentials: true });
  return response.data.data;
});

export const addNewSim = createAsyncThunk(
  'sims/addNewSim', 
  async (newSim: Omit<Sim, '_id' | 'sim' | 'imeiNumber'> & { sim: string; imeiNumber: string; }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/vltsim`, newSim, { withCredentials: true });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateSim = createAsyncThunk(
  'sims/updateSim', 
  async (updatedSim: { id: string } & Partial<Omit<Sim, '_id' | 'sim' | 'imeiNumber'> & { sim: string; imeiNumber: string; }>, thunkAPI) => {
    try {
      const { id, ...updateData } = updatedSim;
      const response = await axios.put(`${API_BASE_URL}/vltsim/${id}`, updateData, { withCredentials: true });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const simSlice = createSlice({
  name: 'sims',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSims.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSims.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sims = action.payload;
      })
      .addCase(fetchSims.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch SIMs';
      })
      .addCase(addNewSim.fulfilled, (state, action) => {
        state.sims.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(addNewSim.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = 'failed';
      })
      .addCase(updateSim.fulfilled, (state, action) => {
        const index = state.sims.findIndex(sim => sim._id === action.payload._id);
        if (index !== -1) {
          state.sims[index] = action.payload;
        }
        state.status = 'succeeded';
      })
      .addCase(updateSim.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = 'failed';
      });
  },
});

export default simSlice.reducer;