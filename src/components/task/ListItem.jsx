import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import EditTask from './EditTask';
import { ReactComponent as EditIcon } from '../../images/edit.svg';
import { ReactComponent as DeleteIcon } from '../../images/delete.svg';

export default function ListItem({
  id,
  name,
  description,
  index,
  handleDelete,
  handleEdit,
  editFlag,
  setEditFlag,
  handleLoadTasks
}) {
  return (
    <Draggable className='on-drag' key={id} draggableId={id} index={index} >
      {(provided) => (
        <div className='item-content'>
          <li
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {editFlag.taskId !== id && <div>
              <p>
                <strong>{name}</strong>
              </p>
              <p>{description}</p>
            <div className='nav-bar'>
              <EditIcon
                className='icons'
                onClick={(event) => handleEdit(event, id)}
                />
              <DeleteIcon className='icons' onClick={() => handleDelete(id)} />
            </div>
                </div>}
          </li>
          {editFlag.taskId === id && (
            <EditTask name={name} description={description} taskId={id} setEditFlag={setEditFlag} handleLoadTasks={handleLoadTasks}/>
          )}
        </div>
      )}
    </Draggable>
  );
}
