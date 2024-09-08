import { useState, useEffect } from "react"




export function Categories() {

    const [addNewCategoryBtnClicked, setAddNewCategoryBtnClicked] = useState(false)
    const [addSubCategoryClicked, setAddSubCategoryClicked] = useState(false)
    const [categoryName, setCategoryName] = useState('')
    const [categoryID, setCategoryID] = useState(null)
    const [subCategoryName, setSubCategoryName] = useState('')
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])


    const handleAddNewCategoryClick = () => {
        setAddNewCategoryBtnClicked(true)
    }

    const handleAddSubCategoryClick = (category_id) => {
        setCategoryID(category_id)
        setAddSubCategoryClicked(true)
    }

    const handleCategoryNameChange = (event) => {
        setCategoryName(event.target.value)
    }

    const handleSubCategoryNameChange = (event) => {
        setSubCategoryName(event.target.value)
    }

    const handleAddCategory = async (event) => {
        event.preventDefault()

        try {
            const response = await fetch('http://127.0.0.1:8000/manage-category/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category_name: categoryName }),
            })

            if (!response.ok) {
                throw new Error('Category creation Failed.')
            }

            // const data = await response.json()
        }
        catch (error) {
            console.error('Error: ', error)
        }

        setCategoryName('')
        setAddNewCategoryBtnClicked(false)
    }


    const handleAddSubCategory = async () => {
        const data = {
            category: categoryID,
            sub_category_name: subCategoryName
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/manage-sub-category/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error('Sub Category creation failed.')
            }
        }
        catch (error) {
            console.error('Error: ', error)
        }

        setSubCategoryName('')
        // setAddSubCategoryClicked(false)
    }


    const handleBackToManageCategoryClick = () => {
        setAddNewCategoryBtnClicked(false)
        setAddSubCategoryClicked(false)
    }


    const handleDeleteClick = async (category_id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/manage-category/${category_id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                const errorData = await response.json()
                console.error('Error deleting category: ', errorData)
            }
        }
        catch (error) {
            console.error('Network error: ', error)
        }
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
    }, [addNewCategoryBtnClicked, addSubCategoryClicked])


    return (
        <div className="category-main-wrap">
            {!addNewCategoryBtnClicked && !addSubCategoryClicked && (
                <div style={{ width: '100%' }}>
                    <div style={{ marginLeft: '20rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={handleAddNewCategoryClick} style={{ width: '12rem' }}>Add New Category</button>
                    </div>
                    <div className="category-list-wrap">
                        <div style={{ marginBottom: '2rem' }}><h1>Available Categories</h1></div>
                        <div className="category-list">
                            {categories.map((cat, index) => (
                                <div className="category">
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '1.5rem' }}>{/*<span style={{ marginRight: '1rem' }}>{index + 1}</span>*/} {cat.category_name}</span>
                                        <span style={{ marginLeft: '1.8rem', color: 'grey', marginTop: '0.6rem', fontWeight: '400', display: 'flex', flexDirection: 'column' }}>
                                            <span style={{fontSize: '1.2rem'}}>Sub Categories:</span>
                                            {subCategories
                                                .filter(subCat => subCat.category === cat.id && subCat.sub_category_name !== 'None')
                                                .slice(0, 4)
                                                .map((subCat) => (
                                                    <span className="practice-quiz-sub-category-list" >- {subCat.sub_category_name}</span>
                                                ))}
                                            {subCategories.filter((subCat) => subCat.category === cat.id && subCat.sub_category_name !== 'None').length > 4 && (
                                                <span className="practice-quiz-sub-category-list show-more-link"> Show More</span>
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <span><button onClick={() => handleAddSubCategoryClick(cat.id)}>Add Sub Category</button></span>
                                        <span><button style={{ backgroundColor: 'red' }} onClick={() => handleDeleteClick(cat.id)}>Delete</button></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {addNewCategoryBtnClicked && (
                <div style={{ marginLeft: '20rem', marginTop: '5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                        <button style={{ width: '15rem' }} onClick={handleBackToManageCategoryClick}>Back to Manage Categories</button>
                    </div>
                    <div className="form-group add-category-sub-wrap">
                        <label htmlFor="category">Category Name: </label>
                        <input
                            type="text"
                            name="category"
                            value={categoryName}
                            onChange={handleCategoryNameChange}
                        />
                        <div style={{ marginTop: '1rem' }}><button onClick={handleAddCategory}>Add Category</button></div>
                    </div>
                </div>
            )
            }
            {addSubCategoryClicked && (
                <div style={{ marginLeft: '20rem', marginTop: '5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                        <button style={{ width: '15rem' }} onClick={handleBackToManageCategoryClick}>Back to Manage Categories</button>
                    </div>
                    <div className="form-group add-category-sub-wrap">
                        <label htmlFor="subcategory">Sub Category Name: </label>
                        <input
                            type="text"
                            name="subcategory"
                            value={subCategoryName}
                            onChange={handleSubCategoryNameChange}
                        />
                        <div style={{ marginTop: '1rem' }}><button onClick={handleAddSubCategory}>Add Sub Category</button></div>
                    </div>
                </div>
            )}
        </div>
    )
}