import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import AppNavbar from "./components/AppNavbar";
import { UserProvider } from "./UserContext";
import Products from "./pages/Products";
import ProductView from "./pages/ProductView";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import AddProduct from "./pages/AddProduct";
import Profile from "./pages/Profile";
import MyCart from "./pages/MyCart";
import Error from "./pages/Error";
import AdminOrders from "./pages/AdminOrders";




import "./App.css";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
  });

  const unsetUser = () => {
    localStorage.clear();
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (typeof data._id !== "undefined") {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin,
          });
        } else {
          setUser({
            id: null,
            isAdmin: null,
          });
        }
      });
  }, []);

  return (
    <>
      <UserProvider value={{ user, setUser, unsetUser }}>
        <Router>
          <AppNavbar />
          <Container fluid>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products/:productId" element={<ProductView />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/addProduct" element={<AddProduct />} />
              <Route
                path="/myCart"
                element={
                  user.id !== null && !user.isAdmin ? (
                    <MyCart />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  user.id !== null && !user.isAdmin ? (
                    <Profile />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/orders"
                element={
                  user.isAdmin ? <AdminOrders /> : <Navigate to="/products" />
                }
              />
              <Route path="*" element={<Error />} />
            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
