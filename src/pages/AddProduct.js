import { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Form, Button, Container, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import "../App.css";

import UserContext from "../UserContext";

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  function createProduct(e) {
    e.preventDefault();
    let token = localStorage.getItem("token");

    fetch(`${process.env.REACT_APP_API_URL}/products/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        imageUrl: imageUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data) {
          Swal.fire({
            icon: "success",
            title: "Product Added",
          });

          navigate("/products");
        } else {
          Swal.fire({
            icon: "error",
            title: "Could not create product",
            text: data.message,
          });
        }
      });

    setName("");
    setDescription("");
    setPrice(0);
    setQuantity(0);
    setImageUrl("");
  }

  return user.isAdmin === true ? (
    <>
      <h1 className="text-center my-5 bannerH1">Add New Product</h1>
      <Container>
        <Form onSubmit={(e) => createProduct(e)}>
          <Form.Group className="my-2">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="my-2">
            <Form.Label>Description:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="my-2">
            <Form.Label>Price:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Product Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="my-2">
            <Form.Label>Quantity:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Product Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="my-2">
            <Form.Label>Image URL:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </Form.Group>
          <Col className="d-flex justify-content-center ">
            <Button className="customButton my-3" type="submit">
              Submit
            </Button>
          </Col>
        </Form>
      </Container>
    </>
  ) : (
    <Navigate to="/products" />
  );
}
