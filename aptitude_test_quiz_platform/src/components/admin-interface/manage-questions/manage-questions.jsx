import { useState, useEffect, useRef } from "react";

export function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [editClicked, setEditClicked] = useState(false);
  const [toEditQuestion, setToEditQuestion] = useState(null);
  const [categories, setCategories] = useState(null);
  const [searchWord, setSearchWord] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [highlightedID, setHighlightedID] = useState(null)
  const [subCategories, setSubCategories] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const questionRefs = useRef({})

  useEffect(() => {
    fetch("http://127.0.0.1:8000/questions/")
      .then((response) => response.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleDeleteClick = (questionID) => {
    fetch(`http://127.0.0.1:8000/delete-question/${questionID}/`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        setQuestions(questions.filter((q) => q.id !== questionID));
      }
    });
  };

  const handleEditClick = (question) => {
    setEditClicked(true);
    setToEditQuestion(question);
    // console.log(question);
  };

  const handleSaveChanges = (event) => {
    event.preventDefault()

    const editedQuestion = {
      question: event.target["question"].value,
      category: parseInt(event.target["category"].value),
      sub_category: parseInt(event.target["sub_category"].value),
      option_a: event.target["option_a"].value,
      option_b: event.target["option_b"].value,
      option_c: event.target["option_c"].value,
      correct_answer: event.target["correct_answer"].value,
    }

    console.log(editedQuestion)

    fetch(`http://127.0.0.1:8000/edit-question/${toEditQuestion.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedQuestion),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setQuestions(
            questions.map((q) => (q.id === toEditQuestion.id ? data : q))
          );
          setEditClicked(false);
          setToEditQuestion(null);
        }
      })
      .catch((error) => console.error("Error updating question:", error));
  };

  const handleChange = (event) => {
    console.log('Handle change fired.')

    const { name, value } = event.target;

    console.log(`Name: ${name} Value: ${value}`)


    setToEditQuestion((prev) => {
      if (name === 'category') {
        return {
          ...prev,
          category: value,
          sub_category: ''
        }
      }
      return {
        ...prev,
        [name]: value,
      }
    });

    if (name === 'category') {
      setSelectedCategory(parseInt(value))
    }
  };

  const handleManageQuestionEditBackBtnClick = () => {
    setEditClicked(false);
  };

  const handleFilteredQuestionClick = (question_id) => {
    if (questionRefs.current[question_id])
      questionRefs.current[question_id].scrollIntoView({ behaviour: 'smooth', block: 'center' })
    setHighlightedID(question_id)
  }

  useEffect(() => {
    if (toEditQuestion) {
      setSelectedCategory(parseInt(toEditQuestion.category))
    }
  }, [toEditQuestion])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("http://127.0.0.1:8000/manage-category/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error in fetching Categories.");
      }

      const data = await response.json();
      setCategories(data);
    };

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
    fetchCategories();
  }, []);

  useEffect(() => {
    const filter = questions.filter((question) => {
      return question.question.toLowerCase().includes(searchWord.toLowerCase());
    });
    setFilteredQuestions(filter);
  }, [searchWord, questions]);

  useEffect(() => {
    if (searchWord === '') {
      setHighlightedID(null)
    }
  }, [searchWord])

  return (
    <div>
      {editClicked && (
        <div className="manage-question-edit-nav-btn-wrap">
          <button
            className="manage-question-edit-nav-btn"
            onClick={() => handleManageQuestionEditBackBtnClick()}
          >
            Back to manage questions
          </button>
        </div>
      )}
      {!editClicked && (
        <div className="manage-questions-wrap">
          <div
            style={{
              display: "flex",
              flexDirection: 'column',
              alignItems: "center",
              margin: "2rem 0rem",
            }}
          >
            <h1>Manage Questions</h1>
            <div style={{ marginRight: "2rem" }}>
              <label
                htmlFor="search"
                style={{ fontWeight: "600", fontSize: "1.5rem" }}
              >
                Search
              </label>
              <input
                type="text"
                name="search"
                id="search"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
              />
            </div>
          </div>

          {searchWord !== "" && (
            <div className="filtered-questions" style={{ margin: "2rem 0rem" }}>
              <div style={{ margin: '1rem 0rem', color: 'rgb(162, 159, 159)' }}>Click on the question to perform actions</div>
              {filteredQuestions.map((ques) => (
                <div
                  className="filter-list"
                  key={ques.id}
                  onClick={() => handleFilteredQuestionClick(ques.id)}
                >
                  {ques.question}
                </div>
              ))}
            </div>
          )}

          {questions.map((question, index) => (
            <div
              key={question.id}
              style={{ display: "flex", marginBottom: "1rem" }}
              className={`individual-question-wrap ${highlightedID === question.id ? 'highlight' : ''}`}
              ref={(el) => (questionRefs.current[question.id] = el)}
            >
              <div className="manage-questions-btn-wrap">
                <button
                  className="manage-questions-btn"
                  style={{ backgroundColor: "rgb(208, 175, 30)" }}
                  onClick={() => handleEditClick(question)}
                >
                  Edit
                </button>
                <button
                  className="manage-questions-btn"
                  style={{ backgroundColor: "red" }}
                  onClick={() => handleDeleteClick(question.id)}
                >
                  Delete
                </button>
              </div>
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  marginRight: "0.8rem",
                }}
              >
                {index + 1}.
              </span>
              <div>{question.question}</div>
            </div>
          ))}
        </div>
      )}
      {editClicked && (
        <div className="edit-question-wrap">
          <form onSubmit={handleSaveChanges}>
            <div id="questions-container">
              <div className="question">
                <h2>Edit Question</h2>
                <div className="form-group">
                  <label for="question-text">Question Text:</label>
                  <textarea
                    id="question-text"
                    name="question"
                    value={toEditQuestion.question}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label for="category">Category:</label>
                  <select
                    id="category"
                    name="category"
                    value={toEditQuestion.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label for="sub_category">Sub Category:</label>
                  <select
                    id="sub_category"
                    name="sub_category"
                    required
                    onChange={handleChange}
                    value={toEditQuestion.sub_category}
                  >
                    {subCategories
                      .filter((subCat) => selectedCategory === subCat.category)
                      .map(subCat => (
                        <option key={subCat.id} value={subCat.id}>{subCat.sub_category_name}</option>
                      ))}
                  </select>
                </div>
                <div className="form-group">
                  <label for="option-A">Option A:</label>
                  <input
                    type="text"
                    id="option-A"
                    name="option_a"
                    value={toEditQuestion.option_a}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label for="option-B">Option B:</label>
                  <input
                    type="text"
                    id="option-B"
                    name="option_b"
                    value={toEditQuestion.option_b}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label for="option-C">Option C:</label>
                  <input
                    type="text"
                    id="option-C"
                    name="option_c"
                    value={toEditQuestion.option_c}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label for="correct-answer">Correct Answer:</label>
                  <select
                    id="correct-answer"
                    name="correct_answer"
                    value={toEditQuestion.correct_answer}
                    onChange={handleChange}
                    required
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="submit" style={{ marginBottom: "1rem" }}>
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
