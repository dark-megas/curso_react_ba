import React, { useEffect } from 'react';

function Header({title}) {
    const fullTitle = title ? `${title} - PetStore Application` : 'PetStore Application';

    useEffect(() => {
        document.title = fullTitle;
    }, [fullTitle]);

    return (
        <header className="header"></header>
    );
}

export default Header;