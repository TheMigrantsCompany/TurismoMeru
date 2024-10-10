import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/home/Home';
import Detail from './views/detail/Detail';
import { DashboardAdmin } from './views/dashboardAdmin/DashboardAdmin';
import { DashboardUser } from './views/dashboardUser/DashboarUser';
import ShoppingCart from './views/shopping-cart/ShoppingCart';
import StickyNavbar from './components/navbar/StickyNavbar';
import ProfileForm from './views/dashboardUser/ProfileForm';
import Reviews from './views/dashboardUser/Reviews';

import { ReservationManagement } from './views/dashboardAdmin/dashAdminViews/ReservationManagement';

function App() {
  return (
    <Router> 
      < StickyNavbar />
      <Routes>
      <Route path="/" element={<Home />} /> 
        <Route path="/detail" element={<Detail />} />
         {/* Ruta para la sección de administración */}
         <Route path="/admin" element={<DashboardAdmin />}>
          {/* Subrutas dentro de la administración */}
          <Route path="reservas" element={<ReservationManagement />} />
          {/* Puedes añadir otras subrutas aquí */}
        </Route>
        <Route path="/user" element={<DashboardUser />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
    </Router>
  );
}

export default App;
