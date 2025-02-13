import express, { Request, Response } from "express";
import Joi from "joi";
import { addUser, getUserByEmail } from "../services/user.service";
import { generateToken, verifyToken } from "../shared/auth.utils";
import { addToken, deleteToken, getToken } from "../services/token.service";
import {
  checkUserTaskList,
  getTaskListById,
} from "../services/taskList.service";
import { User } from "../models/User";
import { console } from "inspector";

export const registerUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(100),
  });

  const schemaValidator = schema.validate(req.body);

  if (schemaValidator.error) {
    res
      .status(400)
      .json({ message: "Invalid Data", errors: schemaValidator.error });
    return;
  }
  let { email, password, name } = schemaValidator.value;

  const exitingUser = await getUserByEmail(email);
  console.log(exitingUser);
  if (exitingUser) {
    res.status(400).json({ message: "User Already Exit " });
    return;
  }
  password = password;

  let user = await addUser(email, password, name);

  delete user.password;

  res.status(201).json(user);
};

export const loginController = async (req: Request, res: Response) => {
  console.log("login: in backend");
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6).max(100),
  });

  const schemaValidator = schema.validate(req.body);

  if (!schemaValidator.value) {
    res
      .status(400)
      .json({ message: "Invalid Data", errors: schemaValidator.error });
    return;
  }
  const { email, password } = schemaValidator.value;

  const user = await getUserByEmail(email);
  if (!user) {
    res.status(400).json({ message: "User Not Found" });
    return;
  }
  if (user.password !== password) {
    res.status(400).json({ message: "Invalid Password" });
    return;
  }

  const accessToken = generateToken(user.id);
  const refreshToken = generateToken(user.id);

  //delete old refresh token from db
  await deleteToken(user.id);

  //save refresh token in db

  await addToken(refreshToken, "refresh", user.id);
  await addToken(accessToken, "access", user.id);

  //create and send session to user
  const session = {
    accessToken,
    refreshToken,
    user: user.toJSON(),
  };
  console.log("User logged in");
  res.status(200).json(session);
  return;
};
export const subdomainLoginController = async (req: Request, res: Response) => {
  
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6).max(100),
    taskListId: Joi.string().required(),
  });

  const schemaValidator = schema.validate(req.body);

  if (!schemaValidator.value) {
    res
      .status(400)
      .json({ message: "Invalid Data", errors: schemaValidator.error });
    return;
  }
  const { email, password, taskListId } = schemaValidator.value;

  const user = await getUserByEmail(email);
  if (!user) {
    res.status(400).json({ message: "User Not Found" });
    return;
  }
  if (user.password !== password) {
    res.status(400).json({ message: "Invalid Password" });
    return;
  }

  const secID = parseInt(taskListId);

  const isUserAssigned = await checkUserTaskList(user.id, secID);
  if (!isUserAssigned) {
    res.status(400).json({ message: "User Not Assigned to Tasklist" });
    return;
  }

  const accessToken = generateToken(user.id);
  const refreshToken = generateToken(user.id);

  //delete old refresh token from db
  await deleteToken(user.id);

  //save refresh token in db

  await addToken(refreshToken, "refresh", user.id);
  await addToken(accessToken, "access", user.id);

  //create and send session to user
  const session = {
    accessToken,
    refreshToken,
    user: user.toJSON(),
  };
  console.log("User logged in");
  res.status(200).json(session);
  return;
};
export const subdomaincheckController = async (req: Request, res: Response) => {
  console.log("subdomaincheckController");
  // const token = req.header('Authorization')?.replace('Bearer ','');
  // if(!token){
  //     res.status(401).json({message: 'Acess Denied '});
  //     return;
  // }

  // const verified = verifyToken(token);
  // if(!verified){
  //     res.status(401).json({message: 'Invalid Token :('});
  //     return;
  // }

  // User.findByPk((verified as any).userId).then((user)=>{
  //     if(user){
  //         (req as any).user = user;
  //     }
  //     else{
  //         res.status(401).json({message: 'User Not Found!!'});
  //         return;
  //     }
  // });
  // console.log('subdomaincheckController UserID is ', (req as any).user.id);
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const schema = Joi.object({
    refreshToken: Joi.string(),
  });

  const schemaValidator = schema.validate(req.body);

  if (!schemaValidator.value) {
    res
      .status(400)
      .json({ message: "Invalid Data", errors: schemaValidator.error });
    return;
  }
  const { refreshToken } = schemaValidator.value;

  const isTokenValid = verifyToken(refreshToken);

  if (!isTokenValid) {
    res.status(400).json({ message: "Token Invalid! " });
    return;
  }
  const dbRefreshToken = await getToken(refreshToken);

  if (!dbRefreshToken || dbRefreshToken.get("type") !== "refresh") {
    res.status(400).json({ message: "Token Not Found! " });
    return;
  }
  const userId = dbRefreshToken.get("userId");
  const accessToken = generateToken(userId!);
  const newRefreshToken = generateToken(userId!, "7d");

  await deleteToken(userId!);

  await addToken(newRefreshToken, "refresh", userId!);
  await addToken(accessToken, "access", userId!);

  res.status(200).json({
    accessToken,
    refreshToken: newRefreshToken,
  });
  return;
};

export const logoutController = async (req: Request, res: Response) => {
  const schema = Joi.object({
    refreshToken: Joi.string(),
  });

  const schemaValidator = schema.validate(req.body);

  if (!schemaValidator.value) {
    res
      .status(400)
      .json({ message: "Invalid Data", errors: schemaValidator.error });
    return;
  }
  const { refreshToken } = schemaValidator.value;

  const isTokenValid = verifyToken(refreshToken);

  if (!isTokenValid) {
    res.status(400).json({ message: "Token Invalid! " });
    return;
  }

  const dbRefreshToken = await getToken(refreshToken);

  if (!dbRefreshToken || dbRefreshToken.get("type") !== "refresh") {
    res.status(400).json({ message: "Token Not Found! " });
    return;
  }
  const userId = dbRefreshToken.get("userId");

  await deleteToken(userId!);

  res.status(200).json({ message: "Logout Out!" });
  return;
};
export const checkEmailController = async (req: Request, res: Response) => {
  const { email } = req.params;
  const user = await getUserByEmail(email);
  if (user) {
    res.status(200).json({ exists: true, user });
    return;
  }
  res.status(200).json({ exists: false });
  return;
};
