import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";


export interface Blog {
  id?: string;
  title: string;
  summary: string;
  image: string;
  createdOn?: string;
  updatedOn?: string;
}

export interface BlogState {
  data: Blog[];
  loading: boolean;
  error: string | null;
  selectedBlog: Blog | null;
}

const initialState: BlogState = {
  data: [],
  loading: false,
  error: null,
  selectedBlog: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedBlog: (state, action) => {
      state.selectedBlog = action.payload;
    },
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
  },
});

export const {
  setBlogs,
  setLoading,
  setError,
  setSelectedBlog,
  clearSelectedBlog,
} = blogSlice.actions;

// Fetch all blogs
export const fetchBlogs = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/routes/blogs");
    if (response.status === 200) {
      dispatch(setBlogs(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message =
      typeof error === "object" && error && "message" in error
        ? (error as { message?: string }).message
        : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

// Fetch single blog by ID
export const fetchBlogById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/blogs/${id}`);
    if (response.status === 200) {
      dispatch(setSelectedBlog(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message =
      typeof error === "object" && error && "message" in error
        ? (error as { message?: string }).message
        : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

// Add blog
export const addBlog = (formData: FormData) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post("/api/routes/blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200 || response.status === 201) {
      await dispatch<any>(fetchBlogs()); // Refresh list if needed
      return response.data;
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message =
      typeof error === "object" && error && "message" in error
        ? (error as { message?: string }).message
        : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};


// Update blog
export const updateBlog = (
  blog: Blog & { file?: File }, // accepts optional new image
  id: string
) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("summary", blog.summary);
    if (blog.file) {
      formData.append("image", blog.file);
    }

    const response = await axios.put(`/api/routes/blogs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      await dispatch<any>(fetchBlogs()); // Refresh blog list after update
      return response.data;
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message =
      typeof error === "object" && error && "message" in error
        ? (error as { message?: string }).message
        : String(error);
    dispatch(setError(message || "Unknown error"));
  } finally {
    dispatch(setLoading(false));
  }
};


// Delete blog
export const deleteBlog = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(`/api/routes/blogs/${id}`);
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message =
      typeof error === "object" && error && "message" in error
        ? (error as { message?: string }).message
        : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

// Selectors
export const selectBlogs = (state: RootState) => state.blog.data;
export const selectLoading = (state: RootState) => state.blog.loading;
export const selectError = (state: RootState) => state.blog.error;

export default blogSlice.reducer;
