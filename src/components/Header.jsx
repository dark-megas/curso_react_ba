import React, { useEffect } from 'react';

function Header({title}) {
    const fullTitle = title ? `${title} - PetStore Application` : 'PetStore Application';

    useEffect(() => {
        //cambiar el título de la página dinámicamente
        document.title = fullTitle;
    }, [fullTitle]);

    return (
        <header className="header"></header>
    );
}

export default Header;