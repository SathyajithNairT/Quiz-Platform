import { createSlice } from "@reduxjs/toolkit";


const adminNavSlice= createSlice({
    name: 'adminNav',
    initialState: {
        manageQuiz: false,
        createQuiz: false,
        manageUsers: false,
        adminWelcome: false,
        createQuestions: false,
        manageQuestions: false,
        manageCategories: false,
    },
    reducers: {
        setAdminWelcome(state){
            state.adminWelcome = true
        },
        setManageQuiz(state){
            state.manageQuiz = true 

            state.createQuiz = false
            state.manageUsers = false
            state.adminWelcome = false
            state.createQuestions = false
            state.manageQuestions = false
            state.manageCategories = false
        },
        setCreateQuiz(state){
            state.createQuiz = true 

            state.manageQuiz = false 
            state.manageUsers = false
            state.adminWelcome = false
            state.createQuestions = false
            state.manageQuestions = false
            state.manageCategories = false
        },
        setManageUser(state){
            state.manageUsers = true 

            state.manageQuiz = false
            state.createQuiz = false
            state.adminWelcome = false
            state.createQuestions = false
            state.manageQuestions = false
            state.manageCategories = false
        },
        setCreateQuestions(state){
            state.createQuestions = true

            state.manageQuiz = false
            state.createQuiz = false
            state.adminWelcome = false
            state.manageUsers = false 
            state.manageQuestions = false
            state.manageCategories = false
        },
        setManageQuestions(state){
            state.manageQuestions = true

            state.manageUsers = false 
            state.manageQuiz = false
            state.createQuiz = false
            state.adminWelcome = false
            state.createQuestions = false
            state.manageCategories = false
        },
        setManageCategories(state){
            state.manageCategories = true

            state.manageUsers = false 
            state.manageQuiz = false
            state.createQuiz = false
            state.adminWelcome = false
            state.createQuestions = false
            state.manageQuestions = false
        },
        setSidePanelDisableAll(state){
            state.manageUsers = false 
            state.manageQuiz = false
            state.createQuiz = false
            state.adminWelcome = false
            state.createQuestions = false
            state.manageQuestions = false
            state.manageCategories = false
        }
    }
})


export const { setCreateQuiz, setManageQuiz, setManageUser, setSidePanelDisableAll, 
    setAdminWelcome, setCreateQuestions, setManageQuestions, setManageCategories} = adminNavSlice.actions

export default adminNavSlice.reducer