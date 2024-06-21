import React, { useEffect, useState } from "react";
import CustomNavbar from "../components/CustomNavbar";
import { useParams } from "react-router-dom";
import InvoicesCard from "../components/InvoicesCard";
import { jwtDecode } from "jwt-decode";

const Invoices = () => {
  const [user, setUser] = useState(null);
  const { order_id } = useParams();
  console.log(order_id);

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
      <InvoicesCard order_id={order_id} />
    </>
  );
};

export default Invoices;
