

import UserFolder from './UserFolder';

import { IFolder } from '../types/folderTypes';


interface IUserPageProps {
    folders: IFolder[];
}
const UserPage = ({folders}: IUserPageProps) => {
  return (
    <>
    <h1>UserPage</h1>
    <UserFolder folders={folders} />
    </>
  )
}

export default UserPage