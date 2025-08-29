import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './store/ProductContext';
import { AuthProvider } from './store/AuthContext';
import { OrderProvider } from './store/OrderContext';
import { ToastProvider } from './components/ui/Toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import { CartProvider } from './store/CartContext';

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <ProductProvider>
          <CartProvider>
            <ToastProvider>
              <Router>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route 
                        path="/cart" 
                        element={
                          <ProtectedRoute>
                            <Cart />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/orders" 
                        element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute requireAdmin={true}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/orders" 
                        element={
                          <ProtectedRoute requireAdmin={true}>
                            <AdminOrders />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="/categories" element={<ProductsPage />} />
                      <Route path="/about" element={<Home />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </ToastProvider>
          </CartProvider>
        </ProductProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;