import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://productr-hfck.onrender.com/api/products";

/*
   FETCH PRODUCTS (USER WISE)
   */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No auth token found");

      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/*
   ADD PRODUCT
   */
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No auth token found");

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "images") {
          data.images.forEach((img) => formData.append("images", img));
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await axios.post(API, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/*
   TOGGLE PUBLISH / UNPUBLISH
   */
export const togglePublishProduct = createAsyncThunk(
  "products/togglePublish",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No auth token found");

      const res = await axios.patch(
        `${API}/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/*
   DELETE PRODUCT
   */
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No auth token found");

      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/*
   UPDATE / EDIT PRODUCT
   */
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No auth token found");

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "images") {
          data.images.forEach((img) => formData.append("images", img));
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await axios.put(`${API}/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/*
   SLICE
   */
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ADD */
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      /* TOGGLE PUBLISH */
      .addCase(togglePublishProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      /* DELETE */
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })

      /* UPDATE */
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
