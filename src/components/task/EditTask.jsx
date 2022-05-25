import React, { useState } from 'react';

export default function EditTask({
  name,
  description,
  taskId,
  setEditFlag,
  handleLoadTasks,
}) {
  const token = localStorage.getItem('JWT');
  const initialFormData = {
    name: name,
    description: description,
  };
  const [task, setTask] = useState(initialFormData);

  const handleSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: task.name,
        description: task.description,
      }),
    };

    fetch(`http://localhost:4000/task/${taskId}`, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        handleLoadTasks();
      });
    setEditFlag(false);
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { value, name } = event.target;

    setTask({
      ...task,
      [name]: value,
    });
  };

  return (
    <form className='edit-task-form' onSubmit={handleSubmit}>
      <p>
        <strong>Edit Task</strong>
      </p>
      <label>
        <input
          className='task-name'
          type='text'
          name='name'
          value={task.name}
          onChange={handleChange}
        />
      </label>
      <label>
        <input
          className='task-description'
          type='text'
          name='description'
          value={task.description}
          onChange={handleChange}
        />
      </label>
      <input className='task-submit' type='submit' />
    </form>
  );
}
