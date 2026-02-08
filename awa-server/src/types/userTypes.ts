export interface IUser {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserUpdateData {
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}