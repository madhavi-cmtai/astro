import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Testimonial {
  id: string;
  title: string;
  media: string;
  createdAt: string;
  updatedAt: string;
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
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Add testimonial (calls API that handles media upload)
export const addTestimonial = createAsyncThunk<Testimonial, FormData>(
  "testimonial/add",
  async (formData) => {
    const res = await fetch("/api/testimonials", {
      method: "POST",
      body: formData, // send formData directly
    });

    if (!res.ok) throw new Error("Failed to add testimonial");
    return res.json();
  }
);

// Update testimonial (calls API that handles media replacement)
export const updateTestimonial = createAsyncThunk<Testimonial, { formData: FormData; id: string }>(
  "testimonial/update",
  async ({ formData, id }) => {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to update testimonial");
    return res.json();
  }
);

// Delete testimonial (calls API that handles media deletion)
export const deleteTestimonial = createAsyncThunk<string, string>(
  "testimonial/delete",
  async (id) => {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete testimonial");
    return id;
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
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
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
