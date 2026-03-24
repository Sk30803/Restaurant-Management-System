import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import Reservations from './pages/Reservations';
import Order from './pages/Order';
import Events from './pages/Events';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import { CartProvider } from './context/CartContext';

// Placeholders
const Placeholder = ({ title }) => (
  <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>Coming Soon</p>
  </div>
);

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="order" element={<Order />} />
            <Route path="events" element={<Events />} />
            <Route path="login" element={<Login />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="cart" element={<Placeholder title="Your Cart" />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="reservations" element={<Placeholder title="Manage Reservations" />} />
            <Route path="orders" element={<Placeholder title="Manage Orders" />} />
            <Route path="events" element={<Placeholder title="Manage Events" />} />
            <Route path="settings" element={<Placeholder title="Settings" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
