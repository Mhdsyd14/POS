import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Konfirmasi = () => {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrderData(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderData();
  }, []);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  const {
    _id,
    delivery_address: { detail, kabupaten, kecamatan, kelurahan, provinsi },
    delivery_fee,
    order_items,
  } = orderData;

  const subtotal = order_items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const total = subtotal + delivery_fee;
  console.log(orderData);
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Konfirmasi</h2>
      <div className="card border-primary">
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Detail</th>
                <th scope="col">Informasi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alamat</td>
                <td>
                  {detail}, {kelurahan}, {kecamatan}, {kabupaten}, {provinsi}
                </td>
              </tr>
              <tr>
                <td>Subtotal</td>
                <td>Rp {subtotal.toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td>Ongkir</td>
                <td>Rp {delivery_fee.toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>
                  <strong>Rp {total.toLocaleString("id-ID")}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-secondary">Sebelumnya</button>
            <Link to={`/invoice/${_id}`} className="btn btn-primary">
              Bayar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Konfirmasi;
