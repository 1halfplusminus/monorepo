import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import GlobalStyles from '../src/global-style';

export const decorators = [
  (Story) => (
    <React.StrictMode>
      <GlobalStyles />
      <Story />
    </React.StrictMode>
  ),
];
addDecorator(withKnobs);
