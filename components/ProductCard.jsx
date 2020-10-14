import styled from "styled-components";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/router";
import { __prod__, urlClient, urlServer } from "../constant";

const ProductCardStyles = styled.div`
  font-size: 2rem;
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;

  img,
  .overlay {
    width: 100%;
    height: 100%;
  }

  .overlay {
    transition: all 0.4s;
    position: absolute;
    top: 0;
    z-index: 2;
    display: flex;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    color: var(--white);
  }

  .product-category {
    text-transform: uppercase;
    margin: 1rem;
  }

  .product-name {
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 1.5rem 1rem;
  }

  .cart {
    position: absolute;
    bottom: 0;
    right: 0;
    border: 1px solid var(--border);
    border-radius: 50%;
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem;
  }

  &:hover .overlay {
    opacity: 1;
  }
`;

const ProductCard = ({ product }) => {
  const router = useRouter();

  const handleClick = (slug) => {
    router.push(`${urlClient}/product/${slug}`);
  };

  const addToCart = async (event, productId) => {
    event.stopPropagation();
    const response = await fetch(
      `${urlServer}/addCart`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      }
    );

    if (response.status === 401) {
      router.push(`${urlClient}/login`);
    }

    const { error } = await response.json();
    if (!error) {
      router.push(`${urlClient}/cart`);
    }
  };

  return (
    <ProductCardStyles>
      <img src={product.feature_image} alt={product.product_name} />
      <div className="overlay" onClick={() => handleClick(product.slug)}>
        <div className="product-category">
          <span>{product.category_name}</span>
        </div>
        <div className="product-name">
          <span>{product.product_name}</span>
        </div>
        <div className="cart" onClick={(event) => addToCart(event, product.id)}>
          <FiShoppingCart />
        </div>
      </div>
    </ProductCardStyles>
  );
};

export default ProductCard;
