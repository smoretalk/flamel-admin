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
            size: 86
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
    return (React.createElement("div", { id: "print-root" },
        React.createElement("style", { dangerouslySetInnerHTML: { __html: `
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
        ` } }),
        React.createElement("div", { id: "print-root-hide" },
            React.createElement("button", { onClick: printImage }, "\uD504\uB9B0\uD2B8"),
            React.createElement("button", { onClick: onClose }, "\uB2EB\uAE30")),
        React.createElement("div", { id: "print-root-visible" },
            React.createElement("img", { src: "https://flamel.app/api/collections/ces-image.png/theme", width: "100%", alt: "" }),
            React.createElement("img", { id: "print-image", src: record.params.link.replaceAll('users', 'admin'), style: { marginBottom: 16 }, alt: "\uC774\uBBF8\uC9C0" }),
            React.createElement("canvas", { id: "qr" }))));
};
export default PrintImage;
//# sourceMappingURL=PrintImage.js.map