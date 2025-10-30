// store/incidentSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Incident {
    vehicle_reg_no: string;
    imei: string;
    distance_km: string;
    lastLocation: [number, number];
    lastUpdated: string;
    speed: number;
    battery: boolean;
    ignition: boolean;
}

interface IncidentState {
    incidents: Incident[];
    totalVehicles: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IncidentState = {
    incidents: [],
    totalVehicles: 0,
    status: 'idle',
    error: null,
};

interface FetchIncidentsParams {
    locationName?: string;
    km?: number;
    direction?: string;
}

export const fetchIncidents = createAsyncThunk(
  'incidents/fetchIncidents',
  async (params: FetchIncidentsParams = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.locationName) queryParams.append('locationName', params.locationName);
      if (params.km) queryParams.append('km', params.km.toString());
      if (params.direction) queryParams.append('direction', params.direction);
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/incidentmanagement?${queryParams.toString()}`,
        { withCredentials: true }
      );
      
      return {
        incidents: response.data.data,
        totalVehicles: response.data.totalVehicles
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incidents');
    }
  }
);

const incidentSlice = createSlice({
    name: 'incidents',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchIncidents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchIncidents.fulfilled, (state, action: PayloadAction<{ incidents: Incident[]; totalVehicles: number }>) => {
                state.status = 'succeeded';
                state.incidents = action.payload.incidents;
                state.totalVehicles = action.payload.totalVehicles;
            })
            .addCase(fetchIncidents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch incidents';
            });
    }
});

export default incidentSlice.reducer;