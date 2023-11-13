// pages/TablePage.js
import React, { useEffect, useState } from 'react';
import TableComponent from '../components/TableComponent.js';

const TablePage = () => {
  const [data, setData] = useState([]);

  function generateSensorData() {
    const id_coletor = Math.floor(Math.random() * 1000);
    const id_sensor = Math.floor(Math.random() * 1000);
    const tipo_sensor = ['Temperatura'];
    const valor_sensor = Math.random() * 100;
    const timestamp = new Date().toISOString();
    const key = `${id_coletor}_${id_sensor}_${timestamp}`;

    return { id_coletor, id_sensor, tipo_sensor, valor_sensor, timestamp, key };
  }

  function generateColetorData() {
    const id_coletor = Math.floor(Math.random() * 1000);
    const data_inicio = new Date().toISOString();
    const local = 'Sala de Controle';
    const data_fim = null;

    return { id_coletor, data_inicio, local, data_fim };
  }

  function generateSensorTypeData() {
    const sensor_type = ['Temperatura'];
    const unidade_medida = '°C';

    return { sensor_type, unidade_medida };
  }

  useEffect(() => {
    const sensorData = generateSensorData();
    const coletorData = generateColetorData();
    const sensorTypeData = generateSensorTypeData();

    setData((prevData) => [...prevData, { ...sensorData, ...coletorData, ...sensorTypeData }]);
  }, [data]);

  return (
    <div>
      <TableComponent data={data} />
    </div>
  );
};

export default TablePage;
