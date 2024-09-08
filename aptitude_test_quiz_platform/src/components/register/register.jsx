import { useState } from "react"
import { useDispatch } from "react-redux"
import { setLogin } from "../../redux/slices/user-nav-slice"

export function Register() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const dispatch = useDispatch()

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()



        if (formData.password != formData.confirmPassword) {
            alert('Passwords do not match.')
            return
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.name,
                    email: formData.email,
                    password: formData.password,
                })
            })

            if (!response.ok) {
                const errorData = await response.json()

                if (response.status === 400 && errorData.error === 'Email already exists.') {
                    alert('Email already exists. Please use a different email.')
                }
                else {
                    throw new Error('Registration Failed.')
                }

                return 
            }

            dispatch(setLogin())

        }
        catch (error) {
            console.error('Error:', error)
            alert('An unexpected error occurred. Please try again later.')
        }
    }

    return (
        <div>
            <main className="main-content">
                <section className="auth-form">
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label for="name">Name:</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label for="password">Password:</label>
                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label for="confirm-password">Confirm Password:</label>
                            <input type="password" id="confirm-password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                        <button type="submit">Register</button>
                    </form>
                    <p>Already have an account? <a href="">Login</a></p>
                </section>
            </main>
        </div>
    )
}