import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { GlobalStyles } from '@halfoneplusminus/ui';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles />
      <Head>
        <title>Welcome to covid-dashboard!</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default CustomApp;
