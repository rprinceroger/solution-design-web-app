import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import UserContext from "../UserContext";
import AdminView from "../components/AdminView";
import ProductCard from "../components/ProductCard";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../App.css";

export default function Products() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fix: Issue where admin only sees active products upon page refresh
  useEffect(() => {
    // Check if the user's role is available in local storage
    const storedUserRole = localStorage.getItem("userRole");

    if (storedUserRole) {
      // If available, set the user role from local storage
      user.setRole(storedUserRole);
    }

    fetchData();
  }, [user]); // Re-fetch data whenever the user role changes

  const fetchData = () => {
    const url = user.isAdmin
      ? `${process.env.REACT_APP_API_URL}/products/all`
      : `${process.env.REACT_APP_API_URL}/products`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
      });
  };

  const handleSearch = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productName: searchTerm }),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error searching products:", error);
      });
  };

  return (
    <Container className="my-5">
      {user.isAdmin ? ( // Check if the user is an admin
        <AdminView productsData={products} fetchData={fetchData} />
      ) : (
        // Render product cards and search bar for non-admin users
        <>
          <h1 className="mt-5 text-center bannerH1">Our Catalogue</h1>
          <div className="d-flex flex-row justify-content-center">
            <Row>
              <Col md={8}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Search product name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Button
                  variant="primary"
                  className="customButton"
                  onClick={handleSearch}
                >
                  Go
                </Button>
              </Col>
            </Row>
          </div>
          <Row>
            {products.map((product) => (
              <Col key={product._id} md={4}>
                <ProductCard productProp={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}
