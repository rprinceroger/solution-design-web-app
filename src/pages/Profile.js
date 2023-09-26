import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Table, ListGroup } from "react-bootstrap";
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";
import UpdateProfileModal from "../components/UpdateProfile";
import "../App.css";

export default function Profile() {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState({});
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    fetchProfileData();
    fetchUserOrders(); // Fetch user's orders
  }, []);

  const fetchProfileData = () => {
    fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          setDetails(data);
        }
      });
  };

  const fetchUserOrders = () => {
    try {
      fetch(`${process.env.REACT_APP_API_URL}/orders/myOrders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Network response was not ok: ${res.status} - ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => {
          console.log("User orders data:", data);

          // Sort orders by purchasedOn field in descending order (most recent first)
          data.sort(
            (a, b) => new Date(b.purchasedOn) - new Date(a.purchasedOn)
          );

          // Filter orders based on status
          const orderHistory = data.filter(
            (order) => order.status !== "pending" && order.status !== "packing"
          );
          const pendingOrders = data.filter(
            (order) => order.status === "pending"
          );
          const packingOrders = data.filter(
            (order) => order.status === "packing"
          );

          // Combine all orders for display
          const allOrders = [
            ...pendingOrders,
            ...packingOrders,
            ...orderHistory,
          ];

          setUserOrders(allOrders);
        })
        .catch((error) => {
          console.error("Error fetching user orders:", error.message);
        });
    } catch (error) {
      console.error("Error in fetchUserOrders:", error.message);
    }
  };

  function getStatusColor(status) {
    switch (status.toLowerCase()) {
      case "processing":
        return "#f6ae2d";
      case "packing":
        return "#f26419";
      case "in transit":
        return "#736f4e";
      case "delivered":
        return "#3b3923";
      default:
        return "black"; // Default color if status doesn't match
    }
  }

  return user.id ? (
    <>
      <Row>
        <Col md={12} className="text-center bg-secondary">
          <h1 className="my-3 profileH1">User Profile</h1>
        </Col>
        <Col md={6} className="p-5 text-dark">
          <h2 className="mt-3 profileDetailsH2">{`${details.firstName} ${details.lastName}`}</h2>

          <h4>Profile Details</h4>
          <ListGroup className="my-2">
            <ListGroup.Item action variant="secondary">
              Email: {details.email}
            </ListGroup.Item>
            <ListGroup.Item action variant="secondary">
              Mobile No: {details.mobileNo}
            </ListGroup.Item>
            {details.address && ( // Check if address exists
              <ListGroup.Item action variant="secondary">
                Address: {details.address}
              </ListGroup.Item>
            )}
          </ListGroup>
          <UpdateProfileModal user={user} fetchProfileData={fetchProfileData} />
        </Col>
        <Col md={6} className="p-5">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <h2 className="profileDetailsH2">Order History</h2>
            <div className="orderHistory">
              {userOrders.map((order) => (
                <Card key={order._id} className="mb-3">
                  <Card.Header className="custom-card-header">
                    Order ID: {order._id}
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>
                      Total Amount: PhP {order.totalAmount}
                    </Card.Title>
                    <Card.Text>
                      <div>
                        Status:{" "}
                        <span
                          className={`status-${order.status}`}
                          style={{
                            fontWeight: "bold",
                            color: getStatusColor(order.status),
                          }}
                        >
                          {order.status
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                      <Table responsive bordered>
                        <tbody>
                          {order.products.map((product) => (
                            <tr key={product.productId}>
                              <td>{product.productName}</td>
                              <td>Quantity: {product.quantity}</td>
                              {/* Remove quantity input and delete button */}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </>
  ) : (
    <Navigate to="/login" />
  );
}
