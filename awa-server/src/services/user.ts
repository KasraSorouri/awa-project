import bcryptjs from 'bcryptjs';
import Jwt from 'jsonwebtoken';

import { SECRET } from '../configs/config'; 
import { User, File } from '../models';
import { IUser, IUserUpdateData } from '../types/userTypes';
import { Op } from 'sequelize';
import { IFileParam } from '../types/fileTypes';
import storeFile from '../utils/storeFile';


const userQuery = {
  attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'picture'],
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


// Edit User Info
const updateUser = async (userId: number, userData: IUserUpdateData) => {
  const { firstName, lastName, email, picture } = userData;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await user.update({
      firstName,
      lastName,
      email: email?.toLocaleLowerCase(),
      picture
    });

    return updatedUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.error(error);
    throw new Error('Error updating user');
  }
}

const uploadProfilePicture = async (userId: number, picture:  Express.Multer.File) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const fileParams: IFileParam = {
      creationMethod: 'upload',
      userId: userId,
      fileType: 'picture',
      file: picture
    }
    
    const { fullPath } = await storeFile.saveFile(fileParams);

    const updatedUser = await user.update({
      picture: fullPath
    });

    return updatedUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.error(error);
    throw new Error('Error uploading profile picture');
  }
}

// get profile picture
const getProfilePicture = async (userId: number) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const picturePath = user.picture;

    return picturePath;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.error(error);
    throw new Error('Error getting profile picture');
  }
} 

// get Stats
const getStats = async(userId: number) => {
  try {
    const userFiles = await User.findByPk(userId, {
      include: [
       { model: File,
          as: 'ownedFiles',
          attributes: ['id', 'fileName', 'folderId', 'fileType', 'address', 'editable', 'deleted', 'activated'],
       },
        {
        model: File,
        as: 'sharedFiles',
        attributes: ['id', 'fileName', 'folderId', 'fileType', 'address', 'editable', 'deleted', 'activated'],
      }],
      attributes:[]
    });

    const userDeletedFile = userFiles?.ownedFiles?.filter(file => file.deleted === true).length

    const userOwnedFile = userFiles?.ownedFiles ? userFiles?.ownedFiles?.length : 0 
    const userSharedfile = (userFiles?.sharedFiles ? userFiles?.sharedFiles.length : 0) - userOwnedFile
    console.log(` user ownedfile : ${userOwnedFile} , user shared file: ${userSharedfile} , user deleted files : ${userDeletedFile}`)

    const result ={
       ownedFiles : userOwnedFile,
       sharedFiles : userSharedfile,
       DeletedFiles : userDeletedFile
    }
   return result

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.error(error);
    throw new Error('Error getting profile picture');
  }
}

export default {
  createUser,
  loginUser,
  getUser,
  getAllUsers,
  updateUser,
  uploadProfilePicture,
  getProfilePicture,
  getStats
}


