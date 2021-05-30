import { useState } from 'react';

export const useModal = () => {
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

  return {
    showModal,
    handleOk,
    handleCancel,
    isModalVisible,
  };
};
