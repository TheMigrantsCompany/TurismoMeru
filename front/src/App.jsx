import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./views/home/Home";
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
import { UserManagement } from "./views/dashboardAdmin/dashAdminViews/UserManagement";
import { ReservationManagement } from "./views/dashboardAdmin/dashAdminViews/ReservationManagement";
import { ExcursionManagement } from "./views/dashboardAdmin/dashAdminViews/ExcursionManagement";
import { ReviewsManagement } from "./views/dashboardAdmin/dashAdminViews/ReviewManagement";
import { ServiceOrderManagement } from "./views/dashboardAdmin/dashAdminViews/ServiceOrderManagement";
import { CartProvider } from "./views/shopping-cart/CartContext";
import { AdminRoute, UserRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <CartProvider>
      <StickyNavbar />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id_Service" element={<Detail />} />

        {/* Rutas de administrador */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <DashboardAdmin />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="reservas" />} />
          <Route path="reservas" element={<ReservationManagement />} />
          <Route path="usuarios" element={<UserManagement />} />
          <Route path="excursiones" element={<ExcursionManagement />} />
          <Route path="reviews" element={<ReviewsManagement />} />
          <Route path="ordenes" element={<ServiceOrderManagement />} />
        </Route>

        {/* Rutas de usuario */}
        <Route
          path="/user"
          element={
            <UserRoute>
              <DashboardUser />
            </UserRoute>
          }
        >
          <Route index element={<Navigate to="profile" />} />
          <Route path="profile" element={<ProfileForm />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="compras" element={<Purchases />} />
        </Route>

        {/* Rutas adicionales de usuario */}
        <Route
          path="/user/shopping-cart"
          element={
            <UserRoute>
              <ShoppingCart />
            </UserRoute>
          }
        />
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
