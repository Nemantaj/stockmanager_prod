import { configureStore } from "@reduxjs/toolkit";

import invtry from "./inventorySlice";

const store = configureStore({
  reducer: {
    invtry: invtry,
  },
});

export default store;
