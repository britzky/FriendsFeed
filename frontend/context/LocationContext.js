import React, { useState, useContext, createContext } from 'react'

const LocationContext = createContext();

export const useLocation = () => {
  return useContext(LocationContext);
}

export const LocationProvider = ({ children }) => {
    const [searchLocation, setSearchLocation] = useState("");

    return (
    <LocationContext.Provider value={{ searchLocation, setSearchLocation }}>
        {children}
    </LocationContext.Provider>
  )
}
