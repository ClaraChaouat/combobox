import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function LoadingIndicator() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ height: 20, display: 'flex', alignItems: 'center' }}
    >
      <CircularProgress size={16} />
    </div>
  );
}
