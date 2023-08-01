import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: '',
  id: '',
  address: '',
  image: '',

}

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    selectToken: (state, action) => {
      const { name, id, address, image } = action.payload;
      state.name = name;
      state.id = id;
      state.address = address;
      state.image = image;
    },
    clearToken: (state) => {
      state.name = '';
      state.id = '';
      state.address = '';
      state.image = '';
    }
  }
})

export const { selectToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;