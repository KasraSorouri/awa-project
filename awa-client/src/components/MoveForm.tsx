import { useEffect, useState } from "react"

import { 
  Button, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Box
} from "@mui/material"

import folderService from "../services/folderService"

interface IItem {
  itemId: number;
  type: 'file' | 'folder';
}

interface IMoveFormProps {
  moveItem: IItem | null;
  activeFolderId?: number;
  setAlertData: (alert: {type: 'success' | 'error', message: string, showAlert: boolean}) => void;
  setOpenMoveForm: (open: boolean) => void;
  handleMoveSubmit: (selectedFolder: number) => void;
}

interface IFolder {
  id: number;
  folderName: string;
  parentFolderId: number | null;
  subFolders?: IFolder[];
}

const MoveForm = ({moveItem, activeFolderId, setAlertData, setOpenMoveForm, handleMoveSubmit}: IMoveFormProps) => {


  const [folderList, setFolderList] = useState<IFolder[]>([{
    folderName: 'My Drive',
    id: 0,
    parentFolderId: null,
  }])
  const [selectedFolder, setSelectedFolder] = useState<number>(0)

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await folderService.getUserFolderList()
        console.log('*** MoveForm - fetched folders:', response)
        setFolderList([{id: 0, folderName: 'My Drive',parentFolderId: null},...response].filter(folder => folder.id !== activeFolderId &&  moveItem?.type === 'folder' ? folder.id !== moveItem?.itemId : true))
      } catch (error) {
        console.error('Error fetching folders:', error)
        setAlertData({type: 'error', message: 'Error fetching folders', showAlert: true})
      }
    }
    fetchFolders()
  }, [])

  const handleFolderChange = (event: SelectChangeEvent<number>) => {
    setSelectedFolder(event.target.value)
  };

  return (
    <>
      <DialogTitle>Move {moveItem?.type === 'file' ? 'File' : 'Folder'}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: 'auto', margin: 2, padding: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="select-folder-label">Select Folder</InputLabel>
          <Select
            labelId="select-folder-label"
            id="select-folder"
            value={selectedFolder}
            label="Select Folder"
            onChange={handleFolderChange}
            fullWidth
          >
            {folderList.map((folder) => (
              <MenuItem key={folder.id} value={folder.id}>
                {folder.folderName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleMoveSubmit(Number(selectedFolder))}>Move</Button>
        <Button onClick={() => setOpenMoveForm(false)}>Cancel</Button>
      </DialogActions>
    </>
  )
}

export default MoveForm