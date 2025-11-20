// backend.js
import express from "express";
import cors from "cors";

import userService from "./models/user-service.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// const users = {
//   users_list: [
//     {
//       id: "xyz789",
//       name: "Charlie",
//       job: "Janitor"
//     },
//     {
//       id: "abc123",
//       name: "Mac",
//       job: "Bouncer"
//     },
//     {
//       id: "ppp222",
//       name: "Mac",
//       job: "Professor"
//     },
//     {
//       id: "yat999",
//       name: "Dee",
//       job: "Aspring actress"
//     },
//     {
//       id: "zap555",
//       name: "Dennis",
//       job: "Bartender"
//     }
//   ]
// };

// // helper functions
// const findUserByName = (name) => {
//   return users["users_list"].filter(
//     (user) => user.name === name
//   );
// };


// const findUserById = (id) =>
//   users["users_list"].find((user) => user["id"] === id);

// const addUser = (user) => {
//   users["users_list"].push(user);
//   return user;
// };

// const removeUserById = (id) => {
//     return users.users_list.filter(
//         (user) => user.id != id
//     );
// }

// const findUserByJob = (userArr, job) => {
//     return userArr.filter(
//         (user) => user.job === job
//     );
// }

// function generateId() {
//   const id = Math.floor(Math.random() * 1000000);
//   return id;
// }

// // hello world / home
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// get all users
app.get("/users", async (req, res) => {
  // const name = req.query.name;
  // if (name != undefined) {
  //   let result = findUserByName(name);
  //   result = { users_list: result };
  //   res.send(result);
  // } else {
  //  res.send(users.users_list);
  // }

  const name = req.query.name;
  const job = req.query.job;
  try {
    const result = await userService.getUsers(name, job);
    res.send({ user_list : result});
  }
  catch(err) {
    console.error(err);
    res.status(500).send("An error occurred in the server.");
  }
  
});

// get user by id
app.get("/users/:id", async (req, res) => {
  // const id = req.params.id;
  // let result = findUserById(id);
  // if (result === undefined) {
  //   res.status(404).send("Resource not found.");
  // } else {
  //   res.send(result);
  // }

  const id = req.params.id;
  const result = await userService.findUserById(id);
  
  if(result === undefined || result === null)
      res.status(404).send("Resource not found.");
  else
    res.send({ searchUser : result});
});

//add user
app.post("/users", async (req, res) => {
  const user = req.body;
  const savedUser = await userService.addUser(user);
  if (savedUser){
    console.log("WTF");
    res.status(201).send(savedUser);
  }
  else
    res.status(500).end();
});


// delete user by id
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await userService.deleteUserById(id);

  if(deletedUser)
      res.status(204).send();
  else
    res.status(404).send("Resource not found.");
}
  catch(error) {
      if (error.name === "CastError") return res.status(400).send("Invalid ID");
      console.log(error);
      return res.status(500).send("Server error");
  };
});

// get users by name and job
app.get("/users/:name/:job", async (req, res) => {
  const name = req.params.name;
  const job = req.params.job;
  // let result = findUserByName(name);
  // let finalResult = findUserByJob(result, job);
  // if (finalResult === undefined) {
  //   res.status(404).send("Resource not found.");
  // } else {
  //   res.send(finalResult);
  // }

  try {
    const result = await userService.getUsers(name, job);
    res.send({ user_list : result});
  }
  catch(err) {
    console.error(err);
    res.status(500).send("An error occurred in the server.");
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});