import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/authentication/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import { AuthProvider } from "./context/Authcontext";
import DefaultRedirect from "./component/defaultredirect/Defaulredirect";
import AuthRoute from "./component/authroute/Authroute";
import Layout from "./component/layout/Layout";
import SignupForm from "./pages/authentication/signup/Signup";
import Forgetpassword from "./pages/authentication/forgetpassword/Forgetpassword";
import Nopage from "./pages/nopage/Nopage"; // ✅ Import your Nopage component
import Category from "./pages/category/Category";
import Products from "./pages/products/Products";
import Resetpassword from "./pages/authentication/forgetpassword/Resetpassword";
import Allusers from "./pages/allusers/Allusers";
import Subadminproducts from "./pages/products/Subadminproducts";
import AllProducts from "./pages/products/Allproducts";

const App = () => {

  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-center"
          autoClose={2000} // 2 seconds
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
        <Routes>

          <Route path="/" element={<DefaultRedirect />} />

          {/* Public routes */}

          <Route
            path="/login"
            element={
              <AuthRoute type="public">
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute type="public">
                <SignupForm />
              </AuthRoute>
            }
          />
          <Route
            path="/forgetpassword"
            element={
              <Forgetpassword />
            }
          />

          <Route
            path="/resetpassword"
            element={
              <Resetpassword />
            }
          />

          {/* Protected routes with Layout */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <AuthRoute type="protected">
                  <Dashboard />
                </AuthRoute>
              }
            />
            <Route path="/subadminproducts" element={
              <AuthRoute type="protected">
                <AllProducts />
              </AuthRoute>
            } />
            <Route
              path="/allusers"
              element={
                <AuthRoute type="protected">
                  <Allusers />
                </AuthRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <AuthRoute type="protected">
                  <Category />
                </AuthRoute>
              }
            />
            <Route
              path="/products"
              element={
                <AuthRoute type="protected">
                  <Products />
                </AuthRoute>
              }
            />
          </Route>

          {/* ✅ Catch-all route for 404 */}
          <Route path="*" element={<Nopage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
