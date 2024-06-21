import { useState } from "react";
import { Button, FormGroup, Label, Input } from "reactstrap";
import { login } from "../utils/auth"; // Impor fungsi login dari auth.js
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ email, password });
      if (response.token) {
        localStorage.setItem("token", response.token);
        // Redirect ke halaman home setelah login sukses
        navigate("/");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Email atau password salah");
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
              <form onSubmit={handleLogin}>
                <h2 className="font-weight-bold mb-4">Login</h2>
                {error && <p className="text-danger mt-3">{error}</p>}
                <FormGroup>
                  <Label className="font-weight-bold mb-2">Email</Label>
                  <Input
                    className="mb-3"
                    type="email"
                    placeholder="Masukan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Label className="font-weight-bold mb-2">Password</Label>
                  <Input
                    className="mb-3"
                    type="password"
                    placeholder="Masukan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormGroup>
                <Button className="mt-3 btn-css" type="submit">
                  Login to your account
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
