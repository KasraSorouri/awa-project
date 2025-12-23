import bcrypt from 'bcrypt';

import { User } from '../models';
import { IUser } from '../types/userTypes';

const createUser  = async( userData: IUser) => {
  const { username, password, email, firstName, lastName } = userData;
  try {
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
      throw new Error('Error creating user');
    }
    return result;

  } catch (error) {
    console.log(error);
    throw new Error('Error creating user');
  }
}

export default {
  createUser
}


