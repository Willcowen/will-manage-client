import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './styles.css';
import { ReactComponent as EditIcon } from '../../images/edit.svg';
import { ReactComponent as DeleteIcon } from '../../images/delete.svg';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import NewTask from './NewTask';
import Header from '../header/header'

export default function TaskBoard() {
  const [notStartedList, setNotStartedList] = useState([]);
  const [inProgressList, setInProgressList] = useState([]);
  const [awaitingReviewList, setAwaitingReviewList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false)
  const token = localStorage.getItem('JWT');
  console.log('token:', token);

  const handleLoadTasks = () => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    fetch('http://localhost:4000/task', options)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        console.log('tasks returned from database!', json);
        json.tasks.forEach(function(task) {
          task.id = task.id.toString();
          if (task.status === 'not-started') {
            notStartedList.push(task);
          }
          if (task.status === 'in-progress') {
            inProgressList.push(task);
          }
          if (task.status === 'awaiting-review') {
            awaitingReviewList.push(task);
          }
          if (task.status === 'done') {
            let doneListCopy = [...doneList];
            doneListCopy.push(task);
            setDoneList(doneListCopy);
          }
        });
        setDataLoaded(true);
        console.log('doneList', doneList);
      });
  };

  useEffect(() => {
    handleLoadTasks();
  }, []);

  function getStateForList(list) {
    if (list === 'not-started') return [notStartedList, setNotStartedList];
    if (list === 'in-progress') return [inProgressList, setInProgressList];
    if (list === 'awaiting-review')
      return [awaitingReviewList, setAwaitingReviewList];
    if (list === 'done') return [doneList, setDoneList];
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const [source, setSource] = getStateForList(result.source.droppableId);
    const [destination, setDestination] = getStateForList(
      result.destination.droppableId
    );

    if (result.destination.droppableId !== result.source.droppableId) {
      let sourceCopy = source.filter((item) => item.id !== result.draggableId);
      const reorderedItem = source.find(
        (item) => item.id === result.draggableId
      );
      reorderedItem.status = result.destination.droppableId;
      reorderedItem.index = result.destination.index;
      setSource(sourceCopy);
      let destinationCopy = [...destination];
      destinationCopy.splice(result.destination.index, 0, reorderedItem);
      setDestination(destinationCopy);
    } else {
      let sourceCopy = [...source];
      const [reorderedItem] = sourceCopy.splice(result.source.index, 1);
      reorderedItem.index = result.destination.index;
      sourceCopy.splice(result.destination.index, 0, reorderedItem);
      setSource(sourceCopy);
    }
  }

  const handleCreateForm = () => {
    setShowAddTask(true)
  };

  return (
    <div className='board'>
      {dataLoaded && (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className='column'>
            <Droppable droppableId='not-started'>
              {(provided) => (
                <ul
                  className='not-started'
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className='column-head'>
                    <h2 className='title'>Not Started</h2>
                  </div>
                  {notStartedList.map(({ id, name, description }, index) => {
                    return (
                      <Draggable
                        className='on-drag'
                        key={id}
                        draggableId={id}
                        index={index}
                      >
                        {(provided) => (
                          <div className='item-content'>
                            <li
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <p>
                                <strong>{name}</strong>
                              </p>
                              <p>{description}</p>
                              <div className='nav-bar'>
                                <EditIcon className='icons' />
                                <DeleteIcon className='icons' />
                              </div>
                            </li>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
            <div className="add-task">
              {!showAddTask && <div className='add-new' onClick={handleCreateForm}>
                <p>
                  Add new..
                </p>
                <AddIcon className='add-icon' />
              </div>}
              {showAddTask && <NewTask setShowAddTask={setShowAddTask} setNotStartedList={setNotStartedList} />}
            </div>
          </div>
          <div className='column'>
            <Droppable droppableId='in-progress'>
              {(provided) => (
                <ul
                  className='in-progress'
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className='column-head'>
                    <h2 className='title'>In Progress</h2>
                  </div>
                  {inProgressList.map(({ id, name, description }, index) => {
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided) => (
                          <div className='item-content'>
                            <li
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <p>
                                <strong>{name}</strong>
                              </p>
                              <p>{description}</p>
                              <div className='nav-bar'>
                                <EditIcon className='icons' />
                                <DeleteIcon className='icons' />
                              </div>
                            </li>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
          <div className='column'>
            <Droppable droppableId='awaiting-review'>
              {(provided) => (
                <ul
                  className='awaiting-review'
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className='column-head'>
                    <h2 className='title'>Awaiting Review</h2>
                  </div>
                  {awaitingReviewList.map(
                    ({ id, name, description }, index) => {
                      return (
                        <Draggable key={id} draggableId={id} index={index}>
                          {(provided) => (
                            <div className='item-content'>
                              <li
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                <p>
                                  <strong>{name}</strong>
                                </p>
                                <p>{description}</p>
                                <div className='nav-bar'>
                                  <EditIcon className='icons' />
                                  <DeleteIcon className='icons' />
                                </div>
                              </li>
                            </div>
                          )}
                        </Draggable>
                      );
                    }
                  )}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
          <div className='column'>
            <Droppable droppableId='done'>
              {(provided) => (
                <ul
                  className='done'
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className='column-head'>
                    <h2 className='title'>Done</h2>
                  </div>
                  {doneList.map(({ id, name, description }, index) => {
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided) => (
                          <div className='item-content'>
                            <li
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <p>
                                <strong>{name}</strong>
                              </p>
                              <p>{description}</p>
                              <div className='nav-bar'>
                                <EditIcon className='icons' />
                                <DeleteIcon className='icons' />
                              </div>
                            </li>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
