import styled from "styled-components";
import ProductCard from "../components/ProductCard";
import Layout from "../components/Layout";
import { urlServer } from '../constant'

const ProductWrapperStyles = styled.div`
  display: grid;
  grid-gap: 1.6rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

  a {
    display: grid;
  }
`;

export default function Home({ products, user }) {
  return (
    <Layout showBanner user={user}>
      <div className="container">
        <ProductWrapperStyles>
          {products.length
            ? products.map((product) => {
              return (
                <ProductCard product={product} key={product.id} />
              )
            })
            : null}
        </ProductWrapperStyles>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const response = await fetch(`${urlServer}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ is_limit: true })
  });
  const { result } = await response.json();
  return {
    props: {
      products: result.products,
    },
  };
};
