import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/protected-route";
import Login from "./pages/login";
import Home from './pages/home';
import Layout from './ui/layout';
import { Provider } from 'react-redux';
import { store } from './API/store';

function App() {

  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
