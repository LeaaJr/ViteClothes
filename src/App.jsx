import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './page/Home';
import './App.css'

function App() {

  return (
    <>
    <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
