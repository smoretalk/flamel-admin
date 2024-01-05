import React, { FC } from 'react';
import type { ActionProps } from 'adminjs';

const PrintImage: FC<ActionProps> = ({ resource }) => {
  const printImage = async () => {
    window.print();
  };

  const onClose = () => {
    history.back();
  };

  return (
    <div>
      <button onClick={printImage}>
        프린트
      </button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default PrintImage;
