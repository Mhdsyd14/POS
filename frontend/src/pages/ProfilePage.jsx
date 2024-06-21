import React, { useEffect, useState } from "react";
import axios from "axios";
import Profile from "../components/Profile";
import OrderInfo from "../components/OrderInfo";
import Address from "../components/Address";
import CustomNavbar from "../components/CustomNavbar";
import { jwtDecode } from "jwt-decode";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/delivery-addresses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAddresses(response.data.data);
        })
        .catch((error) => {
          console.error("Failed to fetch addresses:", error);
        });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOrders(response.data.data);
        })
        .catch((error) => {
          console.error("Failed to fetch orders:", error);
        });
    }
  }, []);
  console.log(orders);

  return (
    <>
      <CustomNavbar user={user} />
      <div className="container mt-5">
        <h1 className="mb-4">Account</h1>
        <Profile user={user} />
        <OrderInfo orders={orders} />
        <Address addresses={addresses} />
      </div>
    </>
  );
};

export default ProfilePage;
