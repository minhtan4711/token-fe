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
    clearDapp: (state) => {
      state.dappId = [];
    }
  }
})

export const { selectDapp, clearDapp } = dappSlice.actions;
export default dappSlice.reducer;