import { useState, useEffect } from "react"



export function ManageUsers() {

    const [users, setUsers] = useState([])
    const [quizHistory, setQuizHistory] = useState([])
    const [viewUserClicked, setViewUserClicked] = useState(false)
    const [userName, setUserName] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/registered-users/')

                if (!response.ok) {
                    throw new Error('Network response was not OK.')
                }
                const data = await response.json()
                setUsers(data)
            }
            catch (error) {
                console.error('Error fetching users: ', error)
            }
        }

        fetchUsers()
    }, [])


    const handleViewUserClick = async (userID, userName) => {
        setViewUserClicked(true)
        setUserName(userName)
        // console.log(userName)

        const token = localStorage.getItem('access_token_aptitudeQuizPlatformAuth')

        const response = await fetch(`http://127.0.0.1:8000/quiz-history/?user_id=${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const data = await response.json()

        const sortedData = data.sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken))

        setQuizHistory(sortedData)
        // console.log(data)
        // console.log('Sorted :', sortedData)
    }

    const handleBackToManageUser = () => {
        setViewUserClicked(false)
    }


    const handleDelete = async (userID) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/delete-user/${userID}/`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                throw new Error('Network response was not OK.')
            }
            setUsers(users.filter(user => user.id !== userID))
        }
        catch (error) {
            console.error('Error deleting user: ', error)
        }
    }


    const handleQuizHistoryDelete = async (historyID) => {

        const token = localStorage.getItem('access_token_aptitudeQuizPlatformAuth')

        try {
            const response = await fetch(`http://127.0.0.1:8000/quiz-history/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({id: historyID})
             })

            if (response.ok) {
                setQuizHistory(quizHistory.filter(history => history.id !== historyID))
                console.log('Quiz history deleted successfully.')
            }
            else{
                const errorData = await response.json()
                console.error('Error deleting quiz history: ', errorData.detail)
            }
        }
        catch (error) {
            console.error('Network error: ', error)
        }
    }


    return (
        <div>
            {!viewUserClicked ? (
                <main className="main-content with-sidebar">
                    <section className="dashboard">
                        <h1 style={{color: 'white'}}>Manage Users</h1>
                        <div className="user-management">
                            <div>
                                {users.map((user, index) => (
                                    <div key={user.id} className="user-wrap">
                                        <div style={{ fontWeight: '600' }}> <span style={{ marginRight: '0.6rem' }}>{index + 1}</span> {user.username}</div>
                                        <div style={{ display: 'flex' }}>
                                            <button
                                                className="manage-user-btn"
                                                style={{ backgroundColor: 'rgb(11, 97, 234)' }}
                                                onClick={() => handleViewUserClick(user.id, user.username)}
                                            >
                                                View User
                                            </button>
                                            <button
                                                className="manage-user-btn"
                                                style={{ backgroundColor: 'red' }}
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Delete User
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            ) : (
                <div className="user-management-quiz-history-main-wrap">
                    <div style={{ marginBottom: '2rem' }}>
                        <button onClick={handleBackToManageUser}>Back to Manage User</button>
                    </div>
                    <div >
                        <div class="quiz-history">
                            <h1 style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', color: 'white' }}>{userName} Quiz Results</h1>
                            {quizHistory && quizHistory.length > 0 ? (
                                <div>
                                    {quizHistory.map((history, index) => (
                                        <div className="user-management-quiz-history-list-wrap"> <span style={{ marginRight: '2rem' }}><button onClick={() => handleQuizHistoryDelete(history.id)} style={{ margin: '0px', backgroundColor: 'red' }}>Delete</button></span> <span style={{ fontSize: '1.2rem', fontWeight: 600, marginRight: '1rem' }}>{index + 1}</span>  {history.quiz_name} - {history.formatted_score} - {history.formatted_date} </div>
                                    ))}
                                </div>
                            ) : (
                                <h4 style={{ textAlign: 'center' }}>No Past History</h4>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}