import React from 'react';

export default function Loader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-border"></div>
    </div>
  );
}
