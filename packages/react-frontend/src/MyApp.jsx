// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  // function removeOneCharacter(index) {
  //   const updated = characters.filter((character, i) => {
  //     return i !== index;
  //   });
  //   setCharacters(updated);
  // }

  function updateList(person) {
    postUser(person)
      .then((newUser) => setCharacters((prev) => [...prev, newUser]))
      .catch((error) => console.error("Error adding user:", error));
  }

  function remove(person) {
    deleteUser(person)
      .then(() => setCharacters([...characters, person]))
      .catch((error) => {
        console.log(error);
      });
  }

  async function fetchUsers() {
    const promise = await fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((json) => {
        console.log("Fetched data from backend:", json);
        setCharacters(json["user_list"] || json); // handles both array or object formats
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    }, []);

  function postUser(person) {
    return fetch("http://localhost:8000/users", {  // lowercase 'http'
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    }).then((res) => res.json());
  }

    function removeOneCharacter(id) {
      fetch(`http://localhost:8000/users/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.status === 204) {
            // Successful deletion — update state
            setCharacters((prev) => prev.filter((character) => character._id !== id && character.id !== id));
          } else if (response.status === 404) {
            console.error("User not found (nothing deleted)");
          } else {
            console.error("Failed to delete user. Status:", response.status);
          }
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }

  return (
    <div className="container">
      <Table 
      characterData={characters} 
      removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
  }

export default MyApp;