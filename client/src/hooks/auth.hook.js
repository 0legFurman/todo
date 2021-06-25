import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token,setToken] = useState(null)
    const [userID,setUserID] = useState(null)
    const [userLogin,setUserLogin] = useState(null)

    const login = useCallback((jwtToken,ID, login, tasks)=>{
        setToken(jwtToken)
        setUserID(ID)
        setUserLogin(login)
        localStorage.setItem(storageName, JSON.stringify({
            userID: ID, token: jwtToken, userLogin: login,
        }))
    },[])

    const logout = useCallback(()=>{
        setToken(null)
        setUserID(null)
        localStorage.removeItem(storageName)
    },[])

    useEffect(()=>{
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.userID, data.userLogin)
        }
    },[login])

    return {login, logout, token, userID, userLogin}
}