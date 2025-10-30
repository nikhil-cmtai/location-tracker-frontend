// store/geoFenceSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface GeoFence {
    _id: string;
    city: string;
    longitude: number;
    latitude: number;
    radius: number;
}

interface GeoFenceState {
    geoFences: GeoFence[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: GeoFenceState = {
    geoFences: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/geofence`;

export const fetchGeoFences = createAsyncThunk('geoFence/fetchGeoFences', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_BASE_URL, { withCredentials: true });
        // Expecting data as response.data.data (array of objects)
        return response.data.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch geofences');
    }
});

export const addGeoFence = createAsyncThunk(
    'geoFence/addGeoFence',
    async (
        { city, longitude, latitude, radius }: { city: string, longitude: number, latitude: number, radius: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                API_BASE_URL,
                { city, longitude, latitude, radius },
                { withCredentials: true }
            );
            toast.success('Geofence added successfully!');
            return response.data.data; // Return the complete data array
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add geofence');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updateGeoFence = createAsyncThunk(
    'geoFence/updateGeoFence',
    async (
        { id, city, longitude, latitude, radius }: { id: string, city: string, longitude: number, latitude: number, radius: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/${id}`,
                { city, longitude, latitude, radius },
                { withCredentials: true }
            );
            toast.success('Geofence updated successfully!');
            return response.data.data; // Return the complete data array
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update geofence');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deleteGeoFence = createAsyncThunk(
    'geoFence/deleteGeoFence',
    async (id: string, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`, { withCredentials: true });
            toast.success('Geofence deleted successfully!');
            return id;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete geofence');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const geoFenceSlice = createSlice({
    name: 'geoFences',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGeoFences.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGeoFences.fulfilled, (state, action: PayloadAction<GeoFence[]>) => {
                state.status = 'succeeded';
                state.geoFences = action.payload;
            })
            .addCase(fetchGeoFences.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addGeoFence.fulfilled, (state, action: PayloadAction<GeoFence | GeoFence[]>) => {
                // Handle both single object and array responses
                const geoFences = Array.isArray(action.payload) ? action.payload : [action.payload];
                geoFences.forEach(geoFence => {
                    if (!state.geoFences.find(gf => gf._id === geoFence._id)) {
                        state.geoFences.push(geoFence);
                    }
                });
            })
            .addCase(updateGeoFence.fulfilled, (state, action: PayloadAction<GeoFence | GeoFence[]>) => {
                // Handle both single object and array responses
                const geoFences = Array.isArray(action.payload) ? action.payload : [action.payload];
                geoFences.forEach(geoFence => {
                    const index = state.geoFences.findIndex(gf => gf._id === geoFence._id);
                    if (index !== -1) {
                        state.geoFences[index] = geoFence;
                    } else {
                        // If not found, add it
                        state.geoFences.push(geoFence);
                    }
                });
            })
            .addCase(deleteGeoFence.fulfilled, (state, action: PayloadAction<string>) => {
                state.geoFences = state.geoFences.filter(gf => gf._id !== action.payload);
            });
    }
});

export default geoFenceSlice.reducer;