import { useEffect, useState } from 'react'
import { useHttp } from '../../hooks/http.hook'
import navstyle from './index.module.css'
import logo from './../../images/logo.png'

export const MainPage = (props) => {

    const { userID, logout } = props;
    const { request } = useHttp()

    const [form, setForm] = useState({
        name: '',
        description: '',
        status: '',
        Deadline: '',
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
    const header = userName;


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
        setForm({ name: '', description: '', status: '', Deadline: '', })
    }

    const handleEditClick = (task, index) => {
        setForm({
            name: task.name,
            description: task.description,
            status: task.status,
            Deadline: task.Deadline,
        })
        setEditableTask(index)
    }

    const handleDeleteClick = async (name, taskIndex) => {
        const data = await request(`/api/deleteTask/${userID}/${taskIndex}`, 'POST')
        setTasks(data.tasks)
    }

    return (
        <div className={navstyle.page}>
            <div className={navstyle.content}>
                <div className={navstyle.elem1}  >{header}</div>
                <div className={navstyle.logcont}><img className={navstyle.logo} src={logo} />
                    <div className={navstyle.appname}>ToDO</div>
                </div>
                <button className={navstyle.elem2} onClick={logout}>??????????</button>

            </div>
            <div className={navstyle.box}>
                <div className={navstyle.fieldblock}>
                    <div className={navstyle.article}>??????????:</div>
                    <input className={navstyle.field} type="text" name='name' onChange={changeHandler} value={form.name} required
                        minlength="4" maxlength="12" size="35" />
                </div>
                <div className={navstyle.fieldblock}>
                    <div className={navstyle.article}>????????:</div>
                    <input className={navstyle.field} type="text" name='description' onChange={changeHandler} value={form.description}
                        required minlength="4" maxlength="150" size="35" />
                </div>
                <div className={navstyle.fieldblock}>
                    <div className={navstyle.article}>????????????:</div>
                    <input className={navstyle.field} type="text" name='status' onChange={changeHandler} value={form.status} required
                        minlength="4" maxlength="20" size="35" />
                </div>
                <div className={navstyle.fieldblock}>
                    <div className={navstyle.article}>???????? ????????????????????:</div>
                    <input className={navstyle.field} type="date" name='Deadline' onChange={changeHandler} value={form.Deadline}
                        min="2021-01-01" max="2024-12-31" />
                </div>
                <button className={navstyle.formbutton} onClick={handleAddClick}>{editableTask !== null ? '????????????????' : '????????????????'}</button>

            </div>
            <div className={navstyle.tasks}>
                {!!tasks && !!tasks.length && tasks.map((task, taskIndex) => (
                    <div className={navstyle.window}  >
                        <div className={navstyle.block}  >
                            <div className={navstyle.row}>??????????: {task.name}</div>
                            <div className={navstyle.row}>????????: {task.description}</div>
                            <div className={navstyle.row}> ????????????: {task.status}</div>
                            <div className={navstyle.row}> ???????? ????????????????????: {task.Deadline}</div>
                            <button className={navstyle.editbutton} disabled={editableTask} onClick={handleEditClick.bind(this, task, taskIndex)}>????????????????????</button>
                            <button className={navstyle.deletebutton} disabled={editableTask} onClick={handleDeleteClick.bind(this, task.name, taskIndex)}>????????????????</button>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    )

}
{/* <div key={`${task.name}${taskIndex}`}>
<p>{`Name: ${task.name}`}</p>
<p>{`Description: ${task.description}`}</p>
<p>{`Status: ${task.status}`}</p>
<p>{`Deadline: ${task.Deadline}`}</p>
<button disabled={editableTask} onClick={handleEditClick.bind(this, task, taskIndex)}>Edit</button>
<button disabled={editableTask} onClick={handleDeleteClick.bind(this, task.name, taskIndex)}>Delete</button>
</div> */}



