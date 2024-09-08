import { createSlice } from "@reduxjs/toolkit";


const userNavSlice = createSlice({
    name: 'userNav',
    initialState: {
        home: true ,
        login: false,
        register: false,
        takeQuiz: false,
        userDashboard: false,
        practiceQuiz: false,
    },
    reducers: {
        setHome(state){
            state.home = true

            state.login = false;
            state.register = false;
            state.takeQuiz = false;
            state.userDashboard = false;
            state.practiceQuiz= false;
        },
        setLogin(state){
            state.login = true;
            
            state.home = false;
            state.register = false;
            state.takeQuiz = false;
            state.userDashboard = false;
            state.practiceQuiz= false;
        },
        setRegister(state) {
            state.register = true;
           
            state.home = false;
            state.login = false;
            state.takeQuiz = false;
            state.userDashboard = false;
            state.practiceQuiz= false;
        },
        setTakeQuiz(state) {
            state.takeQuiz = true;
           
            state.home = false;
            state.login = false;
            state.register = false;
            state.userDashboard = false;
            state.practiceQuiz= false;
        },
        setUserDashboard(state){
            state.userDashboard = true;

            state.takeQuiz = false;
            state.home = false;
            state.login = false;
            state.register = false;
            state.practiceQuiz= false;
        },
        setPracticeQuiz(state){
            state.practiceQuiz= true;

            state.takeQuiz = false;
            state.home = false;
            state.login = false;
            state.register = false;
            state.userDashboard = false;
        },
        setDisableAll(state){
            state.takeQuiz = false;
            state.home = false;
            state.login = false;
            state.register = false;
            state.userDashboard = false;
            state.practiceQuiz= false;
        }
    }
})


export const { setHome, setLogin, setRegister, setTakeQuiz, setDisableAll, setUserDashboard, setPracticeQuiz } = userNavSlice.actions;

export default userNavSlice.reducer;