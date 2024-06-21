import React from "react";
import Form from "react-bootstrap/Form";

const CategorySelect = ({ categories, onCategoryChange }) => {
  return (
    <div className="container-fluid mt-3">
      <Form.Group controlId="categorySelect" className="container">
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </div>
  );
};

export default CategorySelect;
