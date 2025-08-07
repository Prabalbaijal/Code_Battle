import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import socketSlice from "./socketSlice.js";
import uiSlice from "./uiSlice.js"


const rootReducer = combineReducers({
    user: userSlice,  
    socket: socketSlice,
    ui:uiSlice
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