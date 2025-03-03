import React from 'react';
import html2canvas from 'html2canvas'; // Install with: npm install html2canvas

const ExportButton = ({ elementId, fileName = 'chart' }) => {
  const exportAsImage = () => {
    const element = document.getElementById(elementId);
    if (!element) return;

    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <button
      onClick={exportAsImage}
      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
    >
      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export PNG
    </button>
  );
};

export default ExportButton; 