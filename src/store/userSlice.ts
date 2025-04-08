import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/interfaces/User';

// Define Initial State Type
interface UserState {
    user: User | null;
}

// Initial State
const initialState: UserState = {
    user: null,
};

// Create Slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
