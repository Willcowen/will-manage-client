import React, { useState } from 'react'
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button';
import './styles.css';
import {Link } from 'react-router-dom'
export default function Register() {

  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const [user, setUser] = useState(initialFormData);
  // const [registerResponse, setRegisterResponse] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: 'POST', 
      headers : {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password
      })
    }

    fetch('http://localhost:4000/user', options)
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log("Person created", json)
    })
      .catch((err) => {
        console.log('Error:', err);
      });
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { value, name } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  console.log('USER:', user)
  return (
    <form className='user-form' onSubmit={handleSubmit}>
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
      />
      <TextField
        className='user-form-input'
        label='Last Name'
        variant='outlined'
        name='lastName'
        value={user.lastName}
        onChange={handleChange}
        size='small'
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
      />
      <Button id='user-submit-button' type='submit' variant='contained'>
        Submit
      </Button>
      <Link to='/' style={{ textDecoration: 'none', fontFamily: 'Space Grotesk' }}>
      Already Registered? Click here to login!
      </Link>
      </div>
    </form>
  );
}
