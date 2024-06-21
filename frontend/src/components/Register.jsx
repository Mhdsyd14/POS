// Register.js

import React, { useState } from "react";
import { Button, FormGroup, Label, Input } from "reactstrap";
import { registerUser } from "../utils/register";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [full_name, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await registerUser({ email, password, full_name });
      setSuccess("Registrasi berhasil!");
      setError("");
      navigate("/login");
    } catch (error) {
      setError("Registrasi gagal: " + (error.message || "Terjadi kesalahan"));
      setSuccess("");
      console.error("Registrasi gagal:", error);
    }
  };

  return (
    <>
      <div className="login-box">
        <div className="contan">
          <div className="row app-des">
            <div className="col left-background ">
              <h2>POS System</h2>
              <p>Created By Muhammad Irsyad</p>
            </div>
            <div className="col login">
              <form onSubmit={handleRegister}>
                <h2 className="font-weight-bold mb-4">Register</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
                <FormGroup>
                  <Label className="font-weight-bold mb-2">Full Name</Label>
                  <Input
                    className="mb-3"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={full_name}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Label className="font-weight-bold mb-2">Email</Label>
                  <Input
                    className="mb-3"
                    type="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Label className="font-weight-bold mb-2">Password</Label>
                  <Input
                    className="mb-3"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <Button type="submit" className="mt-3 btn-css">
                  Register to your account
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
