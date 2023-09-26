import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Table, Button, Container, Alert } from "react-bootstrap";
import Swal from "sweetalert2";

import "../App.css";

export default function MyCart() {
  // Get the orderId from the URL parameters
  const { orderId } = useParams();

  // State variables to manage the cart, total amount, removed products, and navigation
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [removedProducts, setRemovedProducts] = useState([]);
  const navigate = useNavigate();

  // Function to fetch cart data from the server
  const fetchCartData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/myCart`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching user's pending cart");
      }

      const pendingCart = await response.json();

      if (pendingCart) {
        const cartProducts = await Promise.all(
          pendingCart.products.map(async (product) => {
            const productDetailsResponse = await fetch(
              `${process.env.REACT_APP_API_URL}/products/${product.productId}`
            );

            if (!productDetailsResponse.ok) {
              throw new Error(
                `Error fetching product details for ${product.productId}`
              );
            }

            const productDetails = await productDetailsResponse.json();
            const totalPrice = product.quantity * productDetails.price;

            return {
              ...product,
              price: productDetails.price,
              totalPrice: totalPrice,
            };
          })
        );

        const totalAmount = cartProducts.reduce(
          (total, product) => total + product.totalPrice,
          0
        );

        setCart(cartProducts);
        setTotalAmount(totalAmount);
      } else {
        setCart([]);
        setTotalAmount(0);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error fetching cart data. Please try again later.",
      });
    }
  };

  // Fetch cart data on component mount
  useEffect(() => {
    fetchCartData();
  }, []);

  // Function to start a new order
  const handleStartNewOrder = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/createOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify([]),
        }
      );

      if (!response.ok) {
        throw new Error("Error creating a new order");
      }

      setCart([]);
      setTotalAmount(0);
      navigate("/products");
    } catch (error) {
      console.error("Error starting a new order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error starting a new order. Please try again later.",
      });
    }
  };

  // Function to update the quantity of a cart item
  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        handleRemoveProduct(productId);
      } else {
        const updatedCart = cart.map((product) => {
          if (product.productId === productId) {
            return { ...product, quantity: newQuantity };
          }
          return product;
        });
        setCart(updatedCart);

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/orders/myCart`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              productId: productId,
              quantity: newQuantity,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error updating item quantity");
        }

        fetchCartData();
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating item quantity. Please try again later.",
      });
    }
  };

  // Function to handle the removal of a product from the cart
  const handleRemoveProduct = async (productId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/removeFromCart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error removing product from cart");
      }

      const responseData = await response.json();
      if (responseData.message === "Product removed from cart successfully") {
        setRemovedProducts([...removedProducts, productId]);

        const updatedCart = cart.filter(
          (product) => product.productId !== productId
        );
        setCart(updatedCart);
      } else {
        throw new Error(
          "Error removing product from cart: " + responseData.error
        );
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error removing product from cart. Please try again later.",
      });
    }
  };

  // Function to handle the checkout process
  const handleCheckout = async () => {
    try {
      // Make an API call to trigger the checkout process
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/checkout`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error checking out the order");
      }

      // If the checkout is successful, display a success message
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Order checked out successfully.",
      });

      // Clear the cart and navigate to the profile page
      setCart([]);
      setTotalAmount(0);
      navigate("/profile");
    } catch (error) {
      console.error("Error checking out the order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error checking out the order. Please try again later.",
      });
    }
  };

  return (
    <Container className="my-3">
      <h1 className="bannerH1 text-center my-3">My Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center">
          <Alert variant="secondary">
            Your cart is empty.{" "}
            {orderId ? (
              // If there's a pending order and the cart is empty, link to products
              <Link to="/products" className="empty-cart-link">
                Why not add something to your cart?
              </Link>
            ) : (
              // If there's no pending order, show "Start a new cart order" and handle the click event
              <Link
                to="/products"
                className="empty-cart-link"
                onClick={handleStartNewOrder}
              >
                Start a new cart order!
              </Link>
            )}
          </Alert>
          <Button className="customButton mt-1" onClick={handleStartNewOrder}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Quantity</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((product) => (
                <tr key={product.productId}>
                  <td>{product.productName}</td>
                  <td>
                    <Button
                      variant="light"
                      onClick={() =>
                        updateCartItemQuantity(
                          product.productId,
                          product.quantity - 1
                        )
                      }
                    >
                      -
                    </Button>
                    {product.quantity}
                    <Button
                      variant="light"
                      onClick={() =>
                        updateCartItemQuantity(
                          product.productId,
                          product.quantity + 1
                        )
                      }
                    >
                      +
                    </Button>
                  </td>
                  <td>PhP{product.quantity * product.price}</td>
                  <td>
                    {!removedProducts.includes(product.productId) && (
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveProduct(product.productId)}
                      >
                        Remove
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2"></td>
                <td>Total Amount</td>
                <td>PhP{totalAmount}</td>
              </tr>
            </tfoot>
          </Table>
          <div>
            <Button className="customButton" onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
