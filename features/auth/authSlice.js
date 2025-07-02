import { createSlice } from "@reduxjs/toolkit";

// Initial state based on the cookie (fetch the token from cookies)

const initialState = {
  token: "", // Default to token from cookies if available
  user: "",
  id:"",
  role: "",
  phoneNumber:"",
  cartId: "",
  address:[],
  cartItems: [],
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.id = action.payload.id;
      state.phoneNumber = action.payload.phoneNumber;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.address = action.payload.address;
      state.cartId = action.payload.cartId;
      state.cartItems = action.payload.cartItems;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.id = "";
      state.role = null;
      state.error = null;
      state.cartId = null;
      state.phoneNumber = null;
      state.address = null;
      state.cartItems = []
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
