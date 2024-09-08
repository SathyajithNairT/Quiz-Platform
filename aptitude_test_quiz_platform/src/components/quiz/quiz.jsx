import { useEffect, useState } from "react"
import { setUserDashboard } from "../../redux/slices/user-nav-slice"
import { useDispatch } from "react-redux"


export function Quiz() {

    const [testQuizPage, setTestQuizPage] = useState(false)
    const [timerDuration, setTimerDuration] = useState(10 * 60)
    const [quizzes, setQuizzes] = useState([])
    const [currentQuiz, setCurrentQuiz] = useState(null)
    const [questions, setQuestions] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [startQuizBtnClicked, setStartQuizBtnClicked] = useState(false)
    const [answers, setAnswers] = useState([])
    const [remainingTime, setRemainingTime] = useState(() => {
        const savedTime = localStorage.getItem('remainingTime')
        return savedTime ? parseInt(savedTime) : timerDuration
    })

    const dispatch = useDispatch()

    const handleContextMenu = (event) => {
        event.preventDefault()
    }

    useEffect(() => {
        document.addEventListener("contextmenu", handleContextMenu)
        return(() => {
            document.removeEventListener("contextmenu", handleContextMenu)
        })
    }, [])

    const runTimer = () => {
        const minutes = Math.floor(remainingTime / 60)
        const sec = remainingTime % 60
        return `${minutes.toString().padStart(2, '0')} : ${sec.toString().padStart(2, '0')}`
    }

    const handleQuizNav = (quiz = null) => (event) => {
        event.preventDefault()
        if (testQuizPage) {
            localStorage.removeItem('remainingTime')
            localStorage.removeItem('currentQuestionIndex')
            localStorage.removeItem('currentQuiz')
            localStorage.removeItem('fetchedQuestions')
            localStorage.removeItem('answers')
            setRemainingTime(timerDuration)
            setCurrentQuiz(null)
            setCurrentQuestionIndex(0)
            setQuestions([])
            setAnswers([])
        }
        else {
            const runningQuiz = localStorage.getItem('currentQuiz')
            if (runningQuiz) {
                alert(`Unfinished --- ${JSON.parse(runningQuiz).title} --- Quiz. Please complete or use the back button.`)
                setCurrentQuiz(JSON.parse(runningQuiz))
                const runningQuesIndex = parseInt(localStorage.getItem('currentQuestionIndex'))
                setCurrentQuestionIndex(runningQuesIndex)
                const runningAnswers = localStorage.getItem('answers')
                if (runningAnswers) {
                    setAnswers(JSON.parse(runningAnswers))
                }
                else {
                    setAnswers([])
                }
            }
            else {
                setCurrentQuiz(quiz)
                const testQuiz = JSON.stringify(quiz)
                localStorage.setItem('currentQuiz', testQuiz)
                localStorage.setItem('currentQuestionIndex', 0)
                setCurrentQuestionIndex(0)
            }

        }
        setTestQuizPage(!testQuizPage)
        setStartQuizBtnClicked(false)
    }


    const handleStartQuizBtnClick = () => {
        const remTime = localStorage.getItem('remainingTime')
        if (remTime) {
            setRemainingTime(remTime)
        }
        else {
            setRemainingTime(currentQuiz.duration * 60)
        }
        setStartQuizBtnClicked(true)
    }


    const handleNextQuestion = async () => {
        if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
            const ansToStorage = JSON.stringify(answers)
            localStorage.setItem('answers', ansToStorage)
        }
    }

    const handlePreviousQuestion = async () => {
        if (currentQuiz && currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
            const ansToStorage = JSON.stringify(answers)
            localStorage.setItem('answers', ansToStorage)
        }
    }

    const handleOptionSelection = (event) => {
        setAnswers({
            ...answers,
            [currentQuiz.questions[currentQuestionIndex]]: event.target.value
        })
    }


    const handleQuizSubmit = async (event = null) => {
        if (event) {
            event.preventDefault()
        }

        const ansToStorage = JSON.stringify(answers)
        localStorage.setItem('answers', ansToStorage)

        let correctAnswers = 0
        let wrongAnswers = []

        if (currentQuiz) {
            const answerPromises = currentQuiz.questions.map(questionID => {
                return fetch(`http://127.0.0.1:8000/fetch-answer/${questionID}/`)
                    .then(response => response.json())
            })

            const fetchedAnswers = await Promise.all(answerPromises)

            if (fetchedAnswers) {
                fetchedAnswers.forEach(ans => {
                    if (Object.keys(answers).includes(ans['id'].toString())) {
                        if (answers[ans['id']] === ans['correct_answer']) {
                            correctAnswers += 1
                        }
                        else {
                            wrongAnswers.push({
                                question: ans['question'],
                                correct_option: ans['correct_answer'],
                                correct_answer: ans['correct_answer_text']
                            })
                        }
                    }
                })
            }
        }


        localStorage.removeItem('remainingTime')
        localStorage.removeItem('currentQuestionIndex')
        // localStorage.removeItem('currentQuiz')
        localStorage.removeItem('fetchedQuestions')
        localStorage.removeItem('answers')
        setRemainingTime(timerDuration)
        setCurrentQuiz(null)
        setCurrentQuestionIndex(0)
        setQuestions([])
        setAnswers([])

        localStorage.setItem('quizResult', (correctAnswers / currentQuiz.questions.length) * 100)
        localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers))
        dispatch(setUserDashboard())
    }


    useEffect(() => {
        if (testQuizPage) {
            localStorage.setItem('currentQuestionIndex', currentQuestionIndex)
        }
    }, [currentQuestionIndex])


    useEffect(() => {
        const fetchQuestions = async () => {
            const alreadyFetchedQuestions = localStorage.getItem('fetchedQuestions')

            if (alreadyFetchedQuestions) {
                setQuestions(JSON.parse(alreadyFetchedQuestions))
            }
            else {
                if (currentQuiz) {
                    try {
                        const questionPromises = currentQuiz.questions.map(questionID => {
                            return fetch(`http://127.0.0.1:8000/fetch-question/${questionID}/`)
                                .then(response => response.json())
                        })

                        const fetchedQuestions = await Promise.all(questionPromises)
                        setQuestions(fetchedQuestions)
                        const fetQues = JSON.stringify(fetchedQuestions)
                        localStorage.setItem('fetchedQuestions', fetQues)
                    }
                    catch (error) {
                        console.error('Error fetching question:', error)
                    }
                }
            }
        }
        fetchQuestions()
    }, [currentQuiz])


    useEffect(() => {

        if (startQuizBtnClicked) {
            const intervalID = setInterval(() => {
                setRemainingTime((prevRemainingTime) => {
                    if (prevRemainingTime < 1) {
                        clearInterval(intervalID)
                        localStorage.removeItem('remainingTime')
                        return 0;
                    }
                    localStorage.setItem('remainingTime', (prevRemainingTime - 1))
                    return prevRemainingTime - 1
                })
            }, 1000)

            return () => clearInterval(intervalID)
        }
    }, [startQuizBtnClicked])


    useEffect(() => {
        if (remainingTime <= 0) {
            handleQuizSubmit()
        }

    }, [remainingTime])


    useEffect(() => {
        fetch('http://127.0.0.1:8000/quizzes/')
            .then(response => response.json())
            .then(data => {
                setQuizzes(data)
            })
            .catch(error => console.error('Error in fetching Quizzes: ', error))
    }, [])


    return (
        <div className="take-quiz-wrap">
            {!testQuizPage && (
                <main className="main-content">
                    <section className="available-quizzes">
                        {/* <h2 style={{ marginBottom: '3rem', marginTop: '0rem', color: 'white' }}>Available Quizzes</h2> */}
                        <div className="quiz-page-quiz-list-wrap">
                            {quizzes.map((quiz, index) => (
                                <div className="quiz-page-quiz-list">
                                    <span>{index + 1}.</span> {quiz.title}
                                    <div style={{fontWeight: '400', fontSize: '1rem', color: 'rgb(155, 152, 152)', marginTop: '0.6rem'}}>
                                        Duration: {quiz.duration} mins | Questions: {quiz.number_of_questions} Nos
                                    </div>
                                    <div><button onClick={handleQuizNav(quiz)}>Take Test</button></div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            )}
            {testQuizPage && currentQuiz && (
                <main className="main-content">
                    <div className="quiz-nav-btn-wrap"><button className="quiz-nav-btn" onClick={handleQuizNav()}>Back to Quiz page</button></div>
                    <section className="quiz-interface">
                        <h1>{currentQuiz.title}</h1>
                        {!startQuizBtnClicked && (
                            <div className="quiz-nav-btn-wrap"><button className="quiz-nav-btn" onClick={handleStartQuizBtnClick}>Start Quiz</button></div>
                        )}
                        {startQuizBtnClicked && questions && (
                            <div>
                                <div className="timer">Time Left: <span id="time">{runTimer()}</span></div>
                                <form onSubmit={handleQuizSubmit}>
                                    <div className="question">
                                        <h2>Question {currentQuestionIndex + 1}</h2>
                                        <p>{questions[currentQuestionIndex].question}</p>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`q${currentQuestionIndex}`}
                                                value="A"
                                                checked={answers[currentQuiz.questions[currentQuestionIndex]] === 'A'}
                                                onChange={handleOptionSelection}
                                            />
                                            {questions[currentQuestionIndex].option_a}
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`q${currentQuestionIndex}`}
                                                value="B"
                                                checked={answers[currentQuiz.questions[currentQuestionIndex]] === 'B'}
                                                onChange={handleOptionSelection}
                                            />
                                            {questions[currentQuestionIndex].option_b}
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`q${currentQuestionIndex}`}
                                                value="C"
                                                checked={answers[currentQuiz.questions[currentQuestionIndex]] === 'C'}
                                                onChange={handleOptionSelection}
                                            />
                                            {questions[currentQuestionIndex].option_c}
                                        </label>
                                    </div>
                                    <button type="button" id="prevButton" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
                                    <button type="button" id="nextButton" onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
                                    <button type="submit">Submit Quiz</button>
                                </form>
                            </div>
                        )}
                    </section>
                </main>
            )}
        </div>
    )
}