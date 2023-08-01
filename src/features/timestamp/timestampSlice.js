import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  start_timestamp: '',
  end_timestamp: '',
}

const timestampSlice = createSlice({
  name: 'timestamp',
  initialState,
  reducers: {
    selectTimestamp: (state, action) => {
      const { start_timestamp, end_timestamp } = action.payload;
      state.start_timestamp = start_timestamp;
      state.end_timestamp = end_timestamp;
    },
    clearTimestamp: (state) => {
      state.start_timestamp = '';
      state.end_timestamp = '';
    }
  }
})

export const { selectTimestamp, clearTimestamp } = timestampSlice.actions;
export default timestampSlice.reducer;