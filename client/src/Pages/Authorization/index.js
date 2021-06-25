import { useContext, useState } from 'react'
import { AuthContext } from '../../context/auth.contex'
import { useHttp } from '../../hooks/http.hook'
import logination from './index.module.css'
import logo from './../../images/logo.png'
export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const [form, setForm] = useState({
        login: '',
        password: ''
    })
    const [message, setMessage] = useState(null)
    const changeHandler = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const registerHandler = async () => {
        const data = await request('/api/register', 'POST', { ...form })
        setForm({login: '', password:''})
        setMessage(data.message)
    }
    const loginHandler = async () => {
        const data = await request('/api/login', 'POST', { ...form })
        auth.login(data.token, data.userID, data.userLogin, data.tasks)
    }
    return (
        <div className={logination.window}>
            <img className={logination.logo} src={logo}></img>
            <div className={logination.name}>ToDO</div>
            <div className={logination.logbox}>
                <div className={logination.fields}>
                    <input className={logination.input} type="text" value={form.login} onChange={changeHandler} name='login' placeholder="Enter Login"></input>
                    <input className={logination.input} type="text" value={form.password} onChange={changeHandler} name='password' placeholder="Enter Password"></input>
                </div>
                {message && <p>{message}</p>}
                <button className={logination.button1} onClick={registerHandler}>Register</button>
                <button className={logination.button} onClick={loginHandler}>Login</button>

            </div>
        </div>
    )
}
