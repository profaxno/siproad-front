import { AuthProvider } from "./auth/context/AuthContext"
import { SiproadRouter } from "./siproad/routes/SiproadRouter"

// import './App.css'
import './index.css'

function App() {
  
  return (
    <AuthProvider>
      <SiproadRouter/>
    </AuthProvider>
  )
}

export default App
