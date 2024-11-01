import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        loggedinUser: null,
    },
    reducers: {
        setLoggedinUser: (state, action) => {
            state.loggedinUser = action.payload
        },
        logout: (state) => {
            state.loggedinUser = null
        }
    }
})

export const { setLoggedinUser, logout } = userSlice.actions
export default userSlice.reducer