import './App.css';
import { useState, useEffect } from 'react'
const API = 'http://localhost:3001'
function App() {

  const [todos, setTodos] = useState([])
  const[popupActive,setPopupActive]=useState(false)
  const[newTodos,setNewTodos]=useState("")
  const[editPopUp,setEditPopUp]=useState(false)
  const[editId,setEditId]=useState(null)

  useEffect(() => {
    getTodos()

  }, [])

  const getTodos = () => {
    fetch(API + "/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(console.error)
  }

  const completeTodo = async (id) => {
    const data = await fetch(API + "/todo/complete/" + id).then((res) => res.json())

    setTodos(todos => todos.map(todo => {
      if (todo._id === data._id) {
              todo.completed=data.completed
      }
      return todo
    }))

  }

  const deleteTodo=async(id)=>{
       const data = await fetch(API+"/todo/delete/"+id,{method:"DELETE"}).then((res)=>res.json())
       setTodos(todos=>todos.filter(todo=>todo._id!==data._id))
  }
  const addTodo=async()=>{
     const data = await fetch(API+"/todo/new",{
      method:"POST",
      headers:{
         "Content-Type":"application/json"
      },
      body:JSON.stringify({
             text:newTodos
      })
     }).then((res)=>res.json())
     setTodos([...todos,data])
     setPopupActive(false)
     setNewTodos("")
  }
  const editTodo=async(id)=>{
    const data =await fetch(API+'/todo/edit/'+id,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        text:newTodos
      })
    }).then((res)=>res.json())

    setTodos(todos.map((todo)=>{
        if(todo._id === data._id)
        {
          todo.text=data.text
        }
        return todo
    }))
    setEditPopUp(false)
    setNewTodos("")
  }
 

  return (
    <>
      <div>
        Hello,
        <div className="todos">
          {todos.map((todo) =>
            <div className={todo.completed ? "todo-is-complete" : "todo"} onClick={() => completeTodo(todo._id)} key={todo._id}>
              <div className="checkbox"></div>
              <div className="text">{todo.text}</div>
              <div className="edit" onClick={(e)=>{
                e.stopPropagation()
                setEditPopUp(true)
                setNewTodos(todo.text)
                setEditId(todo._id)
                }}>@</div>
              <div className="delete-todo" onClick={(e)=>{
                e.stopPropagation()
                deleteTodo(todo._id)}}>X</div>
            </div>
          )}
        </div>
        <div className="addTask" onClick={()=>setPopupActive(true)}>+</div>
        {popupActive ? <div className='popup'>
          <div className='content'>
          <div className="closePop" onClick={()=>
            {
              setPopupActive(false)
              setNewTodos("")
            }}>X</div>
          <h3 className='head'>Add a task</h3>
          <input className="ip" type="text" placeholder='create a task' value={newTodos} onChange={(e)=>setNewTodos(e.target.value)}  />
          <button className={newTodos==="" ? "create-btn-disabled":"create-btn" } onClick={()=>addTodo()}>Create task</button>
        </div></div> :""}
        {
          editPopUp ? <div className='popup'>
          <div className='content'>
          <div className="closePop" onClick={()=>
            {
              setEditPopUp(false)
            
            }}>X</div>
          <h3 className='head'>Edit a task</h3>
          <input className="ip" type="text" placeholder='create a task' value={newTodos} onChange={(e)=>setNewTodos(e.target.value)}  />
          <button className={newTodos==="" ? "create-btn-disabled":"create-btn"  } onClick={()=>editTodo(editId)} >edit task</button>
        </div></div>:""
        }
      </div>
    </>
  );
}

export default App;
