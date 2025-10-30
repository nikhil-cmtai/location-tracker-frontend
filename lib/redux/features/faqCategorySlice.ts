import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/helpandsupport`;


export interface FaqCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewFaqCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateFaqCategoryPayload extends Partial<NewFaqCategoryPayload> {
  _id: string;
}

interface FaqCategoryState {
  faqCategories: FaqCategory[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FaqCategoryState = {
  faqCategories: [],
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchFaqCategories = createAsyncThunk(
  'faqCategory/fetchFaqCategories',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/faq-categories`, {
      withCredentials: true,
    });
    if (!response.data.success) {
      throw new Error('Failed to fetch FAQ categories');
    }
    return response.data.data;
  }
);

export const addNewFaqCategory = createAsyncThunk(
  'faqCategory/addNewFaqCategory',
  async (faqData: NewFaqCategoryPayload) => {
    const { ...payload } = faqData;
    const response = await fetch(`${API_BASE_URL}/faq-categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Failed to add FAQ category');
    }
    return response.json();
  }
);

export const updateFaqCategory = createAsyncThunk(
  'faqs/updateFaq',
  async (faqData: UpdateFaqCategoryPayload) => {
    const { _id, ...updateData } = faqData;
    const response = await fetch(`${API_BASE_URL}/faq-categories/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) {
      throw new Error('Failed to update FAQ');
    }
    return response.json();
  }
);

export const deleteFaqCategory = createAsyncThunk(
  'faqCategory/deleteFaqCategory',
  async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/faq-categories/${id}`, {
      withCredentials: true,
    });
    if (!response.data.success) {
      throw new Error('Failed to delete FAQ category');
    }
    return response.data.data;
  }
);

const faqCategorySlice = createSlice({
  name: 'faqCategory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch FAQ categories
      .addCase(fetchFaqCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFaqCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.faqCategories = action.payload;
        state.error = null;
      })
      .addCase(fetchFaqCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch FAQ categories';
      })
      // Add new FAQ category
      .addCase(addNewFaqCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addNewFaqCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.faqCategories.push(action.payload);
        state.error = null;
      })
      .addCase(addNewFaqCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add FAQ category';
      })
      // Update FAQ category
      .addCase(updateFaqCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateFaqCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.faqCategories.findIndex(faq => faq._id === action.payload._id);
        if (index !== -1) {
          state.faqCategories[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateFaqCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update FAQ category';
      })
      // Delete FAQ category
      .addCase(deleteFaqCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteFaqCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.faqCategories = state.faqCategories.filter(faq => faq._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteFaqCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete FAQ category';
      });
  },
});

export const { clearError } = faqCategorySlice.actions;
export default faqCategorySlice.reducer;
