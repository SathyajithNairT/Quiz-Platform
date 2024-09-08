import { useState, useEffect } from "react"


export function CreateQuestions() {

    const [questionCreationSuccessful, setQuestionCreationSuccessful] = useState(false)
    const [categories, setCategories] = useState(null)
    const [subCategories, setSubCategories] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState(null)

    const handleSubmit = (event) => {
        event.preventDefault()

        const formData = new FormData(event.target)

        const questionData = {
            question: formData.get('question-text'),
            category: parseInt(formData.get('category')),
            sub_category: parseInt(formData.get('subcategory')),
            option_a: formData.get('option-A'),
            option_b: formData.get('option-B'),
            option_c: formData.get('option-C'),
            correct_answer: formData.get('correct-answer')
        }

        createQuestions(questionData)
    }

    const handleCategoryValueChange = (event) => {
        setSelectedCategory(parseInt(event.target.value))
        // console.log(event.target.value)
    }

    const createQuestions = async (questionData) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/add-question/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(questionData)
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Question created successfully:', data)
                setQuestionCreationSuccessful(true)
            }
            else {
                console.error('Failed to create question:', response.statusText)
            }
        }
        catch (error) {
            console.error('Error:', error)
        }
    }

    const handleAddAnotherQuestionClick = () => {
        setQuestionCreationSuccessful(false)
    }


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

    useEffect(() => {
        if (categories !== null && selectedCategory === null) {
            setSelectedCategory(categories[0].id)
        }
    }, [categories])

    return (
        <section className="dashboard">
            <div className="create-question-form">
                {!questionCreationSuccessful && categories && subCategories && (
                    <form onSubmit={handleSubmit}>
                        <div id="questions-container">
                            <div className="question">
                                <h2>Question</h2>
                                <div className="form-group">
                                    <label for="question-text">Question Text:</label>
                                    <textarea id="question-text" name="question-text" required></textarea>
                                </div>
                                <div className="form-group">
                                    <label for="category">Category:</label>
                                    <select id="category" name="category" required onChange={handleCategoryValueChange}>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label for="subcategory">Sub Category:</label>
                                    <select id="subcategory" name="subcategory" required>
                                        {subCategories
                                            .filter((subCat) => selectedCategory === subCat.category)
                                            .map(subCat => (
                                                <option key={subCat.id} value={subCat.id}>{subCat.sub_category_name}</option>
                                            ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label for="option-A">Option A:</label>
                                    <input type="text" id="option-A" name="option-A" required />
                                </div>
                                <div className="form-group">
                                    <label for="option-B">Option B:</label>
                                    <input type="text" id="option-B" name="option-B" required />
                                </div>
                                <div className="form-group">
                                    <label for="option-C">Option C:</label>
                                    <input type="text" id="option-C" name="option-C" required />
                                </div>
                                <div className="form-group">
                                    <label for="correct-answer">Correct Answer:</label>
                                    <select id="correct-answer" name="correct-answer" required>
                                        <option value="A">Option A</option>
                                        <option value="B">Option B</option>
                                        <option value="C">Option C</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button type="submit">Create Question</button>
                    </form>
                )}
                {questionCreationSuccessful && (
                    <div className="question-creation-success-page">
                        <div className="question-creation-success-heading">
                            Question created successfully. Would you like to add another Question?
                        </div>
                        <div>
                            <button onClick={handleAddAnotherQuestionClick}>Add another Question</button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}