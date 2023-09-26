import { Link } from "react-router-dom"; // Import the Link component
import { Container, Row, Col, Card } from "react-bootstrap";
import "../App.css";

export default function Highlights() {
  return (
    <>
      <Container className="mx-3 my-3">
        <Row className="mx-5">
          <Col xs={12} md={4}>
            <Card className="storeHighlight">
              <Card.Body>
                <Card.Title>
                  <h2 className="homeH2">🍀 Embrace the Charm of Clover</h2>
                </Card.Title>
                <Card.Text>
                  Each product in our store is crafted with love and adorned
                  with the luck of a four-leaf clover. From cat stationery sets
                  to celestial space stickers and enchanting handicrafts, our
                  offerings are designed to bring a smile to your face.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="storeHighlight">
              <Card.Body>
                <Card.Title>
                  <h2 className="homeH2">🍯 Sweeten Your Day with Honey</h2>
                </Card.Title>
                <Card.Text>
                  Let the sweetness of honeycombs infuse your shopping
                  experience. Just like the industrious bees, we curate the
                  finest, most heartwarming items to brighten your day.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="storeHighlight">
              <Card.Body>
                <Card.Title>
                  <h2 className="homeH2">🌼 A Cozy Corner of Comfort</h2>
                </Card.Title>
                <Card.Text>
                  At Clover Bunbougu-ya, we believe in the power of small
                  comforts. Our store is a cozy haven where you can find solace
                  in the gentle embrace of cute aesthetics, warm colors, and a
                  touch of nostalgia.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mx-5 px-2">
          <Card className="storeHighlight">
            <Card.Body>
              <Card.Text>
                Explore our store, and let the magic of clover and honey
                transport you to a world where every purchase is a hug for your
                heart. Experience the joy of finding your next favorite thing,
                waiting to be discovered with love. At Clover Bunbougu-ya, every
                visit is an invitation to find comfort and happiness in the
                little things.
              </Card.Text>
              <Card.Text className="text-center">
                <Link to="/products" className="customLink">
                  🌟 Shop Now
                </Link>
              </Card.Text>
              <Card.Text className="text-center">
                ... and let your enchantment begin!
              </Card.Text>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </>
  );
}
