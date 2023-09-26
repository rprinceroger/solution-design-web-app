import { useState, useEffect } from "react";
import { Table, Container, Image } from "react-bootstrap";

import EditProduct from "./EditProduct";
import ArchiveProduct from "./ArchiveProduct";
import "../App.css";

export default function AdminView({ productsData, fetchData }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsArr = productsData.map((product) => {
      return (
        <tr key={product.id}>
          <td>{product._id}</td>
          <td>{product.name}</td>
          <td>{product.description}</td>
          <td>{product.quantity}</td>
          <td className={product.isActive ? "text-success" : "text-danger"}>
            {product.isActive ? "Available" : "Unavailable"}
          </td>
          <td>
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                thumbnail
                className="productThumbnail" // Apply the custom class here
              />
            )}
          </td>
          <td>
            <EditProduct
              className="customButton"
              product={product}
              fetchData={fetchData}
            />
          </td>
          <td>
            <ArchiveProduct product={product} fetchData={fetchData} />
          </td>
        </tr>
      );
    });
    setProducts(productsArr);
  }, [productsData]);

  return (
    <>
      <Container>
        <h1 className="text-center my-3 bannerH1">Admin Dashboard</h1>
        <Table striped bordered hover responsive>
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Availability</th>
              <th>Image</th> {/* Update column header */}
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>{products}</tbody>
        </Table>
      </Container>
    </>
  );
}
