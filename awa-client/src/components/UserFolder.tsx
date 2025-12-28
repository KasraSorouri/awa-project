import { useState, useEffect } from "react";

import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import ShowFolder from "./ShowFolder";
import folderService from '../services/folderservice';


interface FolderProps {
    token: string;
}

interface IFile {
  id: number,
  fileName: string,
  folderId: number,
  content: string,
  deleted: boolean,
  activated: boolean,
  currentUser: number,
  createdAt: string,
  updatedAt: string
}

interface IFolder {
  id: number,
  folderName: string,
  userId: number,
  subFolders: IFolder[],
  Filse: IFile[],
}


const UserFolder = ({token}: FolderProps) => {
  const [folders, setFolders] = useState<IFolder[]>([])
  const [activeFolder, setActiveFolder] = useState<number | null>(null)

  useEffect(() => {
    const getFolders = async() => {
      try{
        const result = await folderService.getUserFolders(token)
        if (result) {
          setFolders(result)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (token) {
      getFolders()
    }
   },[token])

  console.log('folders : ', folders)
  console.log('activefolder : ', activeFolder)

  const handleAddFolder = () => {
    console.log('add folder')
  }

  const handleAddFile = () => {
    console.log('add file')
  }

  const handleUploadFile = () => {
    console.log('upload file')
  }

  if (!token){
     return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
      }}
      >
      <Typography variant="h5" align="left" color="#4D4D4D">Please login to see your folders</Typography>
    </Box>
 )}

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
      }}
      >
      <Stack direction={'row'} spacing={1}>
        <Tooltip title='Add new Folder' >
          <Button id='addFolder'  variant='contained' size='small' sx={{ width: '10px'}} onClick={()=>handleAddFolder} ><CreateNewFolderIcon /></Button>
        </Tooltip>
        <Tooltip title='Add new File' >
          <Button id='addFile'  variant='contained' size='small' sx={{ width: '10px'}} onClick={()=>handleAddFile} ><NoteAddIcon /></Button>
        </Tooltip>
        <Tooltip title='Upload a File' >
          <Button id='uploadFile'  variant='contained' size='small' sx={{ width: '10px'}} onClick={()=>handleUploadFile} ><CloudUploadIcon /></Button>
        </Tooltip> 
      </Stack>
      <Box onClick={() => setActiveFolder(null)}>
        <Stack direction={'row'} >
          <HomeIcon fontSize="large" sx={{color: "#4D4D4D", marginRight:'3px'}} />
          <Typography variant="h5" align="left" color="#4D4D4D">My Drive /</Typography>
        </Stack>
      </Box>
      <ShowFolder folders={folders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} />
      
    </Box>
  )
}

export default UserFolder;