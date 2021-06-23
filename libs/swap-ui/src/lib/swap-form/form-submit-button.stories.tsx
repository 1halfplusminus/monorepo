import React from 'react';
import { Meta, Story } from '@storybook/react';
import { none } from 'fp-ts/lib/Option';
import FormSubmitButton from './form-submit-button';
import { FormSubmitButtonProps, EnterAmountButton } from './form-submit-button';
import { some } from 'fp-ts/Option';
import { ETH } from '../__mocks__/tokens';

export default {
  component: FormSubmitButton,
  title: 'SwapForm/Components/SubmitButton',
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as Meta;

export const notConnected: Story<FormSubmitButtonProps> = (props) => {
  return <FormSubmitButton {...props} />;
};
notConnected.args = {
  connected: none,
};

export const connected: Story<FormSubmitButtonProps> = (props) => {
  return (
    <FormSubmitButton {...props}>
      <EnterAmountButton />
    </FormSubmitButton>
  );
};

connected.args = {
  connected: some(true),
};

export const loading: Story<FormSubmitButtonProps> = (props) => {
  return (
    <FormSubmitButton {...props}>
      <EnterAmountButton />
    </FormSubmitButton>
  );
};
loading.args = {
  connected: some(true),
  loading: some(true),
};
export const soldInsufficient: Story<FormSubmitButtonProps> = (props) => {
  return (
    <FormSubmitButton {...props}>
      <EnterAmountButton />
    </FormSubmitButton>
  );
};

soldInsufficient.args = {
  loading: some(false),
  connected: some(true),
  tokenA: some({ token: some(ETH), sold: some(10), amount: some(100) }),
};
export const soldOk: Story<FormSubmitButtonProps> = (props) => {
  return (
    <FormSubmitButton {...props}>
      <EnterAmountButton />
    </FormSubmitButton>
  );
};

soldOk.args = {
  loading: some(false),
  connected: some(true),
  tokenA: some({ token: some(ETH), sold: some(10), amount: some(1) }),
};
