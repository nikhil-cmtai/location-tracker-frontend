import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface NearbyVehicle {
    sNo: number;
    vehicleNumber: string;
    imeiNumber: string;
    distance: number;
    latitude: number;
    longitude: number;
    location: string;
    lastUpdate: string;
}

interface NearbyVehiclesState {
    reportData: NearbyVehicle[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface FetchParams {
    geoFenceId?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    vehicleNumber?: string;
}

const initialState: NearbyVehiclesState = {
    reportData: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchNearbyVehicles = createAsyncThunk(
  'nearbyVehicles/fetchNearbyVehicles',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/nearbyvehicles`, { params, withCredentials: true });
      toast.success('Report generated successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch nearby vehicles';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const nearbyVehiclesSlice = createSlice({
    name: 'nearbyVehicles',
    initialState,
    reducers: {
        clearNearbyVehicles: (state) => {
            state.reportData = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNearbyVehicles.pending, (state) => {
                state.status = 'loading';
                state.reportData = [];
                state.error = null;
            })
            .addCase(fetchNearbyVehicles.fulfilled, (state, action: PayloadAction<NearbyVehicle[]>) => {
                state.status = 'succeeded';
                state.reportData = action.payload;
            })
            .addCase(fetchNearbyVehicles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearNearbyVehicles } = nearbyVehiclesSlice.actions;
export default nearbyVehiclesSlice.reducer;

