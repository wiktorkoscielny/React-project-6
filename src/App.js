import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './pages/Home'
import Search from './pages/Search'

function App() {
  return (
    <BrowserRouter forceRefresh={false}>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/search' element={<Search />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
