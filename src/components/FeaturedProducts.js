import React, { useState, useEffect } from "react";
import { CardGroup, Container } from "react-bootstrap";
import PreviewProducts from "./PreviewProducts";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/`)
      .then((res) => res.json())
      .then((data) => {
        // Filter active products from the fetched data
        const activeProducts = data.filter((product) => product.isActive);

        // Process and format the data as needed
        // For example, randomize and select 5 featured products
        const randomProducts = getRandomProducts(activeProducts, 5);
        setFeaturedProducts(randomProducts);
      });
  }, []);

  const getRandomProducts = (products, count) => {
    const randomProducts = [];
    const productCount = products.length;

    while (
      randomProducts.length < count &&
      randomProducts.length < productCount
    ) {
      const randomIndex = Math.floor(Math.random() * productCount);
      const randomProduct = products[randomIndex];

      if (!randomProducts.includes(randomProduct)) {
        randomProducts.push(randomProduct);
      }
    }

    return randomProducts;
  };

  return (
    <>
      <Container>
        <h2 className="text-center featuredProductsH2">
          Check out these products!
        </h2>
        <CardGroup className="justify-content-center">
          {featuredProducts.map((product) => (
            <PreviewProducts data={product} key={product._id} breakPoint={2} />
          ))}
        </CardGroup>
      </Container>
    </>
  );
}
