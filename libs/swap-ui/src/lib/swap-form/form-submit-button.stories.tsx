import React from 'react';
import { Meta, Story } from '@storybook/react';
import { none } from 'fp-ts/lib/Option';
import FormSubmitButton from './form-submit-button';
import { FormSubmitButtonProps, SwapButton } from './form-submit-button';
import { some } from 'fp-ts/Option';

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
      <SwapButton />
    </FormSubmitButton>
  );
};
connected.args = {
  connected: some(true),
};
