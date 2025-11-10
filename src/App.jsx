import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Verify from './pages/verify';
import { UserProvider, useUserData } from './context/UserContext';
import { LoadingBig } from './components/loading'; // ✅ Correct import

const AppRoutes = () => {
  const { loading } = useUserData(); // ✅ Using loading from context
  console.log("AppRoutes rendered, loading:", loading);

  if (loading) {
    console.log("Showing LoadingBig component");
    return <LoadingBig />; // ✅ Correct component usage
  }

  console.log("Showing Routes component");
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/verify' element={<Verify />} />
    </Routes>
  );
};

const App = () => (
  <UserProvider>
      <AppRoutes />
  </UserProvider>
);

export default App;