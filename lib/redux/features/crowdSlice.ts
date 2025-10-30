// store/crowdManagementSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface CrowdEventLocation {
    lat: number;
    lon: number;
}

export interface CrowdEvent {
    eventType: 'ENTRY' | 'EXIT';
    entryTime: string;
    entryLocation: CrowdEventLocation;
    exitTime: string | null;
    exitLocation: CrowdEventLocation | null;
    durationMinutes: number;
    durationFormatted: string;
    entrySpeed_kmh: number | null;
    exitSpeed_kmh: number | null;
    entryHeading: number | null;
    exitHeading: number | null;
    stillInside: boolean;
    lastKnownLocation?: CrowdEventLocation;
    lastKnownTime?: string;
}

export interface CrowdVehicleEntry {
    vehicle_reg_no: string;
    imei: string;
    events: CrowdEvent[];
}

export interface CrowdPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface CrowdSummary {
    totalVehicles: number;
    totalEvents: number;
    criteria: string;
    timeRange: {
        start: string;
        end: string;
    };
    geofence: {
        center: {
            lon: number;
            lat: number;
        },
        radiusMeters: number;
    };
}

export interface CrowdManagementState {
    vehicles: CrowdVehicleEntry[];
    pagination: CrowdPagination | null;
    summary: CrowdSummary | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CrowdManagementState = {
    vehicles: [],
    pagination: null,
    summary: null,
    status: 'idle',
    error: null
};

export interface FetchCrowdManagementParams {
    startDate?: string;
    endDate?: string;
    geoFence?: string;
    criteria?: string;
    region?: string;
    depot?: string;
    vehicleNumber?: string;
    page?: number;
}

export const fetchCrowdManagementData = createAsyncThunk(
    'crowdManagement/fetchData',
    async (params: FetchCrowdManagementParams = {}, { rejectWithValue }) => {
        try {
            const body = {
                geo: params.geoFence,
                criteria: params.criteria?.toLowerCase().replace(' / ', '').replace(' only', '') || 'entry',
                startDate: params.startDate,
                endDate: params.endDate,
                page: params.page || 1
            };
            
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/reports/crowedmanagement`,
                { params: body, withCredentials: true }
            );

            const data = response.data;
            return {
                vehicles: Array.isArray(data.data) ? data.data : [],
                pagination: data.pagination || null,
                summary: data.summary || null
            };
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ||
                (typeof error?.message === "string" ? error.message : 'Failed to fetch crowd management data')
            );
        }
    }
);

const crowdManagementSlice = createSlice({
    name: 'crowdManagement',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCrowdManagementData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                fetchCrowdManagementData.fulfilled,
                (
                    state,
                    action: PayloadAction<{
                        vehicles: CrowdVehicleEntry[];
                        pagination: CrowdPagination | null;
                        summary: CrowdSummary | null;
                    }>
                ) => {
                    state.status = 'succeeded';
                    state.vehicles = action.payload.vehicles;
                    state.pagination = action.payload.pagination;
                    state.summary = action.payload.summary;
                    state.error = null;
                }
            )
            .addCase(fetchCrowdManagementData.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    (typeof action.payload === "string" && action.payload) ||
                    action.error.message ||
                    'Failed to fetch crowd management data';
            });
    }
});

export default crowdManagementSlice.reducer;