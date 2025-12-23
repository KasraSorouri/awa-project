import bcrypt from 'bcrypt';

import { User } from '../models';
import { IUser } from '../types/userTypes';

const createUser  = async( userData: IUser) => {
  const { username, password, email, firstName, lastName } = userData;
  try {
    // Check existing user and email
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('Username already exists');
    }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      throw new Error('Email already exists');
    }
    // Encrypt Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash : string = await bcrypt.hash(password, salt);
    
    // Create user
    const newUser: IUser = {
      username,
      password: passwordHash,
      email,
      firstName,
      lastName,
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

export default {
  createUser
}


