import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

import UserContext from "../UserContext";
import AdminView from "../components/AdminView";
import ProductCard from "../components/ProductCard";
import "../App.css";

export default function Products() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");

    if (storedUserRole) {
      user.setRole(storedUserRole);
    }

    fetchData();
  }, [user]);

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
    <Container className="my-5 p-5">
      {user.isAdmin ? (
        <AdminView productsData={products} fetchData={fetchData} />
      ) : (
        <>
          <h1 className="mt-5 text-center bannerH1">Products</h1>
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
