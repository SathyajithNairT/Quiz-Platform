import { useState } from "react"
import { useDispatch } from "react-redux"
import { login } from "../../redux/slices/user-slice"
import { setHome } from "../../redux/slices/user-nav-slice"


export function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    const handleLogin = async (event) => {
        event.preventDefault()

        try{
            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            })

            const data = await response.json()

            if (response.ok){

                localStorage.setItem('access_token_aptitudeQuizPlatformAuth', data.access_token)
                localStorage.setItem('refresh_token_aptitudeQuizPlatformAuth', data.refresh_token)

                dispatch(login({ 
                    username: data.username, 
                    specialAccess: data.specialAccess
                }))
                dispatch(setHome())
            }
            else{
                console.error(data.error)
                alert('Email or password is incorrect. Please try again.')
            }
        }
        catch (error){
            console.error('An error occured:', error)
        }
    }

    return (
        <div className="base-main-wrap">
            <main className="main-content">
                <section className="auth-form">
                    <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <p>Don't have an account? <a href="">Register</a></p>
                </section>
            </main>
        </div>
    )
}