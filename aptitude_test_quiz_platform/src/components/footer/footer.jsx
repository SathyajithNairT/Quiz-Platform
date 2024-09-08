import { useSelector } from "react-redux"


export function Footer(){

    const adminDashActive = useSelector((state) => state.user.adminDashboard)

    return(
        <div>
            <footer style={{
                position: adminDashActive ? 'absolute' : null,
                left: adminDashActive ? '15rem' : null,
                width: adminDashActive ? 'calc(100% - 15rem)' : null,
            }}>
                <p>&copy; 2024 Aptitude Test Quiz Platform. All rights reserved.</p>
            </footer>
        </div>
    )
}