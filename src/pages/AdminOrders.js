import React, { useState, useEffect } from "react";
import { Table, Container, Button, ListGroup } from "react-bootstrap";

const statusClasses = {
  pending: "danger",
  processing: "dark",
  packing: "warning",
  "in transit": "info",
  delivered: "success",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders when the component mounts
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    // Replace this with your actual fetch logic
    fetch(`${process.env.REACT_APP_API_URL}/orders/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched orders successfully:", data);
        setOrders(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  const updateOrderStatus = (orderId, currentStatus) => {
    const nextStatus =
      currentStatus === "delivered"
        ? "delivered"
        : Object.keys(statusClasses).findIndex(
            (status) => status === currentStatus
          ) + 1;

    // Ensure that the nextStatus is within bounds
    if (nextStatus < 0 || nextStatus >= Object.keys(statusClasses).length) {
      console.error("Invalid nextStatus:", nextStatus);
      return;
    }

    const nextStatusKey = Object.keys(statusClasses)[nextStatus];
    console.log("Updating order status to:", nextStatusKey);

    const token = localStorage.getItem("token"); // Get the user's token from localStorage

    fetch(
      `${process.env.REACT_APP_API_URL}/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newStatus: nextStatusKey }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((updatedOrder) => {
        console.log("Updated order successfully:", updatedOrder);
        fetchOrders();
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

  return (
    <Container className="my-5 p-5">
      <h1 className="text-center my-3 bannerH1">View User Orders</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Products</th> {/* New column for products */}
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.userId}</td>
              <td>{order.firstName}</td>
              <td>{order.lastName}</td>
              <td>
                <ListGroup>
                  {order.products.map((product) => (
                    <ListGroup.Item key={product.productId}>
                      {product.productName} - Quantity: {product.quantity}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </td>
              <td>
                {order.status === "delivered" ? (
                  <span className={`text-${statusClasses[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                ) : (
                  <Button
                    variant={`outline-${statusClasses[order.status]}`}
                    onClick={() => updateOrderStatus(order._id, order.status)}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
