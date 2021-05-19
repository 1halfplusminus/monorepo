import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { AudioContextProvider } from '../libs/audio';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <AudioContextProvider>
      <Head>
        <title>Piano</title>
      </Head>
      <div className="app">
        <header className="flex">
          <h1>Welcome to piano-app!</h1>
        </header>
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </AudioContextProvider>
  );
}

export default CustomApp;