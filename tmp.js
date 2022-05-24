
const token = localStorage.getItem('JWT')
const handleLoadTasks = () => {
    const options = {
        method: 'GET', 
        headers : {
          'Authorization' : `Bearer + ${token}`
        },
      }
  
      //Pass in the options object from above
      fetch("http://localhost:4000/tasks", options)
      .then(function(response) {
        return response.json()
      }).then(function(json) {
        console.log("tasks returned from database!", json)
      })
}