import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";

export default function Banner({ data }) {
  console.log(data);

  const { title, content, destination, label } = data;

  return (
    <Row>
      <Col className="p-5">
        <h1 className="bannerH1">{title}</h1>
        <p className="mb-4">{content}</p>
        <Link className="customLink" id="shopButton" to={destination}>
          {label}
        </Link>
      </Col>
    </Row>
  );
}
