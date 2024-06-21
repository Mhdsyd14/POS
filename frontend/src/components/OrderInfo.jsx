import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const OrderInfo = ({ orders }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = (order) => {
    setCurrentOrder(order);
    setShowModal(true);
  };

  console.log(orders);

  return (
    <>
      <div className="table-responsive mb-4">
        <h2>Pemesanan</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.order_number}</td>
                <td>
                  {" "}
                  {/* Menampilkan total dari order_items */}
                  {order.order_items.reduce(
                    (total, item) => total + item.qty * item.price,
                    0
                  )}
                </td>
                <td>{order.status}</td>
                <td>
                  <Button variant="primary" onClick={() => handleShow(order)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {currentOrder && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th scope="row">Order ID</th>
                  <td>{currentOrder.order_number}</td>
                </tr>
                <tr>
                  <th scope="row">Status</th>
                  <td>{currentOrder.status}</td>
                </tr>
                <tr>
                  <th scope="row">Menu Items</th>
                  <td>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Makanan</th>
                          <th>Qty</th>
                          <th>Harga</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentOrder.order_items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.qty}</td>
                            <td>{item.price}</td>
                            <td>{item.qty * item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Total Harga</th>
                  <td>
                    {currentOrder.order_items.reduce(
                      (total, item) => total + item.qty * item.price,
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default OrderInfo;
