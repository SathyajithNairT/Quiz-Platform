import { useState, useEffect } from "react"


export function ManageQuiz() {

    const [quizzes, setQuizzes] = useState([])
    const [editClicked, setEditClicked] = useState(false)
    const [toEditQuiz, setToEditQuiz] = useState(null)
    const [questions, setQuestions] = useState([])
    const [categories, setCategories] = useState(null)
    const [questionCategory, setQuestionCategory] = useState(null)
    const [selectedQuestions, setSelectedQuestions] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/quizzes/')
            .then(response => response.json())
            .then(data => setQuizzes(data))
    }, [])

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('http://127.0.0.1:8000/manage-category/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (!response.ok) {
                throw new Error('Error in fetching Categories.')
            }

            const data = await response.json()
            setCategories(data)
            // console.log(data)
        }

        fetchCategories()
    }, [])

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/questions/?category=${questionCategory}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    setQuestions(data)
                    // console.log(data)
                }
                else {
                    setQuestions(data)
                    alert('No questions in this category.')
                }
            })
            .catch(error => console.error('Error in fetching questions:', error));
    }, [questionCategory])

    const deleteQuiz = (user_id) => {
        fetch(`http://127.0.0.1:8000/delete-quiz/${user_id}/`, {
            method: 'DELETE',
        })
            .then(() => setQuizzes(quizzes.filter(quiz => quiz.id !== user_id)))
    }

    const handleCategoryChange = (event) => {
        setQuestionCategory(event.target.value)
    }

    const handleEditQuiz = (quiz) => {
        setToEditQuiz(quiz)
        setEditClicked(true)

        fetch(`http://127.0.0.1:8000/questions/?category=1`)
            .then(response => response.json())
            .then(data => {
                setQuestions(data)

                const alreadySelected = data.filter(question => quiz.questions.includes(question.id))
                setSelectedQuestions(alreadySelected)
            })
    }

    const handleQuestionSelection = (question) => {
        if (selectedQuestions.some(q => q.id === question.id)) {
            setSelectedQuestions(selectedQuestions.filter(q => q.id !== question.id))
        }
        else {
            setSelectedQuestions([...selectedQuestions, question])
        }
    }

    const clearSelection = () => {
        setSelectedQuestions([])
    }


    const handleSubmit = (event) => {
        event.preventDefault()

        const updatedQuiz = {
            title: event.target['title'].value,
            description: event.target['description'].value,
            duration: event.target['duration'].value,
            questions: selectedQuestions.map(q => q.id),
        }

        fetch(`http://127.0.0.1:8000/edit-quiz/${toEditQuiz.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedQuiz)
        })
            .then(response => response.json())
            .then(() => {
                setEditClicked(false)
                setToEditQuiz(null)
                setSelectedQuestions([])

                fetch('http://127.0.0.1:8000/quizzes/')
                    .then(response => response.json())
                    .then(data => setQuizzes(data))
            })
    }

    const handleEditNavBackBtnClick = () => {
        setEditClicked(false)
    }

    return (
        <div className="manage-quiz-main-wrap">
            <main className="main-content with-sidebar">
                {editClicked && (
                    <div className="edit-quiz-nav-wrap"><button className="edit-quiz-nav-btn" onClick={() => handleEditNavBackBtnClick()}>Back to Manage Quizzes</button></div>
                )}
                {!editClicked && (
                    <section className="dashboard">
                        <h1 style={{color: 'white'}}>Manage Quizzes</h1>
                        <div className="quiz-management">
                            <ul>
                                {quizzes.map((quiz, index) => (
                                    <li key={quiz.id} style={{backgroundColor: '#2C3E50', color: '#ECF0F1'}}>
                                        <div style={{ marginRight: '1rem' }}>{quiz.title} </div>
                                        <div
                                            className="manage-quiz-link-wrap"
                                            style={{ backgroundColor: 'rgb(214, 194, 49)', marginLeft: 'auto' }}
                                            onClick={(event) => {
                                                event.preventDefault()
                                                handleEditQuiz(quiz)
                                            }}
                                        >
                                            <a className="manage-quiz-link">Edit Quiz</a>
                                        </div>
                                        <div
                                            className="manage-quiz-link-wrap"
                                            style={{ backgroundColor: 'red' }}
                                            onClick={(event) => {
                                                event.preventDefault()
                                                deleteQuiz(quiz.id)
                                            }}
                                        >
                                            <a className="manage-quiz-link">Delete Quiz</a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {/* <a className="button">Create New Quiz</a> */}
                        </div>
                    </section>
                )}
                {editClicked && (
                    <div className="edit-quiz-wrap">
                        <h1>Edit Quiz</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label for="quiz-title">Quiz Title: </label>
                                <input type="text" id="quiz-title" name="title" defaultValue={toEditQuiz.title} required />
                            </div>
                            <div className="form-group">
                                <label for="category">Category:</label>
                                <select id="category" name="category" required onChange={handleCategoryChange}>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label for="quiz-description">Quiz Description:</label>
                                <textarea id="quiz-description" name="description" defaultValue={toEditQuiz.description} required></textarea>
                            </div>
                            <div className="form-group">
                                <label for="quiz-duration">Quiz Duration (in minutes):</label>
                                <input type="number" id="quiz-duration" name="duration" defaultValue={toEditQuiz.duration} required />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: '600', fontSize: '1.5rem' }}>Selected Questions: </label>
                                {selectedQuestions.length === 0 && (
                                    <div style={{ marginLeft: '3rem' }}>
                                        No question selected. Please use the checkbox below to select the questions from the question bank.
                                    </div>
                                )}
                                <ul>
                                    {selectedQuestions.map((question, index) => (
                                        <div style={{ display: 'flex' }}>
                                            <span style={{ fontWeight: '600', marginRight: '0.5rem' }}>{index + 1}.</span> <div key={question.id}>{question.question}</div>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: '600', fontSize: '1.5rem' }}>Select Questions: </label>
                                {questions.length > 0 ? (
                                    <ul>
                                        {questions.map((question, index) => (
                                            <div key={question.id} style={{ display: 'flex' }}>
                                                <span style={{ fontWeight: '600', marginRight: '0.5rem' }}>{index + 1}.</span> <label htmlFor={`question-${question.id}`} style={{ width: '100%' }}>{question.question}</label>
                                                <input
                                                    type="checkbox"
                                                    id={`question-${question.id}`}
                                                    checked={selectedQuestions.some(q => q.id === question.id)}
                                                    onChange={() => handleQuestionSelection(question)}
                                                    style={{ width: '10%' }}
                                                />
                                            </div>
                                        ))}
                                    </ul>
                                ) : (
                                    <div>No Question avaliable in this Category</div>
                                )
                            }
                            </div>
                            <button type="button" className="quiz-clear-selection" onClick={clearSelection}>Clear Selection</button>
                            <button type="submit">Edit Quiz</button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    )
}