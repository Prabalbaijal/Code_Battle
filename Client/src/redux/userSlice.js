import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        loggedinUser: null,
        onlineUsers:null
    },
    reducers: {
        setLoggedinUser: (state, action) => {
            state.loggedinUser = action.payload
        },
        logout: (state) => {
            state.loggedinUser = null
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers=action.payload
        }
    }
})

export const { setLoggedinUser, logout,setOnlineUsers } = userSlice.actions
export default userSlice.reducer