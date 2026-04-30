import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Aplicacion from './Aplicacion.jsx';
import './estilos.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Aplicacion />
      <Toaster position="top-right" />
    </BrowserRouter>
  </React.StrictMode>
);

