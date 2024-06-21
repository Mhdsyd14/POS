import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartData,
  updateCartQty,
  updateCartLocally,
} from "../redux/feature/CounterSlice";
import { Table, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const baseURL = "http://localhost:3000"; // URL base, ganti sesuai kebutuhan

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.counter.cart);
  const status = useSelector((state) => state.counter.status);
  const error = useSelector((state) => state.counter.error);
  const totalQty = useSelector((state) => state.counter.value);

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  const handleIncreaseQty = (product) => {
    const updatedProduct = { ...product, qty: +1 };
    const data = { items: [updatedProduct] };

    const updatedProductLokal = { ...product, qty: product.qty + 1 };
    const dataLokal = { items: [updatedProductLokal] };

    // Update state lokal sebelum mengirim permintaan
    dispatch(updateCartLocally(dataLokal));
    dispatch(updateCartQty(data));
  };

  const handleDecreaseQty = (product) => {
    if (product.qty > 1) {
      const updatedProduct = { ...product, qty: -1 };
      const data = { items: [updatedProduct] };

      const updatedProductLokal = { ...product, qty: product.qty - 1 };
      const dataLokal = { items: [updatedProductLokal] };

      // Update state lokal sebelum mengirim permintaan
      dispatch(updateCartLocally(dataLokal));
      dispatch(updateCartQty(data));
    }
  };

  if (status === "loading") {
    return <div>Loading</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <Container className="mt-3">
      <h1>Keranjang Belanja</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Gambar</th>
            <th>Nama Barang</th>
            <th>Harga</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td>
                <img
                  src={`${baseURL}/public/images/products/${item.image_url}`}
                  alt={item.name}
                  style={{ width: "100px" }}
                />
              </td>
              <td>{item.name}</td>
              <td>
                {parseFloat(item.price).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDecreaseQty(item)}
                >
                  -
                </Button>
                {item.qty}
                <Button
                  variant="success"
                  onClick={() => handleIncreaseQty(item)}
                >
                  +
                </Button>
              </td>
              <td>
                {parseFloat(
                  item.price * (item.qty ? item.qty : 0)
                ).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="text-right">
              <strong>Sub Total</strong>
            </td>
            <td>
              {cart
                .reduce(
                  (acc, item) =>
                    acc + parseFloat(item.price) * parseFloat(item.qty),
                  0
                )
                .toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
            </td>
          </tr>
          <tr>
            <td colSpan="4" className="text-right">
              <strong>Total Qty</strong>
            </td>
            <td>{totalQty}</td>
          </tr>
        </tfoot>
      </Table>
      <div className="container p-1 text-end mb-4">
        <Link to="/checkout" className="btn btn-primary w-100">
          Checkout
        </Link>
      </div>
    </Container>
  );
};

export default ShoppingCart;
