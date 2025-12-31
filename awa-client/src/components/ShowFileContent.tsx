import { colors, Paper } from '@mui/material';
import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';






const ShowFileContent = () => {
  const [value, setValue] = useState('');

  return(
    <div className="show-content">
      <h1> File Content</h1>
      <Paper elevation={3}
        sx={{
          padding: 0,
          marginTop: 0,
          backgroundColor: colors.grey[100],
          '& .ql-toolbar': {
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
        <ReactQuill theme='snow' value={value} onChange={setValue} />
      </Paper>
    </div>
  )
}


export default ShowFileContent