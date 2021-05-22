import { Meta, Story } from '@storybook/react';
import React from 'react';
import { Header, HeaderLogo, HeaderProps, HeaderTitle } from './header';
import MemoMusicIllustration from './music-illustration';

export default {
  component: Header,
  title: 'Header',
} as Meta;

export const primary: Story<HeaderProps> = (props) => {
  return (
    <Header {...props}>
      <HeaderLogo>
        <MemoMusicIllustration />
      </HeaderLogo>
      <HeaderTitle> MY PIANO APP</HeaderTitle>
    </Header>
  );
};
