import React, { createContext, useContext, useState } from 'react';

const SensorDataContext = createContext();

export const SensorDataProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState([]);

  const addSensorData = (newSensorData) => {
    setSensorData((prevData) => newSensorData);
  };

  return (
    <SensorDataContext.Provider value={{ sensorData, addSensorData }}>
      {children}
    </SensorDataContext.Provider>
  );
};

export const useSensorData = () => {
  const context = useContext(SensorDataContext);
  if (!context) {
    throw new Error('useSensorData must be used within a SensorDataProvider');
  }
  return context;
};
