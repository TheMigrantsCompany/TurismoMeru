import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/home/Home';
import Detail from './views/detail/Detail';
import { DashboardAdmin } from './views/dashboardAdmin/DashboardAdmin';
import { DashboardUser } from './views/dashboardUser/DashboardUser';
import ShoppingCart from './views/shopping-cart/ShoppingCart';
import StickyNavbar from './components/navbar/StickyNavbar';
import ProfileForm from './views/dashboardUser/ProfileForm';
import Reviews from './views/dashboardUser/Reviews';
import { UserManagement } from './views/dashboardAdmin/dashAdminViews/UserManagement';
import { ReservationManagement } from './views/dashboardAdmin/dashAdminViews/ReservationManagement';

import { ExcursionManagement } from './views/dashboardAdmin/dashAdminViews/ExcursionManagement';

import { ReviewsManagement } from './views/dashboardAdmin/dashAdminViews/ReviewManagement';

import { ServiceOrderManagement } from './views/dashboardAdmin/dashAdminViews/ServiceOrderManagement';

function App() {
  return (
    <Router>
      <StickyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<Detail />} />
        
        {/* Ruta para el Administrador */}
        <Route path="/admin" element={<DashboardAdmin />}>
          {/* Subrutas dentro de la administración */}
          <Route path="reservas" element={<ReservationManagement />} />
          <Route path="usuarios" element={<UserManagement />} />
          <Route path="excursiones" element={<ExcursionManagement />} />
          <Route path="reviews" element={<ReviewsManagement />} />
          <Route path="ordenes" element={<ServiceOrderManagement />} />
        </Route>

        {/* Rutas para el usuario */}
        <Route path="/user" element={<DashboardUser />}>
          {/* Asegúrate de que estas rutas están anidadas */}
          <Route path="profile" element={<ProfileForm />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="shoppingcart" element={<ShoppingCart />} />
          
          {/* Puedes añadir otras subrutas aquí */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;