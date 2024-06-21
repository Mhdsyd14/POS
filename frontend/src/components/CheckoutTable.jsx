import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CheckoutTable() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3000/api/delivery-addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setItems(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const handleSelect = (id) => {
    setSelected(id);

    const selectedItem = items.find((item) => item._id === id);
    console.log(selectedItem);
    if (selectedItem) {
      setDeliveryAddress(selectedItem);
    }
    setDeliveryFee(25000);
    console.log(deliveryFee);
  };

  const handlePlaceOrder = () => {
    const token = localStorage.getItem("token");

    // Prepare data for the POST request
    const orderData = {
      delivery_fee: deliveryFee,
      delivery_address: deliveryAddress,
    };

    axios
      .post("http://localhost:3000/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Order placed successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout</h2>
      <div className="card border-primary">
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Select</th>
                <th scope="col">Name</th>
                <th scope="col">Detail</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item._id}
                  className={selected === item._id ? "table-primary" : ""}
                  onClick={() => handleSelect(item.id)}
                >
                  <td>
                    <input
                      type="radio"
                      name="selectedItem"
                      value={item._id}
                      checked={selected === item._id}
                      onChange={() => handleSelect(item._id)}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-end mt-3">
            <Link
              to="/confirm"
              className="btn btn-primary me-3"
              disabled={!selected}
              onClick={handlePlaceOrder}
            >
              Place Order
            </Link>
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutTable;
