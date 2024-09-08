import { useDispatch, useSelector } from 'react-redux'
import { setHome, setLogin, setRegister, setTakeQuiz, setUserDashboard, setPracticeQuiz } from '../../redux/slices/user-nav-slice'
import { setAdminDashboard } from '../../redux/slices/user-slice'
import { setAdminWelcome } from '../../redux/slices/admin-nav-slice'
import { logout } from '../../redux/slices/user-slice'
import Logo from '../base/images/Logo3.webp'


export function Header() {

    const dispatch = useDispatch()
    const username = useSelector((state) => state.user.username)
    const specialAccess = useSelector((state) => state.user.specialAccess)
    const navState = useSelector(state => state.userNav)

    const handleClick = (action, payload = null) => (event) => {
        event.preventDefault()
        dispatch(action(payload))

        if (action === setAdminDashboard) {
            dispatch(setAdminWelcome())
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        localStorage.clear()
        dispatch(logout())
        dispatch(setHome())
    }

    return (
        <div className='header-main-wrap'>
            <header className='header-wrap' style={{ justifyContent: username ? 'space-between' : 'center' }}>
                <div className='welcome-wrap' style={{position: username ? '': 'absolute', left: username ? '' : '0'}}>
                    <div className='header-logo'>
                        {/* <img src={Logo} alt="" className='logo-img'/> */}
                    </div>
                    {/* {username && (
                        <span style={{marginLeft: '1rem'}}>Hi {username}</span>
                    )} */}
                </div>
                <nav className='header-nav-wrap' style={{ marginRight: username ? '0' : '' }}>
                    <ul>
                        <li><a onClick={handleClick(setHome)} style={{color: navState.home ? 'red' : 'inherit'}}>Home</a></li>
                        {!username && (
                            <div style={{ display: 'flex' }}>
                                <li><a onClick={handleClick(setLogin)} style={{color: navState.login ? 'red' : 'inherit'}}>Login</a></li>
                                <li><a onClick={handleClick(setRegister)} style={{color: navState.register ? 'red' : 'inherit'}}>Register</a></li>
                            </div>
                        )}
                        {username && (
                            <div style={{ display: 'flex' }}>
                                <li><a onClick={handleClick(setUserDashboard)} style={{color: navState.userDashboard ? 'red' : 'inherit'}}>Dashboard</a></li>
                                <li><a onClick={handleClick(setPracticeQuiz)} style={{color: navState.practiceQuiz ? 'red' : 'inherit'}}>Practice Quiz</a></li>
                                <li><a onClick={handleClick(setTakeQuiz)} style={{color: navState.takeQuiz ? 'red' : 'inherit'}}>Take Quiz</a></li>
                            </div>
                        )}

                        {specialAccess && (
                            <li><a onClick={handleClick(setAdminDashboard, true)}>Admin Dashboard</a></li>
                        )}
                    </ul>
                </nav>
                {username && (
                    <div className='logout-wrap' >
                        {username && (
                        <span style={{marginRight: '1rem'}}>Hi {username},</span>
                    )} 
                        <span onClick={handleLogout} className='logout-btn'>Logout</span>
                    </div>
                )}
            </header>
        </div>
    )
}