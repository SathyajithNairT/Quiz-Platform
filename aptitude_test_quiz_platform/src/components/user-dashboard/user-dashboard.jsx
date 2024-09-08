import { useEffect, useState } from "react"
import { IoIosArrowForward, IoIosArrowBack, IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";



export function UserDashboard() {

    const [currentQuizResult, setCurrentQuizResult] = useState(null)
    const [wrongAnswers, setWrongAnswers] = useState(null)
    const [quizHistory, setQuizHistory] = useState(null)
    const [quizName, setQuizName] = useState(null)
    const [latestQuizResultPosted, setLatestQuizResultPosted] = useState(false)
    const [quizHistoryFrom, setQuizHistoryFrom] = useState(0)
    const [quizHistoyTo, setQuizHistoryTo] = useState(4)


    const handlePreviousClick = () => {
        if (quizHistoryFrom > 0) {
            setQuizHistoryFrom((prevFrom) => (prevFrom - 4))
            setQuizHistoryTo((prevTo) => (prevTo - 4))
        }
    }

    const handleNextClick = () => {
        if (quizHistoyTo < quizHistory.length) {
            setQuizHistoryFrom((prevFrom) => (prevFrom + 4))
            setQuizHistoryTo((prevTo) => (prevTo + 4))
        }
    }


    useEffect(() => {

        const postQuizHistory = async () => {
            const data = {
                quiz_name: quizName,
                score: parseFloat(parseFloat(currentQuizResult).toFixed(1))
            }

            const token = localStorage.getItem('access_token_aptitudeQuizPlatformAuth')

            try {
                const response = await fetch('http://127.0.0.1:8000/quiz-history/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                })

                if (!response.ok) {
                    throw new Error('Network response was not ok.')
                }

                // const result = await response.json()
            }
            catch (error) {
                console.error('There was a problem with the fetch operation: ', error)
            }
        }

        if (quizName && currentQuizResult && !latestQuizResultPosted) {
            postQuizHistory()
            setLatestQuizResultPosted(true)
        }
    }, [quizName, currentQuizResult])

    useEffect(() => {
        const runningQuizReult = localStorage.getItem('quizResult')
        const wrongAns = localStorage.getItem('wrongAnswers')
        const runningQuiz = localStorage.getItem('currentQuiz')

        const token = localStorage.getItem('access_token_aptitudeQuizPlatformAuth')


        if (runningQuizReult) {
            setCurrentQuizResult(runningQuizReult)
            localStorage.removeItem('quizResult')
        }

        if (wrongAns) {
            setWrongAnswers(JSON.parse(wrongAns))
            localStorage.removeItem('wrongAnswers')
        }
        if (runningQuiz) {
            setQuizName(JSON.parse(runningQuiz).title)
            localStorage.removeItem('currentQuiz')
        }


        const getQuizHistory = async () => {
            const response = await fetch('http://127.0.0.1:8000/quiz-history/', {
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

        getQuizHistory()

        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="user-dashboard-main-wrap">
            {/* <main class="main-content"> */}
            <section class="dashboard user-dash">
                {currentQuizResult && (
                    <div class="current-quiz-result">
                        <h2>Current Quiz Result</h2>
                        <h2>Your Score: {currentQuizResult}%</h2>
                        {wrongAnswers.length > 0 ? (
                            <div className="feedback-section">
                                <h3>Solutions for Incorrect Answers :</h3>
                                <ul>
                                    {wrongAnswers.map((ans, index) => (
                                        <div className="user-dashboard-wrong-answers-list">
                                            <div style={{ fontSize: '1.2rem', fontWeight: '600', marginRight: '2rem' }}>{index + 1} </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>Question: {ans.question}</div>
                                                <div style={{ fontWeight: '600', marginTop: '1rem' }}>Answer: {ans.correct_answer}</div>
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div style={{ fontWeight: '600', marginTop: '2rem' }}>No attempted wrong answers.</div>
                        )}
                    </div>
                )}
                <div class="quiz-history">
                    <h1 style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', color: 'white' }}>Past Quiz Results</h1>
                    {quizHistory && quizHistory.length > 0 ? (
                        <ul>
                            {quizHistory
                                .slice(quizHistoryFrom, quizHistoyTo)
                                .map((history, index) => (
                                    <li style={{ display: 'flex', justifyContent: 'flex-start', backgroundColor: '#2C3E50', color: '#ECF0F1' }}><span style={{ fontSize: '1.2rem', fontWeight: 600, marginRight: '1rem' }}>{index + 1 + quizHistoryFrom}</span>{history.quiz_name} - {history.formatted_score} - {history.formatted_date}</li>
                                ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button
                                    className="user-dash-history-nav-btn"
                                    onClick={handlePreviousClick}
                                    disabled={quizHistoryFrom <= 0}
                                >
                                    <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><IoMdArrowRoundBack /> Previous</span> 
                                </button>
                                <button
                                    className="user-dash-history-nav-btn"
                                    onClick={handleNextClick}
                                    disabled={quizHistoyTo >= quizHistory.length}
                                >
                                    <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Next <IoMdArrowRoundForward /> </span>
                                </button>
                            </div>
                        </ul>
                    ) : (
                        <h4 style={{ textAlign: 'center' }}>No Past History</h4>
                    )}
                </div>
            </section>
            {/* </main> */}
        </div>
    )
}