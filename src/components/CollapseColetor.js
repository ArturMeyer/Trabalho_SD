import React from 'react';
import { Collapse } from 'antd';
import { useSensorData } from '../SensorDataContext.js';

const { Panel } = Collapse;

const CollectorSensorCollapse = ({ collectorId }) => {
  const { sensorData } = useSensorData();

  // Find the coletor data for the given collectorId
  const coletorData = sensorData.find((data) => data.coletor.id_coletor === collectorId)?.coletor;

  // Extract the sensors array from coletorData
  const sensors = coletorData ? coletorData.sensores : [];

  const items = sensors.map((sensor, index) => ({
    key: index,
    label: `Coletor ${sensor.id_coletor}`,
    children: <p>{sensor.valor_sensor}</p>,
  }));



  return <Collapse items={items} defaultActiveKey={sensors.map((sensor) => sensor.key)} />;
};

export default CollectorSensorCollapse;
