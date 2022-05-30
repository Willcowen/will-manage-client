import React, { useState } from 'react';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button';
import './styles.css';
import { useNavigate, Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../header/mylogo.svg';
const url = process.env.REACT_APP_API_URL || 'http://localhost:4000/'
export default function Register() {
  const navigate = useNavigate();
  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const [user, setUser] = useState(initialFormData);
 
  const handleSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      }),
    };

    fetch(`${url}/user`, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        console.log('Person created', json);
      })
      .catch((err) => {
        console.log('Error:', err);
      });
      navigate('/')
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { value, name } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  console.log('USER:', user);
  return (
    <form className='user-form' onSubmit={handleSubmit}>
      <div className='top-of-registration'>
        <h1 className='title'>will manage</h1>
        <div className='logo'>
          <Logo height='60' width='60' />
        </div>
      </div>
      <div className='register'>
        <h2>Register</h2>
        <TextField
          className='user-form-input'
          label='First Name'
          variant='outlined'
          name='firstName'
          value={user.firstName}
          onChange={handleChange}
          size='small'
          InputLabelProps={{style: {fontSize: 13}}}
        />
        <TextField
          className='user-form-input'
          label='Last Name'
          variant='outlined'
          name='lastName'
          value={user.lastName}
          onChange={handleChange}
          size='small'
          InputLabelProps={{style: {fontSize: 13}}}
        />
        <TextField
          className='user-form-input'
          type='email'
          label='Email'
          variant='outlined'
          name='email'
          value={user.email}
          onChange={handleChange}
          size='small'
          InputLabelProps={{style: {fontSize: 13}}}
        />
        <TextField
          className='user-form-input'
          type='password'
          label='Password'
          variant='outlined'
          name='password'
          value={user.password}
          onChange={handleChange}
          size='small'
          InputLabelProps={{style: {fontSize: 13}}}
        />
        <Button id='user-submit-button' type='submit' variant='contained' >
          Register
        </Button>
        <Link
          to='/'
          style={{
            textDecoration: 'none',
            fontFamily: 'Space Grotesk',
            fontSize: '12px',
          }}
        >
          <p>Already Registered? Click here to login!</p>
        </Link>
      </div>
    </form>
  );
}
