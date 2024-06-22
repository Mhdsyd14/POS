import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Dropdown,
} from "react-bootstrap";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCartData } from "../redux/feature/CounterSlice";

const CustomNavbar = ({ onSearch, user }) => {
  const count = useSelector((state) => state.counter.value);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchQuery);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="container-fluid bg-dark-subtle text-primary-emphasis">
      <Navbar className="container" expand="lg">
        <Navbar.Brand onClick={() => navigate("/")}>POS System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="p-1 mt-1" id="basic-navbar-nav">
          <Nav className="mr-auto"></Nav>
          <Form onSubmit={handleSearch} className="d-flex gap-3 container">
            <FormControl
              type="text"
              placeholder="Search"
              className="mt-1"
              value={searchQuery}
              onChange={handleInputChange}
            />
            <Button type="submit" variant="secondary" className="mt-1">
              <FaSearch />
            </Button>
          </Form>
          <Nav className="d-flex flex-row gap-2 mt-1 align-items-center">
            <Nav.Link
              className="d-flex align-items-center"
              onClick={() => navigate("/cart")}
            >
              <span className="badge rounded-pill bg-secondary">{count}</span>
              <FaShoppingCart size="1.8em" className="ms-1" />
            </Nav.Link>
            {user ? (
              <Dropdown>
                <Dropdown.Toggle
                  as={Nav.Link}
                  id="dropdown-user"
                  className="d-flex align-items-center"
                >
                  <FaUser size="1.8em" />
                </Dropdown.Toggle>
                <Dropdown.Menu align="right">
                  <Dropdown.Item onClick={() => navigate("/profile")}>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Dropdown>
                <Dropdown.Toggle
                  as={Nav.Link}
                  id="dropdown-user"
                  className="d-flex align-items-center"
                >
                  <FaUser size="1.8em" />
                </Dropdown.Toggle>
                <Dropdown.Menu align="right">
                  <Dropdown.Item onClick={() => navigate("/login")}>
                    Login
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/register")}>
                    Register
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;
