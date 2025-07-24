import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavBar from "./component/navBar";
import ProductsPage from "./features/products/productsPage";
import UsersPage from "./features/users/usersPages";
import OrdersPage from "./features/orders/ordersPages"; // Sửa lỗi chính tả
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route
              path="*"
              element={
                <div className="text-center text-red-500">
                  404 - Page not found
                </div>
              }
            />
          </Routes>
        </div>
  
    </Router>
  );
}

export default App;
