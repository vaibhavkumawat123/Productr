import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

/* ================= LOGIN OTP ================= */

export const sendLoginOtp = createAsyncThunk(
  "auth/sendLoginOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login/send-otp", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const verifyLoginOtp = createAsyncThunk(
  "auth/verifyLoginOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login/verify-otp", { email, otp });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid or expired OTP"
      );
    }
  }
);

/* ================= SIGNUP OTP ================= */

export const sendSignupOtp = createAsyncThunk(
  "auth/sendSignupOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signup/send-otp", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Signup OTP failed"
      );
    }
  }
);

export const verifySignupOtp = createAsyncThunk(
  "auth/verifySignupOtp",
  async ({ userName, email, password, otp }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signup/verify-otp", {
        userName,
        email,
        password,
        otp,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid or expired OTP"
      );
    }
  }
);

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    verifying: false,
    error: null,
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user")),
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
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendLoginOtp.pending, (s) => {
        s.loading = true;
      })
      .addCase(sendLoginOtp.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(sendLoginOtp.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(sendSignupOtp.pending, (s) => {
        s.loading = true;
      })
      .addCase(sendSignupOtp.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(sendSignupOtp.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(verifyLoginOtp.pending, (s) => {
        s.verifying = true;
      })
      .addCase(verifyLoginOtp.fulfilled, (s, a) => {
        s.verifying = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
        s.isAuthenticated = true;
        localStorage.setItem("token", a.payload.token);
        localStorage.setItem("user", JSON.stringify(a.payload.user));
      })
      .addCase(verifyLoginOtp.rejected, (s, a) => {
        s.verifying = false;
        s.error = a.payload;
      })

      .addCase(verifySignupOtp.pending, (s) => {
        s.verifying = true;
      })
      .addCase(verifySignupOtp.fulfilled, (s, a) => {
        s.verifying = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
        s.isAuthenticated = true;
        localStorage.setItem("token", a.payload.token);
        localStorage.setItem("user", JSON.stringify(a.payload.user));
      })
      .addCase(verifySignupOtp.rejected, (s, a) => {
        s.verifying = false;
        s.error = a.payload;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
