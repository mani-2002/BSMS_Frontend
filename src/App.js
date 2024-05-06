import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencilAlt,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [books, setBooks] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false); // State for Add Book popup
  const [showViewPopup, setShowViewPopup] = useState(false); // State for View Book popup
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [editBookId, setEditBookId] = useState("");
  const [viewBook, setViewBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };

  const handleViewBook = (book) => {
    setViewBook(book);
    setShowViewPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddPopup(false);
    setShowViewPopup(false);
    setViewBook(null);
  };

  const handleBookNameChange = (event) => {
    setBookName(event.target.value);
  };

  const handleAuthorNameChange = (event) => {
    setAuthorName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editBookId) {
        await axios.put(`http://localhost:5000/api/books/${editBookId}`, {
          bookName,
          authorName,
        });
      } else {
        await axios.post("http://localhost:5000/api/books", {
          bookName,
          authorName,
        });
      }
      setBookName("");
      setAuthorName("");
      setEditBookId("");
      setShowAddPopup(false);
      fetchBooks(); // Fetch books after adding/editing
    } catch (error) {
      console.error("Error adding/editing book:", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`);
      fetchBooks(); // Fetch books after deleting
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };
  const handleEditBook = (book) => {
    setBookName(book.bookName);
    setAuthorName(book.authorName);
    setEditBookId(book._id);
    setShowAddPopup(true);
  };

  return (
    <div style={{ backgroundColor: "lightgreen", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            backgroundColor: "whitesmoke",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2vh",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: "bold",
                fontFamily: "fantasy",
                fontSize: "5vh",
                marginBottom: "3vh",
                textAlign: "center",
              }}
            >
              Welcome to Book Store Management System
            </div>
            <div style={{ marginLeft: "90vh" }}>
              <button className="btn btn-primary m-2" onClick={handleAddPopup}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "1vh" }} />
                Add Book
              </button>
              {showAddPopup && (
                <div style={styles.modal}>
                  <div style={styles.modalContent}>
                    <span style={styles.close} onClick={handleClosePopup}>
                      &times;
                    </span>
                    <form onSubmit={handleSubmit}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Enter Bookname:</label>
                        <input
                          type="text"
                          style={styles.input}
                          value={bookName}
                          onChange={handleBookNameChange}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Enter Authorname:</label>
                        <input
                          type="text"
                          style={styles.input}
                          value={authorName}
                          onChange={handleAuthorNameChange}
                        />
                      </div>
                      <button type="submit" className="btn btn-success">
                        {editBookId ? "Modify" : "Add Book"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <table
              style={{
                border: "1px solid black",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th
                    style={{
                      width: "30vh",
                      border: "1px solid black",
                      borderCollapse: "collapse",
                    }}
                  >
                    Book Name
                  </th>
                  <th
                    style={{
                      width: "30vh",
                      border: "1px solid black",
                      borderCollapse: "collapse",
                    }}
                  >
                    Author Name
                  </th>
                  <th
                    style={{
                      width: "40vh",
                      border: "1px solid black",
                      borderCollapse: "collapse",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id} style={{ textAlign: "center" }}>
                    <td
                      style={{
                        width: "20vh",
                        border: "1px solid black",
                        borderCollapse: "collapse",
                      }}
                    >
                      {book.bookName}
                    </td>
                    <td
                      style={{
                        width: "20vh",
                        border: "1px solid black",
                        borderCollapse: "collapse",
                      }}
                    >
                      {book.authorName}
                    </td>
                    <td
                      style={{
                        width: "50vh",
                        border: "1px solid black",
                        borderCollapse: "collapse",
                      }}
                    >
                      <button
                        className="btn btn-secondary m-1"
                        onClick={() => handleEditBook(book)}
                      >
                        <FontAwesomeIcon icon={faPencilAlt} /> Edit
                      </button>
                      <button
                        className="btn btn-danger m-1"
                        onClick={() => handleDeleteBook(book._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                      <button
                        className="btn m-1"
                        style={{ backgroundColor: "greenyellow" }}
                        onClick={() => handleViewBook(book)}
                      >
                        <FontAwesomeIcon icon={faEye} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {viewBook && showViewPopup && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <span style={styles.close} onClick={handleClosePopup}>
              &times;
            </span>
            <h2>Book Details</h2>
            <p>
              <strong>Title:</strong> {viewBook.bookName}
            </p>
            <p>
              <strong>Author:</strong> {viewBook.authorName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  modal: {
    position: "fixed",
    zIndex: "1",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    overflow: "auto",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fefefe",
    margin: "15% auto",
    padding: "20px",
    border: "1px solid #888",
    width: "50%",
    borderRadius: "10px",
    textAlign: "center",
  },
  close: {
    color: "#aaa",
    float: "right",
    fontSize: "28px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
};

export default App;
