import React from 'react';

function Loader({ message = 'Cargando...' }) {
    return (
        <div className="loader-container">
            <div className="loader-spinner"></div>
            <p className="loader-text">{message}</p>
        </div>
    );
}

export default Loader;

