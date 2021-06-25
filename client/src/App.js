import { useRoutes } from "./routes";
import { BrowserRouter } from 'react-router-dom'
import {useAuth} from './hooks/auth.hook'
import {AuthContext} from './context/auth.contex'

function App() {
  const {token, login, logout, userID} = useAuth()
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated, userID)
  return (
    <AuthContext.Provider value={{
      token,login,logout,userID, isAuthenticated
    }}>
       <BrowserRouter>
        <div>
          {routes}
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
