import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import './styles.css';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import NewTask from './NewTask';
import Header from '../header/header';
import ListItem from './ListItem';
const url = process.env.REACT_APP_API_URL || 'http://localhost:4000'

export default function TaskBoard() {
  const [notStartedList, setNotStartedList] = useState([]);
  const [inProgressList, setInProgressList] = useState([]);
  const [awaitingReviewList, setAwaitingReviewList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const token = localStorage.getItem('JWT');

  const handleLoadTasks = () => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    fetch(`${url}/task`, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        const mappedTasks = json.tasks.map(function(task) {
          task.id = task.id.toString();
          return task;
        });

        const notStarted = mappedTasks.filter(
          (task) => task.status === 'not-started'
        );
        setNotStartedList(notStarted);
        const inProgress = mappedTasks.filter(
          (task) => task.status === 'in-progress'
        );
        setInProgressList(inProgress);
        const awaitingReview = mappedTasks.filter(
          (task) => task.status === 'awaiting-review'
        );
        setAwaitingReviewList(awaitingReview);
        const done = mappedTasks.filter((task) => task.status === 'done');
        setDoneList(done);
        setDataLoaded(true);
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
  };

  const handleOnDragEnd = (result) => {
    const patchArr = [];
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
      destinationArr = destinationCopy;
      sourceArr = sourceCopy;

      for (let i = 0; i < destinationArr.length; i++) {
        const task = destinationArr[i];
        if (task.index !== i) {
          task.index = i;
        }
      }
      destinationArr.forEach(function(element) {
        return patchArr.push(element);
      });
    } else {
      let sourceCopy = [...source];
      const [reorderedItem] = sourceCopy.splice(result.source.index, 1);
      reorderedItem.index = result.destination.index;
      sourceCopy.splice(result.destination.index, 0, reorderedItem);
      setSource(sourceCopy);
      sourceArr = sourceCopy;
    }
    for (let i = 0; i < sourceArr.length; i++) {
      const task = sourceArr[i];
      if (task.index !== i) {
        task.index = i;
      }
    }
    sourceArr.forEach(function(element) {
      return patchArr.push(element);
    });
    handleMoveTwo(patchArr);
  };

  const handleMoveTwo = (patchArr) => {
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/json',
      },
      body: JSON.stringify(patchArr),
    };

    fetch(`${url}/tasks`, options).then(function(response) {
      return response.json();
    });
  };

  const handleCreateForm = () => {
    setShowAddTask(true);
  };

  const handleDelete = (taskId) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    fetch(`${url}/task/${taskId}`, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        const list = json.taskToDelete[0].status;

        const [listState, setListState] = getStateForList(list);
        let listCopy = [...listState];
        const foundTaskIndex = listCopy.findIndex((task) => task.id === taskId);
        listCopy.splice(foundTaskIndex, 1);
        setListState(listCopy);
      });
  };

  const handleEdit = (event, taskId) => {
    setEditFlag({ taskId: taskId });
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
                  >
                    {notStartedList.map(({ id, name, description }, index) => {
                      return (
                        <ListItem
                          key={`not-started-list${id}`}
                          id={id}
                          name={name}
                          description={description}
                          index={index}
                          handleEdit={handleEdit}
                          handleDelete={handleDelete}
                          editFlag={editFlag}
                          setEditFlag={setEditFlag}
                          handleLoadTasks={handleLoadTasks}
                        />
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
                        <ListItem
                          key={`in-progress-list${id}`}
                          id={id}
                          name={name}
                          description={description}
                          index={index}
                          handleEdit={handleEdit}
                          handleDelete={handleDelete}
                          editFlag={editFlag}
                          setEditFlag={setEditFlag}
                          handleLoadTasks={handleLoadTasks}
                        />
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
                          <ListItem
                            key={`awaiting-review-list${id}`}
                            id={id}
                            name={name}
                            description={description}
                            index={index}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            editFlag={editFlag}
                            setEditFlag={setEditFlag}
                            handleLoadTasks={handleLoadTasks}
                          />
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
                        <ListItem
                          key={`done-list${id}`}
                          id={id}
                          name={name}
                          description={description}
                          index={index}
                          handleEdit={handleEdit}
                          handleDelete={handleDelete}
                          editFlag={editFlag}
                          setEditFlag={setEditFlag}
                          handleLoadTasks={handleLoadTasks}
                        />
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
