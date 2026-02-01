import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import ReactQuill from "react-quill-new";
import { Paper, colors, Box, Stack, Typography } from "@mui/material";

import { IFile } from "../types/folderTypes";
import shareService from "../services/shareService";


const ShowExternalShare = () => {

  const [value, setValue] = useState<string>('');
  const [file, setFile] = useState<IFile|null>(null);
  const [fileName, setFileName] = useState<string>('');
  const link = useLocation().pathname.split('/')[2];
  console.log('link:', link);
  console.log('file:', file);

  useEffect(() => {
    const readFileContent = async () => {
      try {
        const result = await shareService.getSharedFile(link);
        setValue(result.fileContent);
        setFile(result.file);
        setFileName(result.file.fileName);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error reading file:', error.message);
        }
        console.error('Unknown error reading file');
      }
    };

    readFileContent();
  }, []);

  return(
    <div className="show-content">
      <Paper elevation={3}
        sx={{
          padding: 0,
          marginTop: 0,
          backgroundColor: colors.grey[100],
          '& .ql-toolbar': {
            //display:  editMode? 'block' : 'none',
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
            <Typography variant="h6" sx={{padding: 1}}>{fileName}</Typography>
          </Stack>{/*
          <Stack direction={'row'} justifyContent={'right'} spacing={1} sx={{padding: 1}}>
          <Tooltip title='Edit'>
            <Button onClick={handleEditFile} disabled={editMode}>
              <EditIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Save'>
            <Button onClick={handleSaveFile} disabled={!editMode}>
              <SaveIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Share'>
            <Button>
              <ShareIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Download'>
            <Button>
              <FileDownloadIcon />
            </Button>
          </Tooltip>*
          <Tooltip title='Close'>
            <Button onClick={handleCancelEdit} disabled={!editMode}>
              <CloseIcon />
            </Button>
          </Tooltip> 
          </Stack>  */}   
        </Box>
        <ReactQuill theme='snow' value={value} onChange={setValue} readOnly={true} />
      </Paper>
    </div>
  )
}



export default ShowExternalShare