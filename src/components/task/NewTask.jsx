import React, { useState } from 'react';
import './styles.css';
const url = process.env.REACT_APP_API_URL || 'http://localhost:4000/'

export default function NewTask({
  setShowAddTask,
  setNotStartedList,
  notStartedList,
}) {
  const token = localStorage.getItem('JWT');
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        name: task.name,
        description: task.description,
        status: 'not-started',
      }),
    };

    fetch(`${url}/task`, options)
      .then((res) => res.json())
      .then((res) => {
        let addedTask = res.createdTask;

        addedTask.id = addedTask.id.toString();
        let notStartedCopy = [...notStartedList, addedTask];
        setNotStartedList(notStartedCopy);
        setShowAddTask(false);
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  };
  return (
    <form className='new-task-form' onSubmit={handleSubmit}>
      <p>New Task</p>
      <label>
        <p>Name</p>
        <input
          className='task-name'
          type='text'
          name='name'
          value={task.name}
          onChange={handleChange}
        />
      </label>
      <label>
        <p>Description</p>
        <input
          className='task-description'
          type='text'
          name='description'
          value={task.description}
          onChange={handleChange}
        />
      </label>
      <input className='add-task-submit' type='submit' value='Add Task' />
    </form>
  );
}
