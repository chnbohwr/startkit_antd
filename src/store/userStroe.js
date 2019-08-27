import React, { useState, createContext, useContext } from 'react';

const UserContext = createContext();

export const useUserStore = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
    const [userData, _setUserData] = useState({
      name: 'kai',
      age: 40,
    });
    const setUserData = (d) => _setUserData({...userData, ...d});
    return (
      <UserContext.Provider
        value={{
            userData,
            setUserData,
        }}
      >
        {children}
      </UserContext.Provider>
    );
};

export default UserContextProvider;
