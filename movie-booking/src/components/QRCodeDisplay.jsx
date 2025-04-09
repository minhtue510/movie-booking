import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeDisplay = ({ value, size }) => {
  return (
    <div className="text-center text-sm">
      <QRCode value={value} size={size} />
    </div>
  );
};

export default QRCodeDisplay;
