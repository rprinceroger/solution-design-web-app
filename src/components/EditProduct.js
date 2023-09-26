import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function EditProduct({ product, fetchData }) {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Add imageUrl state

  const [showEdit, setShowEdit] = useState(false);

  const openEdit = (productId) => {
    // Fetch product details based on productId and populate the form fields
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProductId(data._id);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setQuantity(data.quantity);
        setImageUrl(data.imageUrl); // Set imageUrl from fetched data
        console.log(imageUrl); // Check if imageUrl is correctly set
      });

    setShowEdit(true);
  };

  const closeEdit = () => {
    setShowEdit(false);
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setImageUrl(""); // Clear imageUrl when closing the modal
  };

  const editProduct = (e, productId) => {
    e.preventDefault();

    console.log(imageUrl); // Check if imageUrl is correctly set

    fetch(
      `${process.env.REACT_APP_API_URL}/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: name,
          description: description,
          price: price,
          quantity: quantity,
          imageUrl: imageUrl, // Include imageUrl in the request body
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Check the response from the backend
        if (data === true) {
          Swal.fire({
            title: "Success!",
            icon: "success",
            text: "Product Successfully Updated",
          });
          closeEdit();
          fetchData();
        } else {
          Swal.fire({
            title: "Error!",
            icon: "error",
            text: "Please try again",
          });
          closeEdit();
          fetchData();
        }
      });
  };

  return (
    <>
      <Button
        className="customButton"
        size="sm"
        onClick={() => openEdit(product._id)}
      >
        Edit
      </Button>

      {/* Edit Modal Form */}
      <Modal show={showEdit} onHide={closeEdit}>
        <Form onSubmit={(e) => editProduct(e, productId)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </Form.Group>

            {/* Add input field for imageUrl */}
            <Form.Group>
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={imageUrl} // Bind the imageUrl value
                onChange={(e) => setImageUrl(e.target.value)} // Update imageUrl state
                required
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeEdit}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
