import { useEffect } from 'react';
import { Box, Button, colors, Paper, Stack, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
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
import { IAlert, IConfirmation } from '../types/alertTypes';



interface ShowFileContentProps {
  activeFile: number;
  setActiveFile: (id: number | null) => void;
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
  handleShare: (id:number, name:string) => void;
  downloadFile: (id: number, fileName: string, fileType: string) => void;
  setAlertData: (alert: IAlert) => void;
  }


const ShowFileContent = ({ activeFile, setActiveFile, editMode, setEditMode, handleShare, downloadFile, setAlertData }: ShowFileContentProps) => {
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


  // Check Screen Size
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


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

          if (error.message.startsWith('The file is opened by')) {
            setAlertData({type: 'error', message: error.message, showAlert: true});
          } else {
            console.error('Error reading file:', error.message);
          }
        }
        setActiveFile(null)
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

  const handleCloseFile = async () => {
    if (editMode) {
      handleCancelEdit();
      return;
    }
    try { 
      console.log('close file')
      await fileService.closeFile(activeFile)
    } catch(err: unknown) {
      console.log(err)
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
            padding: isMobile ? '2px' : '8px', 
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            overflowX: isMobile ? '0' : 'unset',
          },
          '& .ql-toolbar button': {
      padding: isMobile ? '3px' : '3px',
      width: isMobile ? '24px !important' : '28px',
          },
          '& .ql-toolbar .ql-picker': {
      marginRight: isMobile ? '2px !important' : '4px',
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
        <Box display='flex' alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`}>
          <Stack direction={ isMobile ? 'column' : 'row'} alignItems={ isMobile ? 'flex-start' : 'center' } spacing={1} sx={{padding: 1, width: '100%'}} >
            <Box sx={{ flexGrow: 1, width: isMobile ? '100%' : 'auto' }}>
            {editMode ?
              <TextField
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                variant='outlined'
                size='small'
                sx={{ backgroundColor: 'white'}}
              />
              : <Typography variant="h6" sx={{padding: 1, textAlign: isMobile ? 'center' : 'left'}}>{fileName}</Typography>
            }
            </Box>
          <Stack direction={'row'} justifyContent={isMobile ? 'flex-start' : 'flex-end'} spacing={ isMobile? 0 : 1} sx={{padding: 1}}>
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
            <Button onClick={() => downloadFile(activeFile, fileName, 'document')} disabled={editMode}>
              <FileDownloadIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Close'>
            <Button onClick={handleCloseFile}>
              <CloseIcon />
            </Button>
          </Tooltip> 
          </Stack> 
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