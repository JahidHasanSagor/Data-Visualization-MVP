import React, { useState, useRef, useEffect } from 'react';
import { exportAsCSV, exportAsJSON, exportAsExcel } from '../utils/exportData';

const ExportDropdown = ({ chartData, fileName = 'dashboard-data' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const prepareDataForExport = () => {
    if (!chartData) return [];

    const exportData = [];
    const metrics = ['revenue', 'clicks', 'conversions', 'performance'];

    // Get all unique dates from all metrics
    const allDates = new Set();
    metrics.forEach(metric => {
      if (chartData[metric]?.labels) {
        chartData[metric].labels.forEach(date => allDates.add(date));
      }
    });

    // Create a row for each date with all metrics
    Array.from(allDates).sort().forEach(date => {
      const row = { date };

      metrics.forEach(metric => {
        if (chartData[metric]?.datasets?.[0]?.data) {
          const dateIndex = chartData[metric].labels.indexOf(date);
          row[metric] = dateIndex >= 0 ? chartData[metric].datasets[0].data[dateIndex] : null;
        }
      });

      exportData.push(row);
    });

    // Add category distribution
    if (chartData.categories?.labels) {
      const categoryData = chartData.categories.labels.map((category, index) => ({
        category,
        count: chartData.categories.datasets[0].data[index]
      }));
      exportData.push({ date: '---Category Distribution---' });
      categoryData.forEach(item => {
        exportData.push({
          date: item.category,
          value: item.count
        });
      });
    }

    return exportData;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors flex items-center"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export Data
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => { exportAsCSV(prepareDataForExport(), fileName); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Export as CSV
            </button>
            <button
              onClick={() => { exportAsJSON(prepareDataForExport(), fileName); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Export as JSON
            </button>
            <button
              onClick={() => { exportAsExcel(prepareDataForExport(), fileName); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Export as Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown; 