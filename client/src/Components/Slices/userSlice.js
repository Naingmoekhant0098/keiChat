import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
  },
  reducers: {
    logInSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    logOutSuccess : (state)=>{
        state.currentUser =null
    }
  },
});

// Action creators are generated for each case reducer function
export const { logInSuccess,logOutSuccess } = userSlice.actions;

export default userSlice.reducer;
