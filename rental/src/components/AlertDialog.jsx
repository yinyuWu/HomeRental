import React from 'react';
import { makeStyles } from '@mui/styles';
import { Alert, AlertTitle, Box, Dialog, DialogContent, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';

const useStyles = makeStyles({
  content: {
    padding: 0
  }
})

function AlertDialog(props) {
  const { open, onClose, text } = props;
  const classes = useStyles();

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent className={classes.content}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {text}
          </Alert>
        </DialogContent>
      </Dialog>
    </div>
  )
}


export default AlertDialog;
