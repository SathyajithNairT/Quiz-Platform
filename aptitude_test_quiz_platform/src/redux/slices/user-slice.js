import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: null, 
        username: null,
        specialAccess: false,
        adminDashboard: false,
    },
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token 
            state.username = action.payload.username
            state.specialAccess = action.payload.specialAccess
            state.adminDashboard = action.payload.adminDashboard
        },
        logout: (state) => {
            state.token = null
            state.username = null
            state.specialAccess = false
            state.adminDashboard = false
        },
        setAdminDashboard: (state, action) => {
            state.adminDashboard = action.payload
        },
    }
})

export const {login, logout, setAdminDashboard} = userSlice.actions

export default userSlice.reducer