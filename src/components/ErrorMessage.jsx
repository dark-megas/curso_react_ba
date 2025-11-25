import React from 'react';

function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Error al cargar los datos</h3>
            <p className="error-message">{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn-retry">
                    Reintentar
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;

