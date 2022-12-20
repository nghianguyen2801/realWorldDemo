import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<DefaultLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
