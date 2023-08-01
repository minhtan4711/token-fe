import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dappId: '',
  dappName: '',
  dappAddress: [],
  dappImage: '',
}

const dappSlice = createSlice({
  name: 'dapp',
  initialState,
  reducers: {
    selectDapp: (state, action) => {
      const { id, name, address, image } = action.payload;
      state.dappId = id;
      state.dappName = name;
      state.dappAddress = address;
      state.dappImage = image;
    },
    clearDapp: (state) => {
      state.dappId = '';
      state.dappName = '';
      state.dappAddress = [];
      state.dappImage = '';
    }
  }
})

export const { selectDapp, clearDapp } = dappSlice.actions;
export default dappSlice.reducer;