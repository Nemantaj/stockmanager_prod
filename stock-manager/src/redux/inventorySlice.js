import { createSlice } from "@reduxjs/toolkit";

const initialInventory = {
  storedIphones: [],
  storedIpods: [],
  storedWatches: [],
  storedReports: [],
  dateGte: new Date().toISOString().substring(0, 10),
  dateLte: new Date().toISOString().substring(0, 10),
  isAuth: false,
  token: "",
};

const inventorySlice = createSlice({
  name: "invtry",
  initialState: initialInventory,
  reducers: {
    setStoredIphones(state, action) {
      state.storedIphones = action.payload;
    },
    setStoredIpods(state, action) {
      state.storedIpods = action.payload;
    },
    setStoredWatches(state, action) {
      state.storedWatches = action.payload;
    },
    setStoredReports(state, action) {
      state.storedReports = action.payload;
    },
    setStoredHistory(state, action) {
      state.storedHistory = action.payload;
    },
    setStoredHistoryAdj(state, action) {
      state.storedHistoryAdj = action.payload;
    },
    setGte(state, action) {
      state.dateGte = action.payload;
    },
    setLte(state, action) {
      state.dateLte = action.payload;
    },
    setAuth(state, action) {
      state.isAuth = true;
      state.token = action.payload;
    },
    revokeAuth(state, action) {
      state.isAuth = false;
      state.token = "";
    },
  },
});

export const invtryActions = inventorySlice.actions;

export default inventorySlice.reducer;
