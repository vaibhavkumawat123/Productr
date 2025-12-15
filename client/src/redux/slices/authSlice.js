import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://productr-hfck.onrender.com/api/auth";

/*  SEND LOGIN OTP  */
export const sendLoginOtp = createAsyncThunk(
  "auth/sendLoginOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/login/send-otp`, { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/*  VERIFY LOGIN OTP  */
export const verifyLoginOtp = createAsyncThunk(
  "auth/verifyLoginOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/login/verify-otp`, { email, otp });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid or expired OTP"
      );
    }
  }
);

/*  SEND SIGNUP OTP  */
export const sendSignupOtp = createAsyncThunk(
  "auth/sendSignupOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/signup/send-otp`, { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Server error. Try again."
      );
    }
  }
);

/*  VERIFY SIGNUP OTP  */
export const verifySignupOtp = createAsyncThunk(
  "auth/verifySignupOtp",
  async ({ userName, email, password, otp }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/signup/verify-otp`, {
        userName,
        email,
        password,
        otp,
      });
      return res.data; // 👈 token + user
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid or expired OTP"
      );
    }
  }
);

/*  SLICE  */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    verifying: false,
    error: null,

    // 🔥 IMPORTANT
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("token"),
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------- SEND OTP ---------- */
      .addCase(sendLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendSignupOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendSignupOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendSignupOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- VERIFY LOGIN OTP ---------- */
      .addCase(verifyLoginOtp.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.verifying = false;

        // 🔥 STORE TOKEN + USER
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload;
      })

      /* ---------- VERIFY SIGNUP OTP ---------- */
      .addCase(verifySignupOtp.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifySignupOtp.fulfilled, (state, action) => {
        state.verifying = false;

        // 🔥 STORE TOKEN + USER
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(verifySignupOtp.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
