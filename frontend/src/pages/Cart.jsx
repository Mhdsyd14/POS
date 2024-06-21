import React, { useEffect, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";
import CustomNavbar from "../components/CustomNavbar";
import { jwtDecode } from "jwt-decode";

const Cart = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    }
  }, []);
  return (
    <>
      <CustomNavbar user={user} />
      <ShoppingCart />
    </>
  );
};

export default Cart;
