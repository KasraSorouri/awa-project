import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { IAlert } from '../types/alertTypes';


interface IShowAlertProps extends IAlert {
  setAlertData: (alert: IAlert) => void;
}

const ShowAlert = ({type, message, showAlert, setAlertData}:IShowAlertProps) => {
  
  if (showAlert) {
    setTimeout(() => {
      setAlertData({ type: 'info', message: '', showAlert: false });
    }, type === 'error' ? 10000 : 5000);
  } else {
    return null;
  }

  return (
    <Stack justifyContent={'center'} alignItems={'center'} sx={{ width: '50%' }} spacing={2}>
      <Collapse in={showAlert}>
        <Alert
          severity={type}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlertData({ type: 'info', message: '', showAlert: false });
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Collapse>
    </Stack>
  );
}

export default ShowAlert;


