import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { AudioContextProvider } from '../libs/audio';
import PageLayout, {
  HeaderLayout,
  MainLayout,
} from '../components/page-layout/page-layout';
import Header, { HeaderLogo, HeaderTitle } from '../components/header/header';
import MemoMusicIllustration from '../components/header/music-illustration';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const GlobalStyle = createGlobalStyle`
body {
  margin: 0px;
  font-family: 'Montserrat', sans-serif;
}
`;

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <AudioContextProvider>
        <Head>
          <title>Piano</title>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <PageLayout>
          <HeaderLayout>
            <Header>
              <HeaderLogo>
                <MemoMusicIllustration />
              </HeaderLogo>
              <HeaderTitle> Piano Application</HeaderTitle>
            </Header>
          </HeaderLayout>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </PageLayout>
      </AudioContextProvider>
    </>
  );
}

export default CustomApp;
