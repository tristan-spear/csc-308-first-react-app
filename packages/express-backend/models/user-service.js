import mongoose from "mongoose";
import userModel from "./user.js";

mongoose.set("debug", true);

if (mongoose.connection.readyState === 0) {
await mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));
}

async function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = await userModel.find();
    console.log(promise != null);
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  }
  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function deleteUserById(id) {
  const promise = userModel.findByIdAndDelete(id);
  return promise;
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUserById
};