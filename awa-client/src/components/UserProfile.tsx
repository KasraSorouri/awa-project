import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Avatar, Button } from "@mui/material";
import userService from "../services/userService";

interface IUserData {
  user_id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  picture?: string;
}

interface IUserProfileProps {
  userData: IUserData;
  setUser: (userData: IUserData) => void;
}


const UserProfile = ({userData, setUser}: IUserProfileProps) => {
 const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(true);
  const [userDataState, setUserDataState] = useState<IUserData>(userData);
  const [pictureUrl, setPictureUrl] = useState<string>('');

  useEffect(() => {
    const getProfilePicture = async () => {
      if (userDataState.picture) {
        try {
          const profilePic = await userService.getProfilePicture();
          const url = URL.createObjectURL(profilePic);
          setPictureUrl(url);
        } catch (error) {
          console.log('Error fetching profile picture:', error);
        }
      }
    };
    getProfilePicture();
    return () => {
      if (pictureUrl) {
        URL.revokeObjectURL(pictureUrl);
      }
    };
  }, [userDataState.picture]);

  
  const uploadpicture = async(pictureFile: File) => {
    try {
      if (pictureFile) {
        const response = await userService.uploadProfilePicture({ pictureFile });
        if (response) {
          setUserDataState(prevState => ({
            ...prevState,
            picture: response.picture
          }));
        }
      } else {
        console.log('No picture file selected');
      }
    } catch (error) {
      console.log(error);
    } 
  };

  
  const updateUserData = async () => {
    try {
      const response = await userService.updateUserData(userDataState);
      if (response) {
        setUser(response);
        setOpen(false);
        navigate('/');
      } 
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputChange = (field: keyof IUserData, value: string) => {
    setUserDataState(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/')
  }

  return (
    <Dialog open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
          User Profile
      </DialogTitle>
      <DialogContent>
          <form>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12 }} container direction="row" alignItems="center" spacing={2} justifyContent="center">
                {userDataState.picture ? (
                  <Avatar alt="Profile Picture" src={pictureUrl} sx={{ width: 156, height: 156 }} />
                ) : (
                  <Avatar alt="Default Profile Picture"  >
                    { userDataState.firstName || userDataState.lastName ? `${userDataState.firstName?.charAt(0).toUpperCase() || ''}${userDataState.lastName?.charAt(0).toUpperCase() || ''}` : userDataState.username.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <Button
                  component="label"
                  variant="contained"
                  sx={{ marginTop: '25px'}}
                >
                  Upload New Picture
                  <input
                    type="file"
                    hidden 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadpicture(file);
                      }
                      e.target.value = ''; 
                    }}
                  />
                </Button>   
              </Grid>
              <Grid size={{ xs: 12 }} container direction="column" spacing={2}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={userDataState.username || ''}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required />
                <TextField
                  label="First Name"
                  value={userDataState.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
                <TextField
                  label="Last Name"
                  value={userDataState.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={userDataState.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" style={{ marginTop: '16px' }} onClick={() => updateUserData()}> 
              Save Changes
            </Button>
            <Button variant="contained" color="primary" style={{ marginTop: '16px', marginLeft: '5px' }} onClick={handleClose}>
              Cancel
            </Button>
          </form>
      </DialogContent>
    </Dialog> 
  );
};

export default UserProfile;