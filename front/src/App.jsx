import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/home/Home';
import Detail from './views/detail/Detail';
import { DashboardAdmin } from './views/dashboardAdmin/DashboardAdmin';
import { DashboardUser } from './views/dashboardUser/DashboarUser';
import ShoppingCart from './views/shopping-cart/ShoppingCart';
import StickyNavbar from './components/navbar/StickyNavbar';
import ProfileForm from './views/dashboardUser/ProfileForm';


function App() {
  return (
    <Router> 
      < StickyNavbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/detail" element={<Detail />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/user" element={< DashboardUser />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/profile" element={<ProfileForm />} />
      </Routes>
    </Router>
  );
}

export default App;
