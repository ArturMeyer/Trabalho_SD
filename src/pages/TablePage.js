// pages/TablePage.js
import React, { useEffect, useState } from 'react';
import TableComponent from '../components/TableComponent.js';
import { useSensorData } from '../SensorDataContext.js';

const TablePage = () => {
  const { sensorData, addSensorData } = useSensorData();
  const [x, setX] = useState()

  function generateSensorData(id_sensor) {
    const tipo_sensor = 'Temperatura';
    const valor = Math.random() * 100;
    const data = new Date().toISOString();

    return {
      id_sensor,
      tipo: tipo_sensor,
      valores: [
        {
          valor,
          data,
        },
      ],
    };
  }

  function generateColetorData(id_coletor) {
    const data_inicio = new Date().toISOString();
    const local = 'Sala de Controle';
    const status = 'Online'
    const data_fim = null;
    const sensores = Array.from({ length: 3 }, (_, index) => generateSensorData(index));

    return {
      id_coletor,
      data_inicio,
      local,
      data_fim,
      sensores,
      status
    };
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Substitua a URL abaixo pela URL real da sua API
        const response = await fetch('http://10.5.16.131:3000/collector');
        const data = await response.json();

        // Atualize os dados do sensor com os dados obtidos da API
        addSensorData(data);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };

    // Chame a função fetchData ao montar o componente
    fetchData();

    // Configure um intervalo para atualizar os dados a cada 2000 milissegundos
    const interval = setInterval(fetchData, 2000);

    // Limpe o intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  }, [sensorData]);

  return (
    <div>
      <TableComponent data={sensorData} />
    </div>
  );
};

export default TablePage;
