import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "../App.css";


export default function ProductCard({ productProp }) {
  const { _id, name, price, imageUrl } = productProp;
  return (
    <>
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Card className="mt-3 productCard">
              <Link to={`/products/${_id}`}>
                <Card.Img src={imageUrl} alt={name} />
              </Link>
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle>Price:</Card.Subtitle>
                <Card.Text>PhP {price}</Card.Text>
                <div className="text-center">
                  <Link to={`/products/${_id}`} className="customLink">
                    View Details
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

ProductCard.propTypes = {
  productProp: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired, 
  }),
};
