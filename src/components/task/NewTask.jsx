import React, { useState } from 'react';
import './styles.css'

export default function NewTask({setShowAddTask, setNotStartedList}) {
  const token = localStorage.getItem('JWT')
  const initialFormData = {
    name: '',
    description: '',
  };
  const [task, setTask] = useState(initialFormData);


  const handleChange = (event) => {
    event.preventDefault();
    const { value, name } = event.target;

    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        name: task.name,
        description: task.description,
        status: 'not-started',
      }),
    };

    fetch('http://localhost:4000/task', options)
      .then(res => res.json())
      .then(res => {
        console.log('response:', res)
        setShowAddTask(false)
      })
      .catch((err) => {
        console.log('Error:', err);
      });
      
  };
  return (
    <form className='new-task-form' onSubmit={handleSubmit}>
      <label>
        <p>Name</p>
        <input className='task-name' type='text' name='name' value={task.name} onChange={handleChange} />
      </label>
      <label>
        <p>Description</p>
        <input className='task-description' type='text' name='description' value={task.description} onChange={handleChange} />
      </label>
      <input className='task-submit' type='submit' />
    </form>
  );
}
