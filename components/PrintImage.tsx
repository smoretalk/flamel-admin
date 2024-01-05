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
          #print-root-visible { display: block; width: 100%; height: 100%; position: absolute; top: 0, left: 0 }
          
          #print-root-visible img {
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
        <img src="" alt=""/>
        <canvas id="qr"></canvas>
      </div>
    </div>
  );
};

export default PrintImage;
