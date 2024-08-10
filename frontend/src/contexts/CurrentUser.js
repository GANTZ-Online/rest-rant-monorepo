// import { createContext, useState, useEffect } from "react";

// export const CurrentUser = createContext();

// function CurrentUserProvider({ children }) {
//     const [currentUser, setCurrentUser] = useState(null);

//     useEffect(() => {
//         const getLoggedInUser = async () => {
//             try {
//                 let response = await fetch('http://localhost:5001/authentication/profile');
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 let user = await response.json();
//                 console.log('user', user)
//                 setCurrentUser(user);
//             } catch (error) {
//                 console.error('Error fetching user:', error);
//             }
//         };
//         getLoggedInUser();
//     }, []);

//     return (
//         <CurrentUser.Provider value={currentUser}>
//             {children}
//         </CurrentUser.Provider>
//     );
// }

// export default CurrentUserProvider;

import { createContext, useState, useEffect } from "react";

export const CurrentUser = createContext();

function CurrentUserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userId, setUserId] = useState(null); // State for userId

    useEffect(() => {
        // This could be replaced with the actual method of obtaining userId
        // For example, you might have a function getUserId() or it might be in auth state
        const fetchUserId = async () => {
            // Example: Assume we have a function to get the logged-in user's ID
            // const fetchedUserId = await getUserId();
            // setUserId(fetchedUserId);
            setUserId('exampleUserId'); // Replace with actual user ID logic
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const getLoggedInUser = async () => {
            if (!userId) return; // Ensure userId is available before fetching user profile

            try {
                let response = await fetch(`http://localhost:5001/authentication/profile?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                let user = await response.json();
                console.log('user', user);
                setCurrentUser(user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        getLoggedInUser();
    }, [userId]); // Fetch user data whenever userId changes

    return (
        <CurrentUser.Provider value={currentUser}>
            {children}
        </CurrentUser.Provider>
    );
}

export default CurrentUserProvider;