import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/home/Home';
import Detail from './views/detail/Detail';
import { DashboardAdmin } from './views/dashboardAdmin/DashboardAdmin';
import ShoppingCart from './views/shopping-cart/ShoppingCart';

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/detail" element={<Detail />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
      </Routes>
    </Router>
  );
}

export default App;
