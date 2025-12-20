import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const API = "/products";

/* FETCH PRODUCTS */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* ADD PRODUCT */
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "images") {
          data.images.forEach((img) => formData.append("images", img));
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await api.post(API, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* TOGGLE PUBLISH */
export const togglePublishProduct = createAsyncThunk(
  "products/togglePublish",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`${API}/${id}/publish`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* DELETE PRODUCT */
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* UPDATE PRODUCT */
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "images") {
          data.images.forEach((img) => formData.append("images", img));
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await api.put(`${API}/${id}`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* SLICE */
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(addProduct.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p._id !== a.payload);
      })
      .addCase(updateProduct.fulfilled, (s, a) => {
        const i = s.items.findIndex((p) => p._id === a.payload._id);
        if (i !== -1) s.items[i] = a.payload;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;