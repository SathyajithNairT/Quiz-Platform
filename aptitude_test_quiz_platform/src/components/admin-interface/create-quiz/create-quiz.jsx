import { useState, useEffect } from "react"



export function CreateQuiz() {


    const [questions, setQuestions] = useState([])
    const [selectedQuestions, setSelectedQuestions] = useState([])
    const [categories, setCategories] = useState([])
    const [questionCategory, setQuestionCategory] = useState(null)

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/questions/?category=1`)
            .then(response => response.json())
            .then(data => setQuestions(data))
            .catch(error => console.error('Error in fetching questions:', error));

        fetch('http://127.0.0.1:8000/manage-category/')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error in fetching categories:', error))
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

    const handleQuestionSelection = (question) => {
        if (selectedQuestions.includes(question)) {
            setSelectedQuestions(selectedQuestions.filter(ques => ques.id !== question.id))
        }
        else {
            setSelectedQuestions([...selectedQuestions, question])
        }
    }

    const handleCategoryChange = (event) => {
        setQuestionCategory(event.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)

        const quizData = {
            title: formData.get('quiz-title'),
            description: formData.get('quiz-description'),
            duration: formData.get('quiz-duration'),
            questions: selectedQuestions.map(q => q.id)
        }


        try {
            const response = await fetch('http://127.0.0.1:8000/add-quiz/', {
                method: 'POST',
                body: JSON.stringify(quizData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                // console.log('')
                event.target.reset()
                alert('Quiz creation Successful!')
                setSelectedQuestions([])
            }
            else {
                console.error('Failed to create Quiz.')
            }
        }
        catch (error) {
            console.error('Error:', error)
        }
    }

    const clearSelection = () => {
        setSelectedQuestions([])
    }


    return (
        <div>
            <main className="main-content with-sidebar">
                <section className="create-quiz-form">
                    <h1>Create a New Quiz</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label for="quiz-title">Quiz Title:</label>
                            <input type="text" id="quiz-title" name="quiz-title" required />
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
                            <textarea id="quiz-description" name="quiz-description" required></textarea>
                        </div>
                        <div className="form-group">
                            <label for="quiz-duration">Quiz Duration (in minutes):</label>
                            <input type="number" id="quiz-duration" name="quiz-duration" required />
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
                                <div>No questions available in this Category</div>
                            )
                        }
                        </div>
                        <button type="button" className="quiz-clear-selection" onClick={clearSelection}>Clear Selection</button>
                        <button type="submit">Create Quiz</button>
                    </form>
                </section>
            </main>
        </div>
    )
}