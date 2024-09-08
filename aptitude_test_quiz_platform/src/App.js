
import './App.css';
import { Base } from './components/base/base';
import { login as userLogin } from './redux/slices/user-slice';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

function App() {

    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()


    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('access_token_aptitudeQuizPlatformAuth')

            if (token) {
                let response = await fetch('http://127.0.0.1:8000/fetch-user/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    dispatch(userLogin({
                        username: data.username,
                        specialAccess: data.specialAccess,
                    }))
                }
                else if (response.status === 401) {
                    const refreshToken = localStorage.getItem('refresh_token_aptitudeQuizPlatformAuth')
                    if (refreshToken) {
                        const refreshResponse = await fetch('http://127.0.0.1:8000/access-token/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ refresh: refreshToken }),
                        })
                        if (refreshResponse.ok) {
                            const refreshData = await refreshResponse.json()
                            localStorage.setItem('access_token_aptitudeQuizPlatformAuth', refreshData.access)

                            const new_token = refreshData.access_token
                            response = await fetch('http://127.0.0.1:8000/fetch-user/', {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${new_token}`,
                                    'Content-Type': 'application/json',
                                }
                            })

                            if (response.ok) {
                                const data = await response.json()
                                dispatch(userLogin({
                                    username: data.username,
                                    specialAccess: data.specialAccess,
                                }))
                            }
                            else {
                                console.error('Failed to fetch details with refresh token: ', refreshResponse)

                            }
                        }
                        else {
                            console.error('Failed to fetch access token: ', await refreshResponse.json())
                            localStorage.removeItem('refresh_token_aptitudeQuizPlatformAuth')
                            localStorage.removeItem('access_token_aptitudeQuizPlatformAuth')
                            alert('Session expired. Please log in again.')
                        }
                    }
                    else {
                        console.error('Refresh token not found. Logging out.')
                        localStorage.removeItem('refresh_token_aptitudeQuizPlatformAuth')
                        localStorage.removeItem('access_token_aptitudeQuizPlatformAuth')
                        alert('Session expired. Please log in again.')
                    }
                }
                else {
                    console.error('Failed to fetch user details.', await response.json())
                }
            }
            setLoading(false)
        }

        fetchUserDetails()
    }, [dispatch])


    if (loading){
        return <div>Loading...</div>
    }


    return (
        <div>
            <Base />
        </div>
    );
}

export default App;
