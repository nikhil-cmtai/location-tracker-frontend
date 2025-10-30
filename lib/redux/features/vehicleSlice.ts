import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { RootState } from '@/lib/redux/store';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master`;

export interface Vehicle {
  _id?: string;
  vehicleNumber: string;
  seatLayout?: { layoutName?: string; _id?: string } | string;
  department?: { account?: string; accountCode?: string; _id?: string } | string;
  hierarchy?: string;
  regionZone?: { name?: string; _id?: string } | string;
  depotCustomer?: { depotCustomer?: string; _id?: string } | string;
  serviceType?: { name?: string; _id?: string } | string;
  seatCapacity?: number | string;
  registrationDate?: string;
  vehicleManufacturer?: { make?: string; _id?: string } | string;
  vehicleType?: string;
  vehicleModel?: { vehicleModel?: string; _id?: string };
  ownerType?: 'OWNED' | 'HIRED' | string;
  engineNumber?: string;
  chassisNumber?: string;
  manufacturingYear?: number;
  purchaseDate?: string;
  permitName?: string;
  permitDueDate?: string;
  pucDate?: string;
  pucExpiryDate?: string;
  fitness?: string;
  vltdDevice?: { imeiNumber?: string; _id?: string } | string;
}

interface VehicleState {
  vehicles: Vehicle[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VehicleState = {
  vehicles: [],
  status: 'idle',
  error: null,
};

interface AppUser {
  hierarchy?: { level: number };
  region?: { _id: string };
  depot?: { _id: string } | string;
}

export const fetchVehicles = createAsyncThunk<Vehicle[]>('vehicles/fetchVehicles', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const user = state.auth.user as AppUser | null;

    if (!user) {
        return thunkAPI.rejectWithValue('User not authenticated');
    }

    let url = `${API_BASE_URL}/vehicle`;

    if (user.hierarchy?.level === 3 && user.region?._id) {
      url = `${API_BASE_URL}/vehicle/region/${user.region._id}`;
    } else if (user.hierarchy?.level && user.hierarchy.level >= 4) {
       const depotId = typeof user.depot === 'string' ? user.depot : user.depot?._id;
      if (depotId) {
        url = `${API_BASE_URL}/vehicle/depot/${depotId}`;
      }
    }

    const response = await axios.get(url, { withCredentials: true });
    return (response.data.data || []) as Vehicle[];
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const message = err.response?.data?.message || err.message;
    toast.error(`Failed to fetch vehicles: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

export const addNewVehicle = createAsyncThunk('vehicles/addNewVehicle', async (newVehicle: Omit<Vehicle, '_id'>, thunkAPI) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vehicle`, newVehicle, { withCredentials: true });
    toast.success('Vehicle added successfully!');
    return response.data.data as Vehicle;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const message = err.response?.data?.message || err.message;
    toast.error(`Failed to add Vehicle: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateVehicle = createAsyncThunk('vehicles/updateVehicle', async (updatedVehicle: Vehicle, thunkAPI) => {
  try {
    const { _id, ...vehicleData } = updatedVehicle;
    const response = await axios.put(`${API_BASE_URL}/vehicle/${_id}`, vehicleData, { withCredentials: true });
    toast.success('Vehicle updated successfully!');
    return response.data.data as Vehicle;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const message = err.response?.data?.message || err.message;
    toast.error(`Failed to update Vehicle: ${message}`);
    return thunkAPI.rejectWithValue(message);
  }
});

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to fetch vehicles';
      })
      .addCase(addNewVehicle.fulfilled, (state, action) => {
        state.vehicles.push(action.payload);
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const index = state.vehicles.findIndex((v) => v._id === action.payload._id);
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
      });
  },
});

export default vehicleSlice.reducer;