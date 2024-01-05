import React, {FC, useEffect} from 'react';
import type { ActionProps } from 'adminjs';
import QRious from 'qrious';

const PrintImage: FC<ActionProps> = ({ record }) => {
  console.log('print record', record);
  const printImage = async () => {
    window.print();
  };

  useEffect(() => {
    const qr2 = new QRious({
      element: document.getElementById("qr"),
      size: 225
    });
    qr2.set({
      foreground: "white",
      background: "#171717",
      value: `https://flamel-global.framer.website/`
    });
  //   axios
  //     .create({
  //       baseURL: '/admin',
  //     })
  //     .request({
  //       url: `/api/resources/Image/records/${}/actions/exportCsv`,
  //       method: 'POST',
  //       params: {
  //         filter,
  //       },
  //     });
  }, []);

  const onClose = () => {
    history.back();
  };

  return (
    <div id="print-root">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          #print-root-hide { display: none }
          #print-root-visible { display: flex; width: 100%; height: 100%; position: absolute; top: 0, left: 0, justify-content: center }
          
          #print-img {
            width: 282px;
            height: 282px;
            top: 127px;
            left: 15px;
          }
          #print-root-visible canvas {
            width: 36px;
            height: 36px;
          }
        `}}
      />
      <div id="print-root-hide">
        <button onClick={printImage}>
          프린트
        </button>
        <button onClick={onClose}>닫기</button>
      </div>
      <div id="print-root-visible">
        <img src="https://flamel.app/api/collections/flamel-logo.png/theme" width={70} alt=""/>
        <img src="https://flamel.app/api/collections/image-slogan.png/theme" width={42} alt=""/>
        <img id="print-image" src={record.params.link.replaceAll('users', 'admin')} alt="이미지"/>
        <img src="https://flamel.app/api/collections/CES2024.png/theme" width={15} alt=""/>
        <canvas id="qr"></canvas>
      </div>
    </div>
  );
};

export default PrintImage;
