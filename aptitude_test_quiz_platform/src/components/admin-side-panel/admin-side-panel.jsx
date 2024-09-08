import { useDispatch } from "react-redux"
import { setCreateQuiz, setManageQuiz, setManageUser, setSidePanelDisableAll, 
    setCreateQuestions, setManageQuestions, setManageCategories } from "../../redux/slices/admin-nav-slice"
import { setAdminDashboard } from "../../redux/slices/user-slice"
import { setHome } from "../../redux/slices/user-nav-slice"

export function SidePanel() {

    const dispatch = useDispatch()

    const handleClick = (action) => (event) => {
        event.preventDefault()
        dispatch(action())

        if (action === setHome){
            dispatch(setAdminDashboard(false))
            dispatch(setSidePanelDisableAll())
        }
    }

    return (
        <div>
            <aside className="sidebar">
                <ul>
                    <li><a onClick={handleClick(setCreateQuiz)}>Create Quiz</a></li>
                    <li><a onClick={handleClick(setCreateQuestions)}>Create Questions</a></li>
                    <li><a onClick={handleClick(setManageCategories)}>Manage Categories</a></li>
                    <li><a onClick={handleClick(setManageQuiz)}>Manage Quizzes</a></li>
                    <li><a onClick={handleClick(setManageQuestions)}>Manage Questions</a></li>
                    <li><a onClick={handleClick(setManageUser)}>Manage Users</a></li>
                    <li><a onClick={handleClick(setHome)}>Home</a></li>
                </ul>
            </aside>
        </div>
    )
}