import { createContext, useState, useEffect } from "react";

export const CurrentUser = createContext();

function CurrentUserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const getLoggedInUser = async () => {
            try {
                let response = await fetch('http://localhost:5001/authentication/profile');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                let user = await response.json();
                console.log('user', user)
                setCurrentUser(user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        getLoggedInUser();
    }, []);

    return (
        <CurrentUser.Provider value={currentUser}>
            {children}
        </CurrentUser.Provider>
    );
}

export default CurrentUserProvider;
