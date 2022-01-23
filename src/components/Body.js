import React, {useState} from 'react';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import { DeleteRounded } from '@material-ui/icons';
import { Button, Grid, Paper } from '@material-ui/core';

import Axios from 'axios';


export const Body = () => {

    const [title, setTitle] = useState()
    const [discription, setDiscription] = useState()
    const [states, setStates] = useState(true)
    const [alltasks, setAlltasks] = useState([])


    const saveTask = ()=>{
        Axios.post('http://localhost:3001/create-new-todo',
        {
            title:title,
            discription:discription,
            states:true,

        }).then((res,err)=>{
            if(res.data ==='have'){alert('This todo title already exsist!!')}
            loardTasks()
        })
        setTitle('')
        setDiscription('')
    }

    const updateTaskStates = (id, states)=>{
        let v = true;
        if(states){v = false}else{v = true}
        Axios.post("http://localhost:3001/update-todo", { id: id, states: v }).then(
            (response) => {
                loardTasks()
            }
        );
    }

    const deleteTask = (id)=>{
        Axios.post("http://localhost:3001/delete-todo", { id: id }).then(
            (response) => {
                loardTasks()
            }
        );
    }

    const loardTasks = ()=>{
        Axios.get('http://localhost:3001/get-all-todos').then((responce)=>{
            setAlltasks(responce.data)
            
        })  
    }

    React.useEffect(() => {
        loardTasks();
    }, []);


  return <>
            <AddNewTask 
                title={title}
                discription={discription}
                setTitle ={setTitle}
                setDiscription ={setDiscription}
                setStates ={setStates}
                saveTask = {saveTask}
            />
            <hr/>
            <br/>
            <br/>
            <TasksList
                updateTaskStates={updateTaskStates}
                deleteTask={deleteTask}
                loardTasks={loardTasks}
                alltasks={alltasks}
            />
         </>;
};

const AddNewTask = ({title,discription,setTitle,setDiscription,saveTask})=>{
    return(
        <>
            
            <Grid className="add-form">
                <div className="form-control">
                <label>Todo Title</label>
                <input
                    type="text"
                    placeholder="Add Todo Title"
                    value={title}
                    onChange={(e)=>{setTitle(e.target.value)}}
                />
                </div>
                <div className="form-control">
                <label>Description</label>
                <input
                    type="text"
                    placeholder="Description"
                    value={discription}
                    onChange={(e)=>{setDiscription(e.target.value)}}
                />
                </div>
                <Button className="btn btn-block" variant="contained" color='primary'
                    onClick={()=>{saveTask()}}
                >Save Todo</Button>
            </Grid>
        </>
    )
}

const TasksList = ({updateTaskStates,deleteTask,loardTasks,alltasks})=>{
    
    return(
        <>
            {alltasks.map((todo)=>{
             return <Grid style={{marginBottom:"50px"}}>
                    <Paper elevation={3} >
                        <Grid container spacing={6}>
                            <Grid item xs={6}  style={{textAlign:'left'}}>
                                <h2>{todo.title}</h2>
                            </Grid>
                            <Grid item xs={6} style={{textAlign:'right'}}>
                                <Button onClick={()=>{deleteTask(todo.id)}}
                                        startIcon={<DeleteRounded color="secondary" 
                                        style={{fontSize:30}}/>}
                                />
                            </Grid>                
                        </Grid>
                        <p style={{textAlign: 'justify', margin: '10px 10px 10px 10px'}}> 
                        {todo.discription}
                        </p>
                        <Button 
                        onClick={()=>{updateTaskStates(todo.id, todo.states)}}
                        startIcon=
                        {todo.states?<ToggleOnIcon color="primary" style={{fontSize:60}}/>:<ToggleOffIcon color="secondary" style={{fontSize:60}}/>}
                        />
                    </Paper>
                </Grid>
            })}
        </>
    )
}