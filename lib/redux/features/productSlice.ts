import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

// Product type definition
export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  createdOn: string;
  updatedOn: string;
}

// Slice state
export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
}

// Initial state
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
};

// Slice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
});

// Actions
export const {
  setProducts,
  setLoading,
  setError,
  setSelectedProduct,
  clearSelectedProduct,
} = productSlice.actions;

// Thunks
export const fetchProducts = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/routes/products");
    if (response.status === 200) {
      dispatch(setProducts(response.data.data));
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

export const fetchProductById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/products/${id}`);
    if (response.status === 200) {
      dispatch(setSelectedProduct(response.data.data));
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

export const addProduct = (product: FormData) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post("/api/routes/products", product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

export const updateProduct = ({ id, product }: { id: string; product: FormData }) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`/api/routes/products/${id}`, product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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


export const deleteProduct = ({ id }: { id: string }) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(`/api/routes/products/${id}`);
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
export const selectProducts = (state: RootState) => state.product.products;
export const selectProductById = (state: RootState, id: string) =>
  state.product.products.find((product: Product) => product.id === id);
export const selectLoading = (state: RootState) => state.product.loading;
export const selectError = (state: RootState) => state.product.error;

// Reducer
export default productSlice.reducer;
