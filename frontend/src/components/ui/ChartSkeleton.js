import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from './Skeleton';

const ChartSkeleton = ({ title, height, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      {title && (
        <div className="mb-4">
          <Skeleton type="title" />
        </div>
      )}
      <Skeleton type="chart" className={height} />
    </div>
  );
};

ChartSkeleton.propTypes = {
  title: PropTypes.bool,
  height: PropTypes.string,
  className: PropTypes.string
};

ChartSkeleton.defaultProps = {
  title: true,
  height: 'h-64',
  className: ''
};

export default ChartSkeleton; 