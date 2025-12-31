import { useState } from 'react';

import UserFolder from './UserFolder';

import { IFolder } from '../types/folderTypes';
import { Grid } from '@mui/material';
import ShowContent from './ShowContent';


interface IUserPageProps {
    folders: IFolder[];
}
const UserPage = ({folders}: IUserPageProps) => {
  const [activeFolder, setActiveFolder] = useState<number | null>(null)
  return (
    <>
    <h1>UserPage</h1>
    <Grid container spacing={1} margin={1}>
      <Grid size={{  sm: 0, md: 0, lg: 3 }} display={{ xs: 'none', sm: 'none', md: 'none', lg: 'block' }} border={'solid'} borderColor={'#4d4d4d'} borderRadius={5} padding={3}>
        <UserFolder folders={folders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} />
      </Grid>
      <Grid size={{ sm: 12, md: 12, lg: 9 }} border={'solid'} borderColor={'#4d4d4d'} borderRadius={5} padding={3}>
        <ShowContent folders={folders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} />
      </Grid>
    </Grid>
    
    </>
  )
}

export default UserPage