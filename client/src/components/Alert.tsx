'use client';

import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-danger-400" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-primary-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200 text-success-800';
      case 'error':
        return 'bg-danger-50 border-danger-200 text-danger-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-primary-50 border-primary-200 text-primary-800';
    }
  };

  return (
    <div className={`rounded-md border p-4 ${getStyles()}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm">
            {message}
          </p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600"
              >
                <span className="sr-only">Fermer</span>
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;