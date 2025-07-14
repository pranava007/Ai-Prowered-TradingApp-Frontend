import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StockDashboard from '../Components/StockDashboard'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <StockDashboard />
    </>
  )
}

export default App
