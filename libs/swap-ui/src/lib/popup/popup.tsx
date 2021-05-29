import React, { ReactNode, useState } from 'react';
import styles from 'styled-components';
import { Modal, Button } from 'antd';
import styled from 'styled-components';
import tw from 'twin.macro';

/* eslint-disable-next-line */
export interface PopupProps {
  renderButton?: (showModal: () => void) => ReactNode;
  title: string;
  children?: ReactNode;
}

const StyledModal = styled(Modal)`
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

export function Popup({ children, renderButton, title }: PopupProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {renderButton ? renderButton(showModal) : null}
      <StyledModal title={title} visible={isModalVisible} footer={null}>
        {children}
      </StyledModal>
    </>
  );
}

export default Popup;
