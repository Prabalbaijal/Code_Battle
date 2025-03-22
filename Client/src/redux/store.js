import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import socketSlice from "./socketSlice.js";

const rootReducer = combineReducers({
    user: userSlice,  
    socket: socketSlice
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
              ignoredActions: ["persist/PERSIST", "persist/REGISTER"],
                ignoredPaths: ["socket.socket"],
            },
        }),
});

export default store;