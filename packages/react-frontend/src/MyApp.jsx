// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }

  function updateList(person) { 
    postUser(person)
      .then(() => setCharacters([...characters, person]))
      .catch((error) => {
        console.log(error);
      })
}

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
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
        setCharacters(json["users_list"] || json); // handles both array or object formats
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    }, []);

    function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
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