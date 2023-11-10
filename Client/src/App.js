// // src/App.js
// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './component/Home';
// import ContactUs from './component/ContactUs';
// import ApplyPage from './component/ApplyPage';
// import RespondPage from './component/RespondPage';
// import ErrorPage from "./component/ErrorPage";

// import "bootstrap/dist/css/bootstrap.min.css";
// import { useState } from 'react';

// const App = () => {
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   return (
//     <>
//       <Routes>
//         <Route path="/" exact element={<Home />} />
//         <Route path="/apply" element={<ApplyPage setFormSubmitted={setFormSubmitted} />} />
//         <Route path="/contactus" element={<ContactUs />} />
//         <Route path="/respond" element={<RespondPage formSubmitted={formSubmitted} />} />
//         <Route path="/error" element={<ErrorPage />} />
//         <Route path="*" element={<ErrorPage />} />
//       </Routes>
//     </>
//   );
// };

// export default App;

// src/App.js
import React from 'react';
import './App.css';
import Button from './component/Button';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Button label="Click me" size="medium" onClick={() => alert('Button clicked!')} />
      </header>
    </div>
  );
}

export default App;
