import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import Layout from "../../components/Layout";
import ProductCard from "../../components/ProductCard";
import { urlServer } from "../../constant";

const ProductWrapperStyles = styled.div`
  display: grid;
  grid-gap: 1.6rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  a {
    display: grid;
  }
`;

const ProductPagination = styled.div`
  margin-top: 2rem;

  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    font-size: 3rem;
    color: var(--orange);
  }

  li {
    display: flex;
    margin: 1.5rem;
    cursor: pointer;

    a {
      padding: 1rem 1.5rem;
    }

    &.active {
      background-color: var(--orange);
      color: var(--white);
    }
  }
`;

const Product = ({ user, products, totalPage }) => {
  const router = useRouter();

  const handlePageClick = (data) => {
    let selected = data.selected + 1;
    router.push(`/products/${selected}`);
  };

  return (
    <Layout showBanner user={user}>
      <div className="container">
        <ProductWrapperStyles>
          {products.length
            ? products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))
            : null}
        </ProductWrapperStyles>
        <ProductPagination>
          <ReactPaginate
            previousLabel={<AiOutlineArrowLeft />}
            nextLabel={<AiOutlineArrowRight />}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={totalPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </ProductPagination>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const { page } = ctx.query || 1;
  const response = await fetch(
    `${urlServer}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      page: isNaN(page) ? 1 : page,
    })
  },
  );
  const { result } = await response.json();
  return {
    props: {
      products: result.products,
      totalPage: result.total_page,
    },
  };
};

export default Product;
