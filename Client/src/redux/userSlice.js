import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        loggedinUser: null,
        onlineUsers:null,
        friends:null
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
        },
        setFriends: (state, action) => { 
            state.friends = action.payload;
          },
    }
})

export const { setLoggedinUser, logout,setOnlineUsers,setFriends } = userSlice.actions
export default userSlice.reducer