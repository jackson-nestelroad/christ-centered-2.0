import React from 'react';

import { AppError } from '../util/error';
import './ShowAppError.scss';

interface ShowAppErrorProps {
  error: AppError;
}

function ShowAppError({ error }: ShowAppErrorProps) {
  return (
    <div className="app-error">
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  );
}

export default ShowAppError;
