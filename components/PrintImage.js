import React from 'react';
const PrintImage = ({ resource }) => {
    const printImage = async () => {
        window.print();
    };
    const onClose = () => {
        history.back();
    };
    return (React.createElement("div", null,
        React.createElement("button", { onClick: printImage }, "\uD504\uB9B0\uD2B8"),
        React.createElement("button", { onClick: onClose }, "\uB2EB\uAE30")));
};
export default PrintImage;
//# sourceMappingURL=PrintImage.js.map