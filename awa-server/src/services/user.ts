import bcryptjs from 'bcryptjs';
import Jwt from 'jsonwebtoken';

import { SECRET } from '../configs/config'; 
import { User } from '../models';
import { IUser } from '../types/userTypes';
import { Op } from 'sequelize';


const userQuery = {
  attributes: ['id', 'username', 'firstName', 'lastName', 'email'],
}
// Register a user
const createUser  = async( userData: IUser) => {
  const { username, password, email, firstName, lastName } = userData;
  
  try {
    // Check existing user and email
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('Username already exists');
    }
    if (email) { 
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        throw new Error('Email already exists');
      }
    }
    // Encrypt Password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash : string = await bcryptjs.hash(password, salt);
    
    // Create user
    const newUser: IUser = {
      username,
      password: passwordHash,
      email: email?.toLocaleLowerCase(),
      firstName: firstName,
      lastName: lastName,
    };

    const user = new User(newUser)
    const result = await user.save();
    if (!result) { 
      throw new Error('Error creating user at Database');
    }
    return result;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.error(error);
    throw new Error('Error creating user');
  }
}

// Login a user
const loginUser = async (userData: IUser) => {
  const { username, password } = userData;

  try {
    const user = await User.findOne({ where: { username }});
    if (!user) {
      throw new Error('Wrong credentials!');
    }

    const jsonUser = user.toJSON();
    const passwordCorrect = await bcryptjs.compare(password, user.password);
    if (!passwordCorrect) {
      throw new Error('Wrong credentials!');
    }

    // Create token
    const payload = {
      id: user.id,
      username: user.username,
    };

    const token = Jwt.sign(payload, SECRET, { expiresIn: '1h' });
    return {token};

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.error(error);
    throw new Error('Error logging in');
  }
}

// Get User Info
const getUser = async (userId: number) => {

  try {
    const user = await User.findByPk(userId,userQuery);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.error(error);
    throw new Error('Error getting user info');
  }
}

// Get All Users
const getAllUsers = async (userId: number) => {
  try {
    const users = await User.findAll({...userQuery, where: { id: { [Op.ne]: userId } }});
    return users;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.error(error);
    throw new Error('Error getting users');
  }
}




export default {
  createUser,
  loginUser,
  getUser,
  getAllUsers
}


