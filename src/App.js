
import {useState, useEffect} from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'

function App() {

  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(()=>{    
    const getTasks = async () =>{
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer) //pillamos los datos del servidor y los actualizamos      
    }
    getTasks()
  }, [])


  //Fetch Tasks
  const fetchTasks = async () =>{
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()    
    return data
  }

    //Fetch Task (obtenemos el objeto por id)
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()  
    return data
   }
  
  
  //AddTask 
  const addTask = async (tareas)=>{    
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(tareas),
    })
    const data = await res.json()
    setTasks([...tasks, data])        

    //si no usamos base de datos:
    // const id  = Math.floor(Math.random()*1000 + 1)
    // const newtask = {id,...tareas} // añadimos una id random cuando agregamos un objeto nuevo al array
    // setTasks([...tasks,newtask]) // actualizamos las tareas con un nuevo array de objetos  
    /*O bien:
    const newarr = []
    newarr.push(...tasks,newtask)
    setTasks(newarr)
    */
  } 
  



  //Delete Task 
  const deleteTask = async (id) => {
    //borrado del servidor:
    await fetch(`http://localhost:5000/tasks/${id}`,
    { method:'DELETE' })    
    //borrado de la vista:
    setTasks(tasks.filter( (task)=> task.id !== id)) //devuelve un nuevo array de objetos filtrado 
  }



  //toggle reminder
  const toggleReminder = async (id)=>{
    //actualizamos la base de datos del reminder 
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })
    const data = await res.json()
    setTasks(   //clonamos el objeto task creando uno nuevo  
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    )
      
    /* Hecho con bucle for clasico:
     const newtasks = []      
     for(let i=0; i<tasks.length; ++i){
       tasks[i].id===id ?
        newtasks.push({...tasks[i], reminder : data.reminder}) :  
        newtasks.push({...tasks[i]})            
     }     
     setTasks(newtasks)
     */    
  }


  return (
    <Router>
     <div className="container">
      {/* En el Header hacemos un toggle con el boton add en onAdd y tambien cambiamos el aspecto del boton con showAdd*/}
       <Header  onAdd={()=>setShowAddTask(!showAddTask)}  showAdd={showAddTask}/>  

       <Route path='/'
              exact
              render={(props)=>(
              <>
                {/*Mostramos AddTask dependiendo de si el valor de showAddTask es true */}
                {showAddTask && <AddTask onAdd={addTask}/>} 

                {/*Si el array de tareas es cero, indicamos que no hay tareas que  mostrar */}
                {tasks.length>0 ? <Tasks tasks={tasks}  onDelete={deleteTask}  onToggle={toggleReminder}/> : ('No tasks to show')}

            </>
        )} />
       <Route path='/about'  component={About}/>
       <Footer />
     </div>
    </Router>
  );
}

export default App;
