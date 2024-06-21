import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../redux/feature/CounterSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store;
