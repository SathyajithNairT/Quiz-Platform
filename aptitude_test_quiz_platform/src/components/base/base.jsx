import './base.css'
import { Header } from '../header/header'
import { Home } from '../home/home'
import { Login } from '../login/login'
import { Register } from '../register/register'
import { UserDashboard } from '../user-dashboard/user-dashboard'
import { Quiz } from '../quiz/quiz'
import { PracticeQuiz } from '../practice-quiz/practice-quiz'
import { Footer } from '../footer/footer'
import { SidePanel } from '../admin-side-panel/admin-side-panel'
import { ManageQuiz } from '../admin-interface/manage-quiz/manage-quiz'
import { ManageUsers } from '../admin-interface/manage-users/manage-users'
import { CreateQuiz } from '../admin-interface/create-quiz/create-quiz'
import { AdminDashboard } from '../admin-interface/admin-dashboard/admin-dashboard'
import { CreateQuestions } from '../admin-interface/create-questions/create-questions'
import { ManageQuestions } from '../admin-interface/manage-questions/manage-questions'
import { Categories } from '../admin-interface/categories/categories'
import { useSelector, useDispatch } from 'react-redux'
import { setDisableAll } from '../../redux/slices/user-nav-slice'


export function Base() {

    const { home, login, register, takeQuiz, userDashboard, practiceQuiz } = useSelector(state => state.userNav)
    const { adminWelcome, manageQuiz, createQuiz, manageUsers, createQuestions, manageQuestions, manageCategories } = useSelector(state => state.adminNav)
    const adminDashboard = useSelector((state) => state.user.adminDashboard)
    const dispatch = useDispatch()


    if (adminDashboard) {
        dispatch(setDisableAll())
    }

    return (
        <div className='base-main-wrap'>
            {!adminDashboard && <Header />}
            {adminDashboard && <SidePanel />}
            {home && <Home />}
            {userDashboard && <UserDashboard />}
            {login && <Login />}
            {register && <Register />}
            {takeQuiz && <Quiz />}
            {practiceQuiz && <PracticeQuiz />}
            {adminDashboard && adminWelcome && <AdminDashboard />}
            {adminDashboard && createQuiz && <CreateQuiz />}
            {adminDashboard && createQuestions && <CreateQuestions />}
            {adminDashboard && manageCategories && <Categories />}
            {adminDashboard && manageQuestions && <ManageQuestions />}
            {adminDashboard && manageQuiz && <ManageQuiz />}
            {adminDashboard && manageUsers && <ManageUsers />}
            <Footer />
        </div>
    )
}

