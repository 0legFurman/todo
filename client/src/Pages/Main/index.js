import { useEffect, useState } from 'react'
import { useHttp } from '../../hooks/http.hook'

export const MainPage = (props) => {

    const { userID, logout } = props;
    const { request } = useHttp()

    const [form, setForm] = useState({
        name: '',
        description: ''
    })
    const [editableTask, setEditableTask] = useState(null)
    const [tasks, setTasks] = useState(null)
    const [userName, setUserName] = useState(null)

    useEffect(() => {
        async function getTasks() {
            if (userID) {
                const data = await request(`/api/getTasks/${userID}`, 'GET')
                setTasks(data.tasks)
            }
        }
        getTasks()
    }, [request, userID])

    useEffect(() => {
        async function getUserName() {
            if (userID) {
                const data = await request(`/api/getUser/${userID}`, 'GET')
                setUserName(data.userName)
            }
        }
        getUserName()
    }, [request, userID])
    const header = `User: ${userName}`


    const changeHandler = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleAddClick = async () => {
        if (editableTask !== null) {
            const data = await request(`/api/editTask/${userID}/${editableTask}`, 'POST', { ...form })
            setEditableTask(null)
            setTasks(data.tasks)

        } else {
            const data = await request(`/api/addTask/${userID}`, 'POST', { ...form })
            setTasks(data.tasks)
        }
        setForm({ name: '', description: '' })
    }

    const handleEditClick = (task, index) => {
        setForm({
            name: task.name,
            description: task.description,
        })
        setEditableTask(index)
    }

    const handleDeleteClick = async (name, taskIndex) => {
        const data = await request(`/api/deleteTask/${userID}/${taskIndex}`, 'POST')
        setTasks(data.tasks)
    }

    return (
        <div>
            <h2>{header}</h2>
            <button onClick={logout}>Logout</button>
            <h1>Tasks</h1>

            <div>
                <div>
                    <p>Name: </p>
                    <input onChange={changeHandler} name='name' value={form.name} placeholder="name"></input>
                </div>
                <div>
                    <p>Description: </p>
                    <input onChange={changeHandler} name='description' value={form.description} placeholder="description"></input>
                </div>
                <button onClick={handleAddClick}>{editableTask !== null ? 'Save' : 'Add'}</button>
            </div>

            {!!tasks && !!tasks.length && tasks.map((task, taskIndex) => (
                <div key={`${task.name}${taskIndex}`}>
                    <p>{`Name: ${task.name}`}</p>
                    <p>{`Description: ${task.description}`}</p>
                    <button disabled={editableTask} onClick={handleEditClick.bind(this, task, taskIndex)}>Edit</button>
                    <button disabled={editableTask} onClick={handleDeleteClick.bind(this, task.name, taskIndex)}>Delete</button>
                </div>
            ))}
        </div>
    )
}


