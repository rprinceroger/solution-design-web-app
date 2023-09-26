import React, { useState, useEffect, useContext } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

import UserContext from "../UserContext";
import "../App.css";

export default function ProductView() {
  const { productId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    _id: "",
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    imageUrl: "",
  });

  const [quantity, setQuantity] = useState(1);

  const fetchProductDetails = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct({
          _id: data._id,
          name: data.name,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
          imageUrl: data.imageUrl, 
        });
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  };

  const handleAddToCart = async () => {
    if (user.id === null) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please log in to add items to your cart.",
      });
      return;
    }

    if (quantity <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: "Please select a valid quantity to add to your cart.",
      });
      return;
    }

    if (quantity > product.quantity) {
      Swal.fire({
        icon: "error",
        title: "Quantity Exceeds Availability",
        text: `The selected quantity exceeds the available quantity of ${product.name}.`,
      });
      return;
    }

    const cartItem = {
      productId: product._id,
      quantity: parseInt(quantity),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/myCart`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        fetch(`${process.env.REACT_APP_API_URL}/orders/addToCart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(cartItem),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "Product added to cart successfully") {
              Swal.fire({
                icon: "success",
                title: "Added to Cart",
                text: "The item has been added to your cart.",
              });

              navigate("/products");
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: data.error,
              });
            }
          })
          .catch((error) => {
            console.error("Error adding to cart:", error);
          });
      }
    } catch (error) {
      console.error("Error checking pending cart:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    } else {
      Swal.fire({
        icon: "error",
        title: "Maximum Quantity Reached",
        text: `You cannot add more than ${product.quantity} of this item to your cart.`,
      });
    }
  };

  return (
    <Container className="my-5">
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <Card className="mt-3 product-card">
            {/* Apply product-card style */}
            <Card.Body className="text-center">
              <Card.Title className="customCardTitle">
                {product.name}
              </Card.Title>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="productViewImage"
              />
              <Card.Subtitle>Description:</Card.Subtitle>
              <Card.Text>{product.description}</Card.Text>
              <Card.Subtitle>Price:</Card.Subtitle>
              <Card.Text>PhP {product.price}</Card.Text>
              <Card.Subtitle>Quantity:</Card.Subtitle>
              <div className="quantity-control">
                <Button
                  onClick={decreaseQuantity}
                  className="p-1"
                  variant="warning"
                >
                  -
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  max={product.quantity}
                  className="custom-quantity-input"
                />
                <Button
                  onClick={increaseQuantity}
                  className="p-1"
                  variant="info"
                >
                  +
                </Button>
              </div>
              <div className="text-center">
                {user.id !== null ? (
                  <>
                    <div className="mt-2">
                      <Button
                        className="customButton"
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </>
                ) : (
                  <p>
                    <em>Log in to add to cart.</em>
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
