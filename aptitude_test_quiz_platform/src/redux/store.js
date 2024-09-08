import { configureStore } from "@reduxjs/toolkit"
import userNavReducer from './slices/user-nav-slice'
import userReducer from './slices/user-slice'
import adminNavReducer from './slices/admin-nav-slice'


export const store = configureStore({
    reducer: {
        userNav: userNavReducer,
        user: userReducer,
        adminNav: adminNavReducer,
    }
})