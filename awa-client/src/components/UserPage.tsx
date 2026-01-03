import { useState } from 'react';

import UserFolder from './UserFolder';

import { IFolderTree } from '../types/folderTypes';
import { Grid } from '@mui/material';
import ShowContent from './ShowContent';
import ShowAlert from './ShowAlert';
import { IAlert } from '../types/alertTypes';

interface IUserPageProps {
  folders: IFolderTree[];
}


const UserPage = ({folders}: IUserPageProps) => {
  const [activeFolder, setActiveFolder] = useState<number>(0)
  const [activeFile, setActiveFile] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false)
  const [alertData, setAlertData] = useState<IAlert>({
    type: 'info',
    message: '',
    showAlert: false
  });

  




  return (
    <>
    <ShowAlert type={alertData.type} message={alertData.message} showAlert={alertData.showAlert} setAlertData={setAlertData} />
    <h1>UserPage</h1>
    <Grid container spacing={1} margin={1} >
      <Grid size={{  sm: 0, md: 0, lg: 3  }} display={{ xs: 'none', sm: 'none', md: 'none', lg: editMode ? 'none' : 'block' }} border={'solid'} borderColor={'#4d4d4d'} borderRadius={5} padding={3}>
        <UserFolder folders={folders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} setActiveFile={setActiveFile} setEditMode={setEditMode} setAlertData={setAlertData} />
      </Grid>
      <Grid size={{ sm: 12, md: 12, lg: editMode ? 12 : 9 }} border={'solid'} borderColor={'#4d4d4d'} borderRadius={5} padding={3}>
        <ShowContent folders={folders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} activeFile={activeFile} setActiveFile={setActiveFile} editMode={editMode} setEditMode={setEditMode} setAlertData={setAlertData} />
      </Grid>
    </Grid>
    
    </>
  )
}

export default UserPage