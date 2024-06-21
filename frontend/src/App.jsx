import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FormLogin from "./pages/FormLogin";
import FormRegister from "./pages/FormRegister";
import Cart from "./pages/Cart";
import store from "./redux/store";
import { Provider } from "react-redux";
import ProfilePage from "./pages/ProfilePage";
import Checkout from "./pages/Checkout";
import Confirm from "./pages/Confirm";
import Invoices from "./pages/Invoices";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<FormLogin />} />
          <Route path="/register" element={<FormRegister />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/invoice/:order_id" element={<Invoices />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
