import React, { useEffect, useState } from "react";
import CustomNavbar from "../components/CustomNavbar";
import { jwtDecode } from "jwt-decode";
import Konfirmasi from "../components/Konfirmasi";

const Confirm = () => {
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
      <Konfirmasi />
    </>
  );
};

export default Confirm;
