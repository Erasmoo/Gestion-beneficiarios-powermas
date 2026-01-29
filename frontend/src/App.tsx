import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BeneficiarioFormPage from './pages/BeneficiarioFormPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nuevo" element={<BeneficiarioFormPage />} />
          <Route path="/editar/:id" element={<BeneficiarioFormPage />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;