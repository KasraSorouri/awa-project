import { useEffect } from 'react';
import { Box, Button, colors, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import fileService from '../services/fileService';

import ShareIcon from '@mui/icons-material/Share';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

import ConfirmationDialog from './ConfirmationDialog';

import { IEditFileData, IFile } from '../types/folderTypes';
import { IConfirmation } from '../types/alertTypes';



interface ShowFileContentProps {
  activeFile: number;
  setActiveFile: (id: number | null) => void;
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
  handleShare: (id:number, name:string) => void;
  }


const ShowFileContent = ({ activeFile, setActiveFile, editMode, setEditMode, handleShare }: ShowFileContentProps) => {
  const [value, setValue] = useState<string>('');
  const [file, setFile] = useState<IFile|null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [confirm, setConfirm] = useState<IConfirmation>({
    askConfirm: false,
    title: '',
    message: '',
    confirm: () => {},
    cancel: () => {}
  });


  useEffect(() => {

    const readFileContent = async () => {
      try {
        const result = await fileService.readFile(activeFile);
        setValue(result.fileContent);
        setFile(result.file);
        setFileName(result.file.fileName);
        setRole(result.role);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error reading file:', error.message);
        }
        console.error('Unknown error reading file');
      }
    };

    readFileContent();
  }, [activeFile]);

  console.log('***** File content:', file);

  const handleSaveFile = async () => {
    try {
      if (file) {
        const fileData: IEditFileData = {
          id: file.id,
          fileName: fileName,
          fileContent: value
        }
        await fileService.saveFile(fileData);
        setEditMode(false);
        console.log('File content saved successfully');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error saving file:', error.message);
      }
      console.error('Unknown error saving file');
    }
  };

  const handleEditFile = () => {
    setEditMode(true);
  }; 

  const handleCloseFile = () => {
    if (editMode) {
      handleCancelEdit();
      return;
    }
    setActiveFile(null);
  };
  
  const handleCancelEdit = () => {
    setConfirm({
      askConfirm: true,
      title: 'Cancel edit',
      message: 'Are you sure you want to cancel editing?\nAll changes will be lost.',
      confirm: () => {
        setEditMode(false);
        setFileName(file?.fileName || '');
        setConfirm({...confirm, askConfirm: false});
        setActiveFile(null);
      },
      cancel: () => {
        setConfirm({...confirm, askConfirm: false});
      }
    });
  };

  const handleDownloadFile = async () => {
    if (file) {
      const result = await fileService.downloadFile(file.id);
      if (!result) {
        alert('Error downloading file');
        return;
      }
      const blob : Blob = new Blob([result.data], { type: 'application/pdf' });
      const url : string = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  return(
    <div className="show-content">
      <Paper elevation={3}
        sx={{
          padding: 0,
          marginTop: 0,
          backgroundColor: colors.grey[100],
          '& .ql-toolbar': {
            display: editMode ? 'block' : 'none',
            backgroundColor: '#f0f0f0', 
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
          },
          '& .ql-container': {
            borderBottomLeftRadius: '4px', 
            borderBottomRightRadius: '4px',
            backgroundColor: 'white', 
          },
          '& .ql-editor': {
            minHeight: '60vh',
            maxHeight: '70vh',
            overflowY: 'auto', 
          },
          '& .ql-snow .ql-stroke': {
            stroke: 'black',
          },
          '& .ql-snow .ql-fill': {
            fill: 'black',
          },
          '& .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke': {
            stroke: colors.blue[600],
          },
           '& .ql-snow .ql-active .ql-stroke': {
            stroke: colors.blue[600],
          },
        }}
      >  
        <Box display='flex' justifyContent='space-between' alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`}>
          <Stack direction={'row'} alignItems='center' spacing={1} sx={{padding: 1}}>
            {editMode ?
              <TextField
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                variant='outlined'
                size='small'
                sx={{ backgroundColor: 'white'}}
              />
              : <Typography variant="h6" sx={{padding: 1}}>{fileName}</Typography>
            }
          </Stack>
          <Stack direction={'row'} justifyContent={'right'} spacing={1} sx={{padding: 1}}>
          <Tooltip title='Edit'>
            <Button onClick={handleEditFile} disabled={editMode || role !== 'OWNER' && role !== 'EDITOR'}>
              <EditIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Save'>
            <Button onClick={handleSaveFile} disabled={!editMode}>
              <SaveIcon />
            </Button >
          </Tooltip>
          <Tooltip title='Share'>
            <Button onClick={() => handleShare(activeFile, fileName)} disabled={editMode}>
              <ShareIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Download'>
            <Button onClick={handleDownloadFile} disabled={editMode}>
              <FileDownloadIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Close'>
            <Button onClick={handleCloseFile}>
              <CloseIcon />
            </Button>
          </Tooltip> 
          </Stack>     
        </Box>
        <ReactQuill theme='snow' value={value} onChange={setValue} readOnly={!editMode} />
      </Paper>
      <ConfirmationDialog
        askConfirm={confirm.askConfirm}
        title={confirm.title}
        message={confirm.message}
        onConfirm={confirm.confirm}
        onCancel={confirm.cancel}
      />
    </div>
  )
}


export default ShowFileContent