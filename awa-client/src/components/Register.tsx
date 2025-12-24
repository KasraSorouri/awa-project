import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, FormControl, TextField, Typography } from '@mui/material'
import registerService from '../services/registerService'

interface IUserData {
  username: string,
  password: string,
  firstName?: string,
  lastName?: string,
  email?: string,
}

const Register = () => {

  const initFormData : IUserData = {
    username: '',
    password: '',
    firstName: undefined,
    lastName: undefined,
    email: undefined,
  }
  const [formData, setFormData] = useState<IUserData>(initFormData)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await registerService(formData)
    if (result) {
      setFormData(initFormData)
    }
    console.log(result)
  }


  return(
    <FormControl>
      <Box  
        component='form' 
        marginTop={5}
        gap={2}
        display={'flex'} 
        justifyContent={'center'}
        alignContent={'center'}
        flexDirection={'column'}
        bgcolor={'whitesmoke'}
        borderRadius={5}
        padding={5}
        onSubmit={handleRegister}
        >
       <TextField 
        id='username'
        name='username'
        label='Username'
        variant='outlined'
        placeholder='Username'
        value={formData.username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
        required
      />
      <TextField
        id='password'
        name='password'
        label='Password'
        variant='outlined'
        placeholder='Password'
        value={formData.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
        required
      />
      <TextField
        id='firstName'
        name='firstName'
        label='First Name'
        variant='outlined'
        placeholder='First Name'
        value={formData.firstName || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
        />
      <TextField
        id='lastName'
        name='lastName'
        label='Last Name'
        variant='outlined'
        placeholder='Last Name'
        value={formData.lastName || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
        />
      <TextField
        id='email'
        name='email'
        label='Email'
        variant='outlined'
        placeholder='Email'
        value={formData.email || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
        />
        <Button 
          id='register'
          name='register'
          variant='contained'
          color='primary'
          type='submit'
          > Register
        </Button>
        <Typography variant='body2' color='error'>
          If you already have an account, please <Link to='/login'>login</Link>
        </Typography>
        </Box>
    </FormControl>
  )

}

export default Register