import {
  Box,
  Button,
  Stack, 
  Tooltip,
} from "@mui/material";

import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ShowFolder from './ShowFolder';
import { IFolderTree } from '../types/folderTypes';
import { IAlert } from "../types/alertTypes";


interface FolderProps {
    folders: IFolderTree[];
    activeFolder: number;
    setActiveFolder: (id: number) => void;
    setActiveFile: (id: number | null) => void;
    setEditMode: (edit: boolean) => void;
    setAlertData: (data:IAlert) => void;
    handleAddFolder: () => void;
    handleAddFile: () => void;
    handleUploadFile: () => void;

}

const UserFolder = ({folders, activeFolder, setActiveFolder, setActiveFile, handleAddFile, handleAddFolder, handleUploadFile}: FolderProps) => {

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
          <Button id='addFolder'  variant='contained' size='small' sx={{ width: '10px'}} onClick={handleAddFolder} ><CreateNewFolderIcon /></Button>
        </Tooltip>
        <Tooltip title='Add new File' >
          <Button id='addFile'  variant='contained' size='small' sx={{ width: '10px'}} onClick={handleAddFile} ><NoteAddIcon /></Button>
        </Tooltip>
        <Tooltip title='Upload a File' >
          <Button id='uploadFile'  variant='contained' size='small' sx={{ width: '10px'}} onClick={handleUploadFile} ><CloudUploadIcon /></Button>
        </Tooltip> 
      </Stack>
      <ShowFolder folders={folders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} setActiveFile={setActiveFile} />
    </Box>
  )
}

export default UserFolder;