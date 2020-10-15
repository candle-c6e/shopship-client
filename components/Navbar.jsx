import { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import { BsSearch } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRouter } from "next/router";
import { __prod__, urlClient, urlServer } from "../constant";

const NavStyles = styled.nav`
  height: 7rem;
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--black);
  border-bottom: 1px solid var(--border);

  .container {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .logo {
  }

  .menu {
    flex: 0 75%;
    list-style: none;
    display: flex;
    text-transform: lowercase;
    align-items: center;

    a:not(:last-child) {
      margin-right: 2rem;
    }
  }

  .search {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    margin-right: 1.5rem;
    color: var(--border);

    svg {
      position: absolute;
      left: 0;
      margin: 1rem;
    }

    input {
      padding-left: 4rem;
    }
  }

  .product-wrapper {
    position: absolute;
    color: var(--black);
    margin-top: 0.5rem;
    width: 100%;
    z-index: 10;
  }

  .product-list {
    cursor: pointer;
    width: 100%;
    background: var(--white);
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--light-black);

    img {
      width: 4rem;
      height: 4rem;
    }

    .product-name {
      margin-left: 1rem;
    }
  }

  .cart {
    font-size: 2rem;
  }

  .hamburger {
    display: none;
    font-size: 3rem;
    flex: 1;
    justify-content: flex-end;
    cursor: pointer;
  }

  @media (max-width: 500px) {
    .menu {
      & {
        flex: 0 80%;
      }

      a:nth-child(2),
      a:nth-child(3),
      li:nth-child(3), 
      li:nth-child(4), 
      li:nth-child(5) {
        display: none;
      }
    }

    .hamburger {
      display: flex;
    }

    .search,
    .cart {
      display: none;
    }
  }

`;

const BannerStyles = styled.div`
  height: 33rem;
  width: 100%;
  background: ${__prod__ ? 'url("/shopship/banner.jpg")' : 'url("/banner.jpg")'};
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100%;
  object-fit: cover;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 300;

  p {
    font-size: 10rem;
    letter-spacing: 1.6rem;
    color: var(--white);
    z-index: 1;
  }

  &:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 700px) {
    & {
      height: 20rem;
    }

    p {
      font-size: 4rem; 
    }
  }

  @media (max-width: 400px) {
    p {
      font-size: 2rem; 
    }
  }
`;

const NavMobileStyles = styled.div`
  position: relative;
  z-index: 5;
  background-color: var(--white);
  width: 100%;
  font-size: 2rem;
  font-weight: 300;
  padding: 1rem 0;
  text-transform: lowercase;

  a {
    width: '100%'
  }

  ul {
    width: 100%;
    list-style: none;
  }

  li {
    border-bottom: 1px solid var(--border);
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 500px) {
    & {
      display: none;
    }
  }
`

const Navbar = ({ showBanner = false, user }) => {
  const [product, setProduct] = useState(null);
  const [isShowMobile, setIsShowMobile] = useState(false)
  const [textSearch, setTextSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (textSearch.length > 2) {
      fetchProduct();
    }
  }, [textSearch]);

  useEffect(() => {
    window.addEventListener("click", (event) => {
      if (event) {
        setProduct(null);
      }
    });
  }, []);

  const fetchProduct = async () => {
    const response = await fetch(
      `${urlServer}/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text_search: textSearch }),
      }
    );
    const { result } = await response.json();
    setProduct(result);
  };

  const handleClickProduct = (slug) => {
    setProduct(null);
    router.push(`${urlClient}/product/${slug}`);
  };

  const logout = async () => {
    const response = await fetch(
      `${urlServer}/logout`,
      {
        credentials: "include",
        method: "POST",
      }
    );
    await response.json();
    router.push(`${urlClient}`);
  };

  return (
    <>
      <NavStyles>
        <div className="container">
          <ul className="menu">
            <Link href={`${urlClient}/`}>
              <a>
                <li>Home</li>
              </a>
            </Link>
            <Link href={`${urlClient}/products/1`}>
              <a>
                <li>Product</li>
              </a>
            </Link>
            {user ? (
              <>
                <li>{user}</li>
                <li
                  style={{ cursor: "pointer", marginLeft: "1.5rem" }}
                  onClick={logout}
                >
                  Logout
                </li>
                <Link href={`${urlClient}/add-product`}>
                  <a>
                    <button style={{ cursor: "pointer", marginLeft: "1.5rem", padding: '1rem' }}>Add Product</button>
                  </a>
                </Link>
              </>
            ) : (
                <Link href={`${urlClient}/login`}>
                  <a>
                    <li>Login</li>
                  </a>
                </Link>
              )}
          </ul>
          <div style={{ position: "relative" }}>
            <div className="search">
              <BsSearch />
              <input
                onChange={() => setTextSearch(event.target.value)}
                value={textSearch}
                type="text"
                placeholder="Search"
              />
            </div>
            <div className="product-wrapper">
              {product
                ? product.map((item) => (
                  <div
                    className="product-list"
                    key={item.slug}
                    onClick={() => handleClickProduct(item.slug)}
                  >
                    <div className="product-image">
                      <img src={item.feature_image} alt={item.product_name} />
                    </div>
                    <div className="product-name">{item.product_name}</div>
                  </div>
                ))
                : null}
            </div>
          </div>
          <Link href={`${urlClient}/cart`}>
            <a>
              <div className="cart">
                <AiOutlineShoppingCart />
              </div>
            </a>
          </Link>
          <div className="hamburger" onClick={() => setIsShowMobile(!isShowMobile)}>
            <GiHamburgerMenu />
          </div>
        </div>
      </NavStyles>
      <NavMobileStyles style={{ display: isShowMobile ? 'flex' : 'none' }}>
        <ul className="menu">
          <Link href={`${urlClient}/products/1`}>
            <a>
              <li>Product</li>
            </a>
          </Link>
          <Link href={`${urlClient}/cart`}>
            <a>
              <li>Cart</li>
            </a>
          </Link>
          {user ? (
            <>
              <li
                style={{ cursor: "pointer" }}
                onClick={logout}
              >
                Logout
            </li>
            </>
          ) : (
              <Link href={`${urlClient}/login`}>
                <a>
                  <li>Login</li>
                </a>
              </Link>
            )}
        </ul>
      </NavMobileStyles>
      <BannerStyles style={{ display: showBanner ? "flex" : "none" }}>
        <p>SHOPSHIP</p>
      </BannerStyles>
    </>
  );
};

export default Navbar;
