import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import "../styles/globals.css";
import { isServer, __prod__ } from "../constant";

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());


function MyApp({ Component, pageProps, user }) {
  return (
    <>
      <Component {...pageProps} user={user} />
    </>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  const url = __prod__ ? 'https://jjams.co/api/shopship/me' : 'http://localhost:4000/me'

  if (!isServer) {
    const response = await fetch(
      `${url}`,
      {
        credentials: "include",
      }
    );

    const { result } = await response.json();
    return {
      user: result,
    };
  }

  const { cookie } = ctx.req.headers;

  if (!cookie) {
    return {
      user: null,
    };
  } else {
    const response = await fetch(
      `${url}`,
      {
        credentials: "include",
        headers: {
          cookie,
        },
      }
    );
    const { result } = await response.json();
    return {
      user: result,
    };
  }
};

export default MyApp;
