// store/rawDataSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface TrackingPacket {
    location: {
        type: string;
        coordinates: [number, number];
    };
    _id: string;
    protocol: string;
    packet_type: string;
    timestamp: string;
    raw_data: string;
    header: string;
    vendor_id: string;
    firmware_version: string;
    message_type: string;
    message_id: number;
    message_description: string;
    packet_status: string;
    imei: string;
    vehicle_reg_no: string;
    fix_status: boolean;
    date: string;
    time: string;
    formatted_datetime: string;
    latitude: number;
    latitude_dir: string;
    longitude: number;
    longitude_dir: string;
    speed_kmh: number;
    heading: number;
    satellites: number;
    altitude_m: number;
    pdop: number;
    hdop: number;
    operator_name: string;
    ignition: boolean;
    main_power: boolean;
    main_voltage: number;
    battery_voltage: number;
    emergency_status: boolean;
    tamper_alert: string;
    gsm_signal: number;
    mcc: number;
    mnc: number;
    lac: string;
    cell_id: string;
    neighbor_cell_1_signal: number;
    neighbor_cell_1_lac: string;
    neighbor_cell_1_cell_id: string;
    neighbor_cell_2_signal: number;
    neighbor_cell_2_lac: string;
    neighbor_cell_2_cell_id: string;
    neighbor_cell_3_signal: number;
    neighbor_cell_3_lac: string;
    neighbor_cell_3_cell_id: string;
    neighbor_cell_4_signal: number;
    neighbor_cell_4_lac: string;
    neighbor_cell_4_cell_id: string;
    digital_inputs: string;
    digital_outputs: string;
    frame_number: string;
    analog_input_1: number;
    analog_input_2: number;
    delta_distance: string;
    ota_response: string;
    checksum: string;
    createdAt: string;
    updatedAt: string;
    createdAtISTStored: string;
    updatedAtISTStored: string;
    __v: number;
    createdAtIST: string;
    updatedAtIST: string;
    id: string;
}

interface RawDataState {
    packets: TrackingPacket[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface FetchParams {
    imei: string;
    startDate: string;
    endDate: string;
}

const initialState: RawDataState = {
    packets: [],
    status: 'idle',
    error: null,
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`;

export const fetchRawData = createAsyncThunk(
  'rawData/fetchRawData',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rawdata`, {
        params,
        withCredentials: true,
      });
      toast.success(`${response.data.totalRecords} records found!`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch raw data';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const rawDataSlice = createSlice({
    name: 'rawData',
    initialState,
    reducers: {
        clearRawData: (state) => {
            state.packets = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRawData.pending, (state) => {
                state.status = 'loading';
                state.packets = [];
                state.error = null;
            })
            .addCase(fetchRawData.fulfilled, (state, action: PayloadAction<TrackingPacket[]>) => {
                state.status = 'succeeded';
                state.packets = action.payload;
            })
            .addCase(fetchRawData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearRawData } = rawDataSlice.actions;
export default rawDataSlice.reducer;