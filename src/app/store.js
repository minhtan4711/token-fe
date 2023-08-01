import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "../features/token/tokenSlice";
import dappReducer from "../features/dapp/dappSlice";
import timestampReducer from "../features/timestamp/timestampSlice";

const store = configureStore({
  reducer: {
    token: tokenReducer,
    dapp: dappReducer,
    timestamp: timestampReducer,
  }
})

export default store;