import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user_id: number | null;
  user_name: string | null;
  user_role: string | null;
}

const initialState: UserState = {
  user_id: null,
  user_name: null,
  user_role: null,
};

interface LoginPayload {
  id: number;
  name: string;
  role: string;
}

const userSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      state.user_id = action.payload.id;
      state.user_name = action.payload.name;
      state.user_role = action.payload.role;
    },
    logout(state) {
      state.user_id = null;
      state.user_name = null;
      state.user_role = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
