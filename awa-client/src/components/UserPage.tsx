

import UserFolder from './UserFolder';


interface IUserPageProps {
    token: string;
}
const UserPage = ({token}: IUserPageProps) => {
  return (
    <>
    <h1>UserPage</h1>
    {token &&<UserFolder token={token} />}
    </>
  )
}

export default UserPage