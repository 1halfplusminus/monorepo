import styled from 'styled-components';
import tw from 'twin.macro';
import react from 'react';

export const StyledSwapSurface = styled.div`
  background-color: --surface-background-color;
  ${tw`bg-gray-900 p-2 flex flex-col gap-2`}
  position: relative;
`;

export default StyledSwapSurface;
