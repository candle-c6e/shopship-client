import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTimesCircle } from "react-icons/fa";
import Layout from "../components/Layout";
import { __prod__ } from '../constant'

const CartStyles = styled.div`
  table {
    border-collapse: collapse;
    width: 100%;
    text-align: center;
    font-size: 1.6rem;
  }

  tr,
  td {
    padding: 2rem;
    border: 1px solid var(--light-black);
  }

  img {
    width: 100%;
  }

  tfoot tr td {
    border: none;
  }

  .remove-cart {
    cursor: pointer;
    color: red;
    font-size: 2rem;
  }
`;

const Cart = ({ user }) => {
  const urlAPI = __prod__ ? 'https://jjams.co/api/shopship' : 'http://localhost:4000'
  const router = useRouter();
  const [cartItems, setCartItems] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const response = await fetch(
      `${urlAPI}/cart`,
      {
        credentials: "include",
      }
    );
    const { result } = await response.json();

    if (result.length || result.products.length) {
      setCartItems(result);
    } else {
      setCartItems(null);
    }
  };

  const handleRemove = async (productId) => {
    if (window.confirm("Are you want to remove?")) {
      const response = await fetch(
        `${urlAPI}/deleteCart`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_id: productId }),
        }
      );
      await response.json();
      fetchProduct();
      if (!cartItems) {
        router.push('/')
      }
    }
  };

  return (
    <Layout showBanner user={user}>
      <div className="container">
        <CartStyles>
          {cartItems && cartItems.products.length ? (
            <table>
              <thead>
                <tr>
                  <td width="10%">Image</td>
                  <td>Product Name</td>
                  <td>Quantity</td>
                  <td>Price</td>
                  <td>Remove</td>
                </tr>
              </thead>
              <tbody>
                {cartItems.products.map((product) => (
                  <>
                    <tr>
                      <td>
                        <img src={product.feature_image} />
                      </td>
                      <td>{product.product_name}</td>
                      <td>{product.quantity}</td>
                      <td>
                        {product.sale_price
                          ? `$${product.sale_price}`
                          : `$${product.price}`}
                      </td>
                      <td>
                        <div
                          className="remove-cart"
                          onClick={() => handleRemove(product.product_id)}
                        >
                          <FaTimesCircle />
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colSpan="2">total: ${cartItems.total_price}</td>
                </tr>
              </tfoot>
            </table>
          ) : (
              <h1>EMPTY</h1>
            )}
        </CartStyles>
      </div>
    </Layout>
  );
};

export default Cart;
