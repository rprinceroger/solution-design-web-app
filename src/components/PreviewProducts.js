import React from "react";
import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function PreviewProducts(props) {
  const { breakPoint, data } = props;
  const { _id, name, description, price, imageUrl } = data;

  return (
    <Col xs={12} md={breakPoint}>
      <Card className="cardHighlight mx-2 custom-card">
        <Card.Img
          variant="top"
          src={imageUrl}
          alt={name}
          className="productCardImage"
        />
        <Card.Body>
          <Card.Title className="text-center customCardTitle">
            <Link to={`/products/${_id}`}>{name}</Link>
          </Card.Title>
        </Card.Body>
        <Card.Footer>
          <h5 className="text-center">PhP {price}</h5>
          <Link
            className="btn btn-primary d-block customButton"
            to={`/products/${_id}`}
          >
            Details
          </Link>
        </Card.Footer>
      </Card>
    </Col>
  );
}
