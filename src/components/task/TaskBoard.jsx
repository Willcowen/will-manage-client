import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './styles.css';
import { ReactComponent as EditIcon } from '../../images/edit.svg';
import { ReactComponent as DeleteIcon } from '../../images/delete.svg';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import NewTask from './NewTask';
import Header from '../header/header';

export default function TaskBoard() {
  const [notStartedList, setNotStartedList] = useState([]);
  const [inProgressList, setInProgressList] = useState([]);
  const [awaitingReviewList, setAwaitingReviewList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
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
        const mappedTasks = json.tasks.map(function(task) {
          task.id = task.id.toString()
          return task
        });
        console.log(mappedTasks)
        const notStarted = mappedTasks.filter(task => task.status === 'not-started')
        setNotStartedList(notStarted)
        const inProgress = mappedTasks.filter(task => task.status === 'in-progress')
        setInProgressList(inProgress)
        const awaitingReview = mappedTasks.filter(task => task.status === 'awaiting-review')
        setAwaitingReviewList(awaitingReview)
        const done = mappedTasks.filter(task => task.status === 'done')
        setDoneList(done)
        setDataLoaded(true);
        console.log('doneList', doneList);
      });
  };

  useEffect(() => {
    handleLoadTasks();
  }, []);

  const getStateForList = (list) => {
    if (list === 'not-started') return [notStartedList, setNotStartedList];
    if (list === 'in-progress') return [inProgressList, setInProgressList];
    if (list === 'awaiting-review')
      return [awaitingReviewList, setAwaitingReviewList];
    if (list === 'done') return [doneList, setDoneList];
  }

  const handleOnDragEnd = (result) => {
    const patchArr = []
    console.log('result:', result)
    if (!result.destination) return;
    const [source, setSource] = getStateForList(result.source.droppableId);
    const [destination, setDestination] = getStateForList(
      result.destination.droppableId
    );
    let sourceArr;
    let destinationArr;
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
      destinationArr = destinationCopy
      sourceArr = sourceCopy
      console.log('destinationArr:', destinationArr)
      for (let i = 0; i < destinationArr.length; i++) {
        const task = destinationArr[i]
        if (task.index !== i) {
          task.index = i
        }
      }
      destinationArr.forEach(function(element){
        return patchArr.push(element)
      })
    } else {
      let sourceCopy = [...source];
      const [reorderedItem] = sourceCopy.splice(result.source.index, 1);
      reorderedItem.index = result.destination.index;
      sourceCopy.splice(result.destination.index, 0, reorderedItem);
      setSource(sourceCopy);
      sourceArr = sourceCopy
    }
    console.log('sourceArr:', sourceArr)
    
    for (let i = 0; i < sourceArr.length; i++) {
      const task = sourceArr[i]
      if (task.index !== i) {
        task.index = i
      }
    }
    console.log('destinationArr after loop:', destinationArr)
    console.log('sourceArr after loop:', sourceArr)
    //check if the item's index in the array is the same as the index key.

    // handleMove(result)
    sourceArr.forEach(function(element){
      return patchArr.push(element)
    })
    handleMoveTwo(patchArr)
  }

  const handleMoveTwo = (patchArr) => {
    console.log('arr for patch request:', patchArr)
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/json'
      },
      body: JSON.stringify(
        patchArr
      )
    };

    fetch(`http://localhost:4000/tasks`, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        console.log('task updated:', json)
      });
  }

  const handleCreateForm = () => {
    setShowAddTask(true);
  };

  const handleDelete = (taskId) => {
    console.log('inside delete, task:', taskId);

    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    fetch(`http://localhost:4000/task/${taskId}`, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        console.log('Task deleted', json);
        const list = json.taskToDelete[0].status;
        console.log('task status', json.taskToDelete[0].status);
        const [listState, setListState] = getStateForList(list);
        let listCopy = [...listState];
        const foundTaskIndex = listCopy.findIndex((task) => task.id === taskId);
        listCopy.splice(foundTaskIndex, 1);
        setListState(listCopy);
        console.log('foundTaskIndex', foundTaskIndex);
      });
  };

  return (
    <div>
      <Header />
      <div className='board'>
        {dataLoaded && (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <div className='column'>
              <div className='column-head'>
                <h2 className='title'>Not Started</h2>
              </div>
              <Droppable droppableId='not-started'>
                {(provided) => (
                  <ul
                    className='not-started'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    isdragging={console.log(provided)}
                  >
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
                                  <DeleteIcon
                                    className='icons'
                                    onClick={() => handleDelete(id)}
                                  />
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
              <div className='add-task'>
                {!showAddTask && (
                  <div className='add-new' onClick={handleCreateForm}>
                    <AddIcon className='add-icon' />
                  </div>
                )}
                {showAddTask && (
                  <NewTask
                    setShowAddTask={setShowAddTask}
                    setNotStartedList={setNotStartedList}
                    notStartedList={notStartedList}
                  />
                )}
              </div>
            </div>
            <div className='column'>
              <div className='column-head'>
                <h2 className='title'>In Progress</h2>
              </div>
              <Droppable droppableId='in-progress'>
                {(provided) => (
                  <ul
                    className='in-progress'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
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
                                  <DeleteIcon
                                    className='icons'
                                    onClick={() => handleDelete(id)}
                                  />
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
              <div className='column-head'>
                <h2 className='title'>Awaiting Review</h2>
              </div>
              <Droppable droppableId='awaiting-review' className='droppable'>
                {(provided) => (
                  <ul
                    className='awaiting-review'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
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
                                    <DeleteIcon
                                      className='icons'
                                      onClick={() => handleDelete(id)}
                                    />
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
              <div className='column-head'>
                <h2 className='title'>Done</h2>
              </div>
              <Droppable droppableId='done'>
                {(provided) => (
                  <ul
                    className='done'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
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
                                  <DeleteIcon
                                    className='icons'
                                    onClick={() => handleDelete(id)}
                                  />
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
    </div>
  );
}
