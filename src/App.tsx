import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/protected-route";
import Login from "./pages/login";
import Container from '@mui/material/Container';

function App() {

  return (
    <BrowserRouter>
      <Container>
        <Routes>
          <Route path="/" element={<ProtectedRoute><h1>Home</h1></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
