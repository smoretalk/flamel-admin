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
      size: 86
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
        #print-root-visible { position: absolute; top: 30px }
        #print-root-visible { display: flex; flex-direction: column; width: 100%; height: 100%; left: 0; align-items: center }
        @media print {
          #print-root-hide { display: none }
          #print-root-visible { top: 0 }
        }
        #print-image {
          position: absolute;
          top: 145px;
          width: 346px;
          height: 346px;
        }
        #print-root-visible canvas {
          position: absolute;
          bottom: 12px;
          right: 19px;
          width: 75px;
          height: 75px;
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
        <img src="https://flamel.app/api/collections/ces-image.png/theme" width="100%" alt=""/>
        <img id="print-image" src={record.params.link.replaceAll('users', 'admin')} style={{ marginBottom: 16 }} alt="이미지"/>
        <canvas id="qr"></canvas>
      </div>
    </div>
  );
};

export default PrintImage;
