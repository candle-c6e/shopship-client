import styled from "styled-components";
import Navbar from "./Navbar";

const ContainerStyles = styled.div`
  @media (max-width: 1130px) {
    & {
      padding: 0 20px;
    }
  }
`

const ContentStyles = styled.div`
  padding: 5rem 0;
  min-height: 65vh;
`;

const Layout = ({ children, showBanner, user }) => {
  return (
    <ContainerStyles>
      <Navbar showBanner={showBanner} user={user} />
      <ContentStyles>{children}</ContentStyles>
    </ContainerStyles>
  );
};

export default Layout;
