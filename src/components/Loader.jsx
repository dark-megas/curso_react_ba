import React from 'react';
import CircularText from "../../@/components/CircularText.jsx";

function Loader({ message = 'Cargando...' }) {
    return (
        <div className="loader-container">
            <CircularText
                text={message}
                onHover="speedUp"
                spinDuration={20}
                className="text-black bg-gray-600 "
            />
        </div>
    );
}

export default Loader;

