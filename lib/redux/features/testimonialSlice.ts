import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Testimonial {
  id: string;
  name: string;
  description: string;
  media: string;
  mediaType: "image" | "video" | null;
  spread: string;
  rating: number;
  status: "active" | "inactive";
  createdOn: string;
  updatedOn: string;
}

interface State {
  items: Testimonial[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  items: [],
  loading: false,
  error: null,
};

// Fetch testimonials
export const fetchTestimonials = createAsyncThunk<Testimonial[], void, { rejectValue: string }>(
  "testimonial/fetchTestimonials",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/routes/testimonials");
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      const json = await res.json();
      return json.data;

    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Add testimonial
export const addTestimonial = createAsyncThunk<Testimonial, FormData>(
  "testimonials/routes/add",
  async (formData) => {
    const res = await fetch("/api/routes/testimonials", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to add testimonial");
    const json = await res.json();
    return json.data;
  
  }
);

// Update testimonial
export const updateTestimonial = createAsyncThunk<Testimonial, { formData: FormData; id: string }, { rejectValue: string }>(
  "testimonial/update",
  async ({ formData, id }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/routes/testimonials/${id}`, {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();
      
      if (!res.ok) {
        return rejectWithValue(json.errorMessage || json.message || "Failed to update testimonial");
      }

      if (!json.data) {
        return rejectWithValue("No data returned from server");
      }

      return json.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update testimonial");
    }
  }
);

// Delete testimonial
export const deleteTestimonial = createAsyncThunk<string, string>(
  "testimonial/delete",
  async (id) => {
    console.error("GET Id:", id);
    const res = await fetch(`/api/routes/testimonials/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete testimonial");

    const data = await res.json(); 
    return data.data; 
  }
);

const testimonialSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Fetch failed";
      })
      .addCase(addTestimonial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })      .addCase(updateTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update failed";
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const selectTestimonials = (state: RootState) => state.testimonial.items;
export const selectLoading = (state: RootState) => state.testimonial.loading;
export const selectError = (state: RootState) => state.testimonial.error;

export default testimonialSlice.reducer;
