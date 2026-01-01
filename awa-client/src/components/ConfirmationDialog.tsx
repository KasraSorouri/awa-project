import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmationDialogProps {
  askConfirm: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog = ({ askConfirm, title, message, onConfirm, onCancel }: ConfirmationDialogProps) => {

  return (
    <React.Fragment>
      <Dialog
        open={askConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} autoFocus>Cancel</Button>
          <Button onClick={onConfirm} > yes </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ConfirmationDialog;
