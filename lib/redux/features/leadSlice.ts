import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

// --- Interface Definitions ---

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "New" | "Contacted" | "Converted";
  createdAt: string;
  updatedAt: string;
}

interface LeadState {
  data: Lead[];
  loading: boolean;
  error: string | null;
  selectedLead: Lead | null;
}

const initialState: LeadState = {
  data: [],
  loading: false,
  error: null,
  selectedLead: null,
};

// --- Async Thunks ---

export const fetchLeads = createAsyncThunk<Lead[], void, { rejectValue: string }>(
  'lead/fetchLeads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/routes/leads");
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to fetch leads";
      return rejectWithValue(message);
    }
  }
);

export const fetchLeadById = createAsyncThunk<Lead, string, { rejectValue: string }>(
  'lead/fetchLeadById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/routes/leads/${id}`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || `Failed to fetch lead with ID: ${id}`;
      return rejectWithValue(message);
    }
  }
);

export const addLead = createAsyncThunk<Lead, Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>, { rejectValue: string }>(
  'lead/addLead',
  async (newLeadData, { rejectWithValue }) => {
    try {
      const leadToCreate: Omit<Lead, 'id'> = {
        ...newLeadData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const response = await axios.post("/api/routes/leads", leadToCreate);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to add lead";
      return rejectWithValue(message);
    }
  }
);

// ✅ FIXED updateLead with createdAt included
export const updateLead = createAsyncThunk<
  Lead,
  { id: string; updatedLeadData: Omit<Lead, 'id' | 'updatedAt'> }, // createdAt is required
  { rejectValue: string }
>(
  'lead/updateLead',
  async ({ id, updatedLeadData }, { rejectWithValue }) => {
    try {
      const leadToUpdate: Omit<Lead, 'id'> = {
        ...updatedLeadData,
        updatedAt: new Date().toISOString(),
      };
      const response = await axios.put(`/api/routes/leads/${id}`, leadToUpdate);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || `Failed to update lead with ID: ${id}`;
      return rejectWithValue(message);
    }
  }
);

export const deleteLead = createAsyncThunk<string, string, { rejectValue: string }>(
  'lead/deleteLead',
  async (leadId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/routes/leads/${leadId}`);
      return leadId;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || `Failed to delete lead with ID: ${leadId}`;
      return rejectWithValue(message);
    }
  }
);

// --- Slice ---

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedLead: (state, action: PayloadAction<Lead | null>) => {
      state.selectedLead = action.payload;
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action: PayloadAction<Lead[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch leads";
      })

      .addCase(fetchLeadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.loading = false;
        state.selectedLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch lead by ID";
      })

      .addCase(addLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add lead";
      })

      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.loading = false;
        const index = state.data.findIndex(lead => lead.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update lead";
      })

      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.data = state.data.filter(lead => lead.id !== action.payload);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete lead";
      });
  },
});

// --- Exported Actions and Selectors ---

export const {
  setLoading,
  setError,
  setSelectedLead,
  clearSelectedLead
} = leadSlice.actions;

export const selectLeads = (state: RootState) => state.lead.data;
export const selectLoading = (state: RootState) => state.lead.loading;
export const selectError = (state: RootState) => state.lead.error;
export const selectSelectedLead = (state: RootState) => state.lead.selectedLead;

export default leadSlice.reducer;
