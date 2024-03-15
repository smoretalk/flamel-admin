import React, { useEffect } from 'react';
import QRious from 'qrious';
const PrintImage = ({ record }) => {
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
    };
    return (React.createElement("div", { id: "print-root" },
        React.createElement("style", { dangerouslySetInnerHTML: { __html: `
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
        ` } }),
        React.createElement("div", { id: "print-root-hide" },
            React.createElement("button", { onClick: printImage }, "\uD504\uB9B0\uD2B8"),
            React.createElement("button", { onClick: resizeCanvas }, "QR\uB9AC\uC0AC\uC774\uC988"),
            React.createElement("button", { onClick: onClose }, "\uB2EB\uAE30")),
        React.createElement("div", { id: "print-root-visible" },
            React.createElement("img", { src: "https://flamel.app/api/collections/ces-image.png/theme", width: "100%", alt: "" }),
            React.createElement("img", { id: "print-image", src: `/api/admin/images/${record.params.imageId}/binary`, alt: "\uC774\uBBF8\uC9C0" }),
            React.createElement("canvas", { id: "qr" }))));
};
export default PrintImage;
//# sourceMappingURL=PrintImage.js.map