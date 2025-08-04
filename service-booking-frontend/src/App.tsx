
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Register from './components/Register';
import Login from './components/Login';
import Layout from './components/Loyout';
import { AuthProvider } from './context/AuthContext';
import CreateServiceForm from './components/CreateServiceForm';
import ProviderServiceList from './components/MyServices';
import EditServiceForm from './components/EditServiceForm';
import Home from './components/Home';
import { FilterProvider } from './context/FilterContext';
import ServiceDetails from './components/ServiceDetails';
import MyReservations from './components/MyReservations';
import ReservationsForProvider from './components/ReservationsForProvider';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}  />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="createService" element={
              <ProtectedRoute requiredRole="PROVIDER">
                <CreateServiceForm />
              </ProtectedRoute>
            } />
            <Route path="myServices" element={
              <ProtectedRoute requiredRole="PROVIDER">
                <ProviderServiceList />
              </ProtectedRoute>
            } />
            <Route path="serviceDetails/:id" element={<ServiceDetails />} />
            <Route path="editService/:id" element={
              <ProtectedRoute requiredRole="PROVIDER">
                <EditServiceForm />
              </ProtectedRoute>
            } />
            <Route path="home" element={<FilterProvider><Home /></FilterProvider>}/>
            <Route path="myReservations" element={
              <ProtectedRoute requiredRole="CLIENT">
                <MyReservations />
              </ProtectedRoute>
            } />
            <Route path='reservationsForMyServices' element={
              <ProtectedRoute requiredRole="PROVIDER">
                <ReservationsForProvider />
              </ProtectedRoute>
            }/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );

}

export default App
