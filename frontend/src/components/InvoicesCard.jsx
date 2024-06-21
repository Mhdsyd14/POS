import React, { useEffect, useState } from "react";
import axios from "axios";

const InvoicesCard = ({ order_id }) => {
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/invoices/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInvoiceData(response.data.data);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    fetchInvoiceData();
  }, [order_id]);

  if (!invoiceData) {
    return <div>Loading...</div>;
  }

  const { total, sub_total, delivery_fee, user, delivery_address, order } =
    invoiceData;

  const { status, order_number } = order;
  console.log(invoiceData);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Invoice</h2>
      <div className="card border-primary">
        <div className="card-body">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>Status</td>
                <td>{status}</td>
              </tr>
              <tr>
                <td>Order ID</td>
                <td>{order_number}</td>
              </tr>
              <tr>
                <td>Total Amount</td>
                <td>Rp {total.toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td>Sub Total</td>
                <td>Rp {sub_total.toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td>Delivery Fee</td>
                <td>Rp {delivery_fee.toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td>Billed To</td>
                <td>
                  {user.full_name} ({user.email})
                </td>
              </tr>
              <tr>
                <td>Delivery Address</td>
                <td>
                  {delivery_address.detail}, {delivery_address.kelurahan},{" "}
                  {delivery_address.kecamatan}, {delivery_address.kabupaten},{" "}
                  {delivery_address.provinsi}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoicesCard;
