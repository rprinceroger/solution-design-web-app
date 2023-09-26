import React from "react";
import Banner from "../components/Banner";

import FeaturedProducts from "../components/FeaturedProducts";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function Home() {
  const bannerData = {
    title: "Welcome!",
    content: "We make your idea to a reality!",
    destination: "/products",
    label: "Shop Now",
  };

  return (
    <>
      <Container className="my-5 py-2">
        <Row className="d-md-flex d-none justify-content-center align-items-center">
          <Col md={7}>
            <Banner data={bannerData} />
            <h3>Other amazing content will be here soon!</h3>
            <Button href={bannerData.destination} variant="primary">
              {bannerData.label}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
