import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/feature/CounterSlice";

function BasicExample({ products }) {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    const data = {
      items: [{ product: product, qty: 1 }], // Mengirim id produk dan qty (jumlah) sebagai objek dalam array items
    };

    dispatch(addToCart(data)); // Memanggil action creator addToCart dengan data produk yang akan ditambahkan ke keranjang
  };

  return (
    <div className="container mt-2 p-3">
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products.map((product) => (
          <div key={product._id} className="col">
            <Card className="h-100">
              <div
                style={{
                  height: "200px",
                  overflow: "hidden",
                }}
              >
                <Card.Img
                  variant="top"
                  src={`http://localhost:3000/${product.imageUrl}`}
                  style={{
                    maxHeight: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>

                <div>
                  {product.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="badge rounded-pill bg-secondary me-1"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <Card.Text>Rp. {product.price}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleAddToCart(product)}
                >
                  <FaShoppingCart /> Add to Cart
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BasicExample;
