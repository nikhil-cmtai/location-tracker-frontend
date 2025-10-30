import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/helpandsupport`;

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewFaqPayload {
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
}

export interface UpdateFaqPayload extends Partial<NewFaqPayload> {
  _id: string;
}

interface FaqsState {
  faqs: Faq[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FaqsState = {
  faqs: [],
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchFaqs = createAsyncThunk(
  'faqs/fetchFaqs',
  async () => {
    const response = await fetch(`${API_BASE_URL}/faqs`);
    if (!response.ok) {
      throw new Error('Failed to fetch FAQs');
    }
    return response.json();
  }
);

export const addNewFaq = createAsyncThunk(
  'faqs/addNewFaq',
  async (faqData: NewFaqPayload) => {
    const response = await fetch(`${API_BASE_URL}/faqs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(faqData),
    });
    if (!response.ok) {
      throw new Error('Failed to add FAQ');
    }
    return response.json();
  }
);

export const updateFaq = createAsyncThunk(
  'faqs/updateFaq',
  async (faqData: UpdateFaqPayload) => {
    const { _id, ...updateData } = faqData;
    const response = await fetch(`${API_BASE_URL}/faqs/${_id}`, {
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

export const deleteFaq = createAsyncThunk(
  'faqs/deleteFaq',
  async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/faqs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete FAQ');
    }
    return id;
  }
);

const faqsSlice = createSlice({
  name: 'faqs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch FAQs
      .addCase(fetchFaqs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle API response structure: { success: true, data: [...] }
        let faqsData = [];
        if (action.payload && typeof action.payload === 'object') {
          if (Array.isArray(action.payload)) {
            faqsData = action.payload;
          } else if (action.payload.data && Array.isArray(action.payload.data)) {
            faqsData = action.payload.data;
          }
        }
        
        // Map the data to ensure all required fields are present with defaults
        state.faqs = faqsData.map((faq: any) => ({
          _id: faq._id || '',
          question: faq.question || '',
          answer: faq.answer || '',
          category: faq.category || { _id: '', name: '' },
          isActive: faq.isActive !== undefined ? faq.isActive : true, // Default to true if not provided
          createdAt: faq.createdAt || '',
          updatedAt: faq.updatedAt || '',
        }));
        state.error = null;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch FAQs';
      })
      // Add new FAQ
      .addCase(addNewFaq.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addNewFaq.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Ensure faqs is an array before pushing
        if (Array.isArray(state.faqs)) {
          state.faqs.push(action.payload);
        } else {
          state.faqs = [action.payload];
        }
        state.error = null;
      })
      .addCase(addNewFaq.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add FAQ';
      })
      // Update FAQ
      .addCase(updateFaq.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateFaq.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Ensure faqs is an array before finding index
        if (Array.isArray(state.faqs)) {
          const index = state.faqs.findIndex(faq => faq._id === action.payload._id);
          if (index !== -1) {
            state.faqs[index] = action.payload;
          }
        }
        state.error = null;
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update FAQ';
      })
      // Delete FAQ
      .addCase(deleteFaq.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Ensure faqs is an array before filtering
        if (Array.isArray(state.faqs)) {
          state.faqs = state.faqs.filter(faq => faq._id !== action.payload);
        }
        state.error = null;
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete FAQ';
      });
  },
});

export const { clearError } = faqsSlice.actions;
export default faqsSlice.reducer;
