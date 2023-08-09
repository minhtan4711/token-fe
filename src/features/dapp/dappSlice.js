import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dappId: [],
}

const dappSlice = createSlice({
  name: 'dapp',
  initialState,
  reducers: {
    selectDapp: (state, action) => {
      const { id } = action.payload;
      if (!state.dappId.includes(id)) {
        state.dappId.push(id);
      }
    },
    removeDappPerTimestamp: (state) => {
      if (state.dappId.length > 1) {
        state.dappId = [state.dappId[0]];
      }
    },
    clearDapp: (state) => {
      state.dappId = [];
    }
  }
})

export const { selectDapp, clearDapp, removeDappPerTimestamp } = dappSlice.actions;
export default dappSlice.reducer;