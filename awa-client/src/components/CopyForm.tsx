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



interface ICopyFormProps {
  copyItem: number | null;
  activeFolderId?: number;
  setAlertData: (alert: {type: 'success' | 'error', message: string, showAlert: boolean}) => void;
  setOpenCopyForm: (open: boolean) => void;
  handleCopySubmit: (selectedFolder: number) => void;
}

interface IFolder {
  id: number;
  folderName: string;
  parentFolderId: number | null;
  subFolders?: IFolder[];
}

const CopyForm = ({copyItem, activeFolderId, setAlertData, setOpenCopyForm, handleCopySubmit}: ICopyFormProps) => {


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
        console.log('*** CopyForm - fetched folders:', response)
        setFolderList([{id: 0, folderName: 'My Drive',parentFolderId: null},...response])
      } catch (error) {
        console.error('Error fetching folders:', error)
        setAlertData({type: 'error', message: 'Error fetching folders', showAlert: true})
      }
    }
    fetchFolders()
  }, [])

  console.log('** CopyForm - copyItem:', copyItem)
  console.log('*** CopyForm - folderList:', folderList)
  console.log('*** CopyForm - active folder:', activeFolderId)

  const handleFolderChange = (event: SelectChangeEvent<number>) => {
    setSelectedFolder(event.target.value)
  };

  return (
    <>
      <DialogTitle>Copy File</DialogTitle>
      <DialogContent>
        <Box sx={{ width: 'auto', margin: 2, padding: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="select-folder-label">Select Folder</InputLabel>
            <Select
              labelId="select-folder-label"
              id="select-folder"
              value={selectedFolder}
              label="Select Folder"
              fullWidth
              onChange={handleFolderChange}
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
        <Button onClick={() => handleCopySubmit(Number(selectedFolder))}>Copy</Button>
        <Button onClick={() => setOpenCopyForm(false)}>Cancel</Button>
      </DialogActions>
    </>
  )
}

export default CopyForm