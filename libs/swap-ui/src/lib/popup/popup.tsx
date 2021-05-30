import React, { ReactNode } from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import tw from 'twin.macro';

/* eslint-disable-next-line */
export interface PopupProps {
  renderButton?: (showModal: () => void) => ReactNode;
  title: string;
  children?: ReactNode;
}

export const DarkModal = styled(Modal)`
  .anticon svg {
    ${tw`text-white`}
  }
  .ant-modal-title {
    ${tw`text-white`}
  }
  .ant-modal-content {
    ${tw`bg-gray-800`}
  }
  .ant-modal-header {
    ${tw`bg-gray-800`}
  }
`;
