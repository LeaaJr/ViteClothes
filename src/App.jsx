import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './page/Home';
import { SignIn } from './auth/SignIn';
import { SignUp } from './auth/SignUp';

function App() {

  return (
    <>
    <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignIn" element={<SignIn/>} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
