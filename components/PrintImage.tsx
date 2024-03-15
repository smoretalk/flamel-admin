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
      size: 92
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

  const resizeCanvas = () => {
    const size = parseInt(prompt('픽셀'));
    const qr2 = new QRious({
      element: document.getElementById("qr"),
      size,
    });
    qr2.set({
      foreground: "white",
      background: "#171717",
      value: `https://flamel-global.framer.website/`
    });
  }

  return (
    <div id="print-root">
      <style dangerouslySetInnerHTML={{__html: `
        #print-root-visible {
          position: absolute;
          top: 30px;
          display: flex;
          flex-direction: column;
          width: 384px;
          height: 576px;
          border: 1px solid black;
          left: 0;
          align-items: center
        }
        @media print {
          #print-root-hide { display: none }
          #print-root-visible { top: 0; border: none }
        }
        #print-image {
          position: absolute;
          top: 145px;
          width: 346px;
          height: 346px;
        }
        #print-root-visible canvas {
          position: absolute;
          bottom: 34px;
          right: 19px;
          width: 45px;
          height: 45px;
        }
        `}}
      />
      <div id="print-root-hide">
        <button onClick={printImage}>
          프린트
        </button>
        <button onClick={resizeCanvas}>QR리사이즈</button>
        <button onClick={onClose}>닫기</button>
      </div>
      <div id="print-root-visible">
        <img src="https://flamel.app/api/collections/ces-image.png/theme" width="100%" alt=""/>
        <img id="print-image" src={`/api/admin/images/${record.params.imageId}/binary`} alt="이미지"/>
        <canvas id="qr"></canvas>
      </div>
    </div>
  );
};

export default PrintImage;
