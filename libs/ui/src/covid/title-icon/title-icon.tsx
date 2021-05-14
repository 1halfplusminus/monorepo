import React from 'react';
import styled, { css } from 'styled-components';
import tw from 'twin.macro';

/* eslint-disable-next-line */
export interface TitleIconProps {}

export const TitleIconIcon = styled.div`
  ${tw`h-10 w-10`}
`;
export const TitleIcon = styled.div`
  ${tw`bg-white p-1 text-lg text-center flex flex-row justify-center items-center gap-x-2`}
`;

export default TitleIcon;
