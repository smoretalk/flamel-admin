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
            size: 225
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
        ` } }),
        React.createElement("div", { id: "print-root-hide" },
            React.createElement("button", { onClick: printImage }, "\uD504\uB9B0\uD2B8"),
            React.createElement("button", { onClick: onClose }, "\uB2EB\uAE30")),
        React.createElement("div", { id: "print-root-visible" },
            React.createElement("img", { src: "https://flamel.app/api/collections/flamel-logo.png/theme", width: 70, alt: "" }),
            React.createElement("img", { src: "https://flamel.app/api/collections/image-slogan.png/theme", width: 42, alt: "" }),
            React.createElement("img", { id: "print-image", src: record.params.link.replaceAll('users', 'admin'), alt: "\uC774\uBBF8\uC9C0" }),
            React.createElement("img", { src: "https://flamel.app/api/collections/CES2024.png/theme", width: 15, alt: "" }),
            React.createElement("canvas", { id: "qr" }))));
};
export default PrintImage;
//# sourceMappingURL=PrintImage.js.map