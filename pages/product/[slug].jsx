import { useRouter } from "next/router";
import Link from 'next/link'
import styled from "styled-components";
import Layout from "../../components/Layout";
import { __prod__, urlServer } from "../../constant";

const EditProductButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;

  button {
    padding: 1rem 2rem;
    border: 1px solid var(--orange);
    color: var(--orange);
  }

  button:nth-child(2) {
    margin-left: 1rem;
    border: 1px solid var(--pink);
    color: var(--pink);
  }
`

const ProductWrapperStyles = styled.div`
  display: grid;
  grid-gap: 0 4rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  font-size: 1.6rem;

  .product-image {
    img {
      width: 100%;
      height: auto;
    }
  }

  .product-detail {
    line-height: 1.6;

    p {
      color: var(--orange);
      text-decoration: underline;
      cursor: pointer;
      margin: 0.5rem 0;
      font-size: 2rem;
    }

    .product-description {
      margin-top: 2rem;
      font-size: 1.6rem;
    }

    .product-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 2.4rem;

      & span:nth-child(2) {
        color: var(--orange);
      }
    }

    .cart {
      margin-top: 2rem;
      font-size: 1.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20rem;
      height: 4rem;
      border: 1px solid var(--orange);
      border-radius: 5px;
      color: var(--orange);
      cursor: pointer;
    }
  }
`;

const Product = ({ user, product }) => {
  const router = useRouter();

  const handlePageClick = async (id) => {
    const response = await fetch(
      `${urlServer}/addCart`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: id,
        }),
      }
    );

    if (response.status === 401) {
      router.push(`/login`);
    }

    const { error } = await response.json();
    if (!error) {
      router.push(`/cart`);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return

    if (window.confirm('Are you want to delete?')) {
      const response = await fetch(`${urlServer}/product`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ product_id: id })
      })
      await response.json()
      router.push(`/`)
    }
  }

  return (
    <Layout showBanner user={user}>
      <div className="container">
        {
          product.length && user ? (
            <EditProductButton>
              <Link href={`/edit-product/${product[0].slug}`}>
                <a>
                  <button type="button">Edit</button>
                </a>
              </Link>
              <button onClick={() => handleDelete(product[0].id)}>Delete</button>
            </EditProductButton>
          ) : null
        }
        <ProductWrapperStyles>
          {product.length ? (
            <>
              <div className="product-image">
                <img
                  src={product[0].feature_image}
                  alt={product[0].product_name}
                />
              </div>
              <div className="product-detail">
                <div className="product-header">
                  <span>{product[0].product_name}</span>
                  <span>
                    {product[0].sale_price
                      ? `$${product[0].sale_price}`
                      : `$${product[0].price}`}
                  </span>
                </div>
                <p>{product[0].category_name}</p>
                <div className="product-description">
                  {product[0].description}
                </div>
                <div
                  className="cart"
                  onClick={() => handlePageClick(product[0].id)}
                >
                  Add to cart
                </div>
              </div>
            </>
          ) : null}
        </ProductWrapperStyles>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query;
  const response = await fetch(
    `${urlServer}/product/${slug}`
  );
  const { result } = await response.json();
  return {
    props: {
      product: result,
    },
  };
};

export default Product;
