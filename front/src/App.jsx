import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./views/home/Home";
import { useContext } from "react";
import Detail from "./views/detail/Detail";
import { DashboardAdmin } from "./views/dashboardAdmin/DashboardAdmin";
import { DashboardUser } from "./views/dashboardUser/DashboardUser";
import ShoppingCart from "./views/shopping-cart/ShoppingCart";
import StickyNavbar from "./components/navbar/StickyNavbar";
import ProfileForm from "./views/dashboardUser/ProfileForm";
import Reviews from "./views/dashboardUser/Reviews";
import Purchases from "./views/dashboardUser/Purchases";
import OrderForm from "./views/orderForm/OrderForm";
import BookingForm from "./views/bookingform/BookingForm";
import UserBookings from "./views/dashboardUser/UserBookings";
import PaymentFailure from './views/payment/PaymentFailure';
import PaymentPending from "./views/payment/PaymentPending";
import { UserManagement } from "./views/dashboardAdmin/dashAdminViews/UserManagement";
import { ReservationManagement } from "./views/dashboardAdmin/dashAdminViews/ReservationManagement";
import { ExcursionManagement } from "./views/dashboardAdmin/dashAdminViews/ExcursionManagement";
import { ReviewsManagement } from "./views/dashboardAdmin/dashAdminViews/ReviewManagement";
import { ServiceOrderManagement } from "./views/dashboardAdmin/dashAdminViews/ServiceOrderManagement";
import { CartProvider } from "./views/shopping-cart/CartContext";
import { AuthProvider, AuthContext } from "./firebase/AuthContext.jsx";
import { AdminRoute, UserRoute } from "./components/ProtectedRoute";

function App() {
  const { user, id_User } = useContext(AuthContext);

  return (
    <CartProvider>
      <StickyNavbar />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id_Service" element={<Detail />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/payment-pending" element={<PaymentPending />} />
        
        {/* Rutas protegidas para el Administrador */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <DashboardAdmin />
            </AdminRoute>
          }
        >
          <Route path="reservas" element={<ReservationManagement />} />
          <Route path="usuarios" element={<UserManagement />} />
          <Route path="excursiones" element={<ExcursionManagement />} />
          <Route path="reviews" element={<ReviewsManagement />} />
          <Route path="ordenes" element={<ServiceOrderManagement />} />
        </Route>

        {/* Rutas protegidas para el usuario */}
        <Route
          path="/user"
          element={
            <UserRoute>
              <DashboardUser />
            </UserRoute>
          }
        >
          <Route path="profile" element={<ProfileForm />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="shopping-cart" element={<ShoppingCart />} />
          <Route path="compras" element={<Purchases />} />
          <Route path="reservas" element={<UserBookings id_User={id_User} />} />
        </Route>

        {/* Otras rutas protegidas de usuario */}
        <Route
          path="/orderform"
          element={
            <UserRoute>
              <OrderForm />
            </UserRoute>
          }
        />
        <Route
          path="/bookingform"
          element={
            <UserRoute>
              <BookingForm />
            </UserRoute>
          }
        />
      </Routes>
    </CartProvider>
  );
}

export default App;
