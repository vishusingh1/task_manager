import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './pages/Login'
import Landing from './pages/Landing'
import ProtectedRoute from './components/ProtctedRoute'
import CreateTask from './pages/CreateTask'
import Tasks from './pages/Tasks'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
    <Route path='/login' element={<Login />} />
     <Route
          path="/"
          element={
            <ProtectedRoute>
              <Landing />

            </ProtectedRoute>
          }
        />
         <Route
          path="/tasks/create"
          element={
            <ProtectedRoute>
              <CreateTask />
              
            </ProtectedRoute>
          }
        />
         <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
              
            </ProtectedRoute>
          }
        />
    </Routes>
    
    </BrowserRouter>
   
    
  )
}

export default App
