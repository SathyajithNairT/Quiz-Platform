import { useState, useEffect } from "react"



export function PracticeQuiz() {

    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [subCategoryQuestions, setSubCategoryQuestions] = useState([])
    const [subCategoryClicked, setSubCategoryClicked] = useState(false)


    const handleSubCategoryClick = async (subCategoryID) => {
        const response = await fetch(`http://127.0.0.1:8000/get-questions-by-sub-category/${subCategoryID}/`)

        if (response.ok) {
            const data = await response.json()
            if (data.length > 0) {
                setSubCategoryQuestions(data)
                // console.log(data)
            }
            else {
                alert('NO QUESTIONS in this sub-category.')
                return
            }
            setSubCategoryClicked(true)
        }
        else {
            console.error('Failed to fetch questions from this sub-category.')
        }
    }


    const handleQuizOptionClick = (question, selectedOption) => {
        const element = document.getElementById(`question-${question.id}-option-${selectedOption}`)

        if (question.correct_answer === selectedOption){
            element.style.backgroundColor = 'rgba(0, 128, 0, 0.5)'
            // console.log('Correct Answer.')
        }
        else{
            element.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'
            // console.log('Wrong Answer.')
        }
    }

    const handleSubCategoryQuestionsBackClick = () => {
        setSubCategoryClicked(false)
    }


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/manage-category/')
                if (response.ok) {
                    const data = await response.json()
                    setCategories(data)
                    // console.log(data)
                }
                else {
                    console.error('Failed to fetch categories.')
                }
            }
            catch (error) {
                console.error('Error: ', error)
            }
        }

        const fetchSubCategories = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/manage-sub-category/')
                if (response.ok) {
                    const data = await response.json()
                    setSubCategories(data)
                    // console.log(data)
                }
                else {
                    console.error('Failed to fetch sub categories.')
                }
            }
            catch (error) {
                console.error('Error: ', error)
            }
        }

        fetchSubCategories()
        fetchCategories()
    }, [])

    return (
        <div className="practice-quiz-main-wrap">
            {!subCategoryClicked ? (
                <div className="practice-quiz-category-container">
                    {categories.map((cat, index) => (
                        <div className="practice-quiz-category-cards">
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: '600', fontSize: '1.5rem' }}> {cat.category_name}</span>
                                <span style={{ marginLeft: '1.8rem', color: 'grey', marginTop: '0.6rem', fontWeight: '400', display: 'flex', flexDirection: 'column' }}>
                                    {subCategories
                                        .filter(subCat => subCat.category === cat.id && subCat.sub_category_name !== 'None')
                                        .slice(0, 4)
                                        .map((subCat) => (
                                            <span className="practice-quiz-sub-category-list" key={subCat.id} onClick={() => handleSubCategoryClick(subCat.id)}>- {subCat.sub_category_name}</span>
                                        ))}
                                    {subCategories.filter((subCat) => subCat.category === cat.id && subCat.sub_category_name !== 'None').length > 4 && (
                                        <span className="practice-quiz-sub-category-list show-more-link"> Show More</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="practice-quiz-sub-category-questions-container">
                    <div style={{ marginBottom: '2rem', width: '50%', display: 'flex', justifyContent: 'flex-end' }}><button style={{ width: '10rem', marginTop: '0' }} onClick={handleSubCategoryQuestionsBackClick}>Back</button></div>
                    {subCategoryQuestions.map((ques, index) => (
                        <div
                            key={ques.id}
                            className="practice-quiz-sub-category-questions-list"
                            id={`question-${ques.id}`}
                        >
                            <div key={ques.id} style={{ display: 'flex' }}><span style={{ marginRight: '0.8rem' }}>{index + 1}.</span><div>{ques.question}</div></div>
                            <div className="practice-quiz-sub-category-questions-list-options">
                                {["A", "B", "C"].map(option => (
                                    <span
                                        className="practice-quiz-sub-category-questions-list-option-list"
                                        onClick={() => handleQuizOptionClick(ques, option)}
                                        id={`question-${ques.id}-option-${option}`}
                                        key={option}
                                    >
                                        <span className="practice-quiz-sub-category-questions-list-option-index">{option}</span> {ques[`option_${option.toLowerCase()}`]}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}