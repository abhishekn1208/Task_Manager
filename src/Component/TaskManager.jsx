import axios from 'axios'
import React, { useEffect, useState } from 'react'

let url = `http://localhost:3000/Tasks`
const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title : '', isCompleted : 'false', assignee: ''
    })
    const [editTask, setEditTask] = useState(null)
    const [filter, setFilter] = useState('')
    useEffect(()=>{
        fetchTasks();
    },[]);

    const fetchTasks = async ()=>{
        let res = await axios.get(url)
        console.log(res.data)
        setTasks(res.data)
    }
    
    const addTask =async()=>{
        const res = await axios.post(url,newTask);
        console.log(res.data)
        setTasks([...tasks, res.data])
        setNewTask({title:'',isCompleted:false,assignee:''})
    }

    const showIncompleteTasks=()=>{
        return tasks.filter(task=> !task.isCompleted)
    }

    const filterByAssignee=()=>{
        return tasks.filter(task=>task.assignee.toLowerCase().includes(filter.toLowerCase()))
    }

    const updateTask= async(id)=>{
        const res = await axios.put(`${url}/${id}`,editTask)
        setTasks(tasks.map(task=> (task.id === id ? res.data : task)))
        setEditTask({title:'', isCompleted:false, assignee:''})

    }

    const deleteTask = async(id)=>{
        await axios.delete(`${url}/${id}`);
        setTasks(tasks.filter(task=> task.id !== id))
    }

    const displayTask = filter ? filterByAssignee() : tasks;

  return (
    <div>
      <h1>Task Manager</h1>
      <div>
        <h2>Add New Task</h2>
        <input type="text" placeholder='Title' value={newTask.title} onChange={(e)=>setNewTask({...newTask, title :e.target.value})} />
        <input type="text" placeholder='assignee' value={newTask.assignee} onChange={(e)=>setNewTask({...newTask, assignee : e.target.value})} />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div>
        <h2>All Tasks</h2>
        <button onClick={fetchTasks}>Get All Tasks</button>
        <button onClick={showIncompleteTasks}>Show Incomplete Tasks</button>
        <input type="text" placeholder='filter by assignee' value={filter} onChange={(e)=>setFilter(e.target.value)} />
      

        <ul>
            {displayTask.map(task=>(
                <li key={task.id}>
                    {editTask && editTask.id === task.id ? (
                        <div>
                            <input type="text" value={editTask.title} onChange={(e)=>setEditTask({...editTask, title : e.target.value})} />
                            <input type="checkbox" checked = {editTask.isCompleted} onChange={(e)=> setEditTask({...editTask, isCompleted : e.target.checked})}/>
                            <input type="text" value={editTask.assignee} onChange={(e)=> setEditTask({...editTask,assignee: e.target.value})} />
                            <button onClick={()=>updateTask(task.id)}>Update</button>
                            <button onClick={()=>setEditTask(null)}>Cancel</button>
                        </div>
                    ):  (<div>
                        <span>{task.title} (Assigned to : {task.assignee})</span>
                        <button onClick={()=>setEditTask(task)}>Edit</button>
                        <button onClick={()=>deleteTask(task.id)}>Delete</button>
                        </div>)}


              
                </li>
            ))}
        </ul>
        </div>
    </div>
  )
}

export default TaskManager
