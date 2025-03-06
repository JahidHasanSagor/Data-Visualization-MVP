import React from 'react';
import PropTypes from 'prop-types';

const Skeleton = ({ type, count, className, ...rest }) => {
  const getSkeletonType = () => {
    switch (type) {
      case 'text':
        return 'h-4 rounded w-full';
      case 'title':
        return 'h-7 rounded w-3/4';
      case 'avatar':
        return 'h-12 w-12 rounded-full';
      case 'thumbnail':
        return 'h-24 w-24 rounded';
      case 'button':
        return 'h-10 rounded w-24';
      case 'card':
        return 'h-40 rounded w-full';
      case 'chart':
        return 'h-64 rounded w-full';
      default:
        return 'h-4 rounded w-full';
    }
  };
  
  const baseClasses = 'bg-gray-200 animate-pulse';
  const typeClasses = getSkeletonType();
  const customClasses = className || '';
  
  const renderSkeleton = () => {
    return (
      <div 
        className={`${baseClasses} ${typeClasses} ${customClasses}`}
        {...rest}
      />
    );
  };
  
  if (count === 1) {
    return renderSkeleton();
  }
  
  return (
    <div className="space-y-3">
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <div 
            key={index}
            className={`${baseClasses} ${typeClasses} ${customClasses}`}
            {...rest}
          />
        ))}
    </div>
  );
};

Skeleton.propTypes = {
  type: PropTypes.oneOf(['text', 'title', 'avatar', 'thumbnail', 'button', 'card', 'chart']),
  count: PropTypes.number,
  className: PropTypes.string
};

Skeleton.defaultProps = {
  type: 'text',
  count: 1,
  className: ''
};

export default Skeleton; 