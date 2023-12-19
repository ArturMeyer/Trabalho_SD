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
    // Inicialize a base de dados fixa
    if(sensorData.length == 0){
      const initialData = Array.from({ length: 3 }, (_, index) => generateColetorData(index));
      addSensorData(initialData);
    }

    const interval = setInterval(() => {
      // Percorra cada coletor
      for (let coletor of sensorData) {
        // Percorra cada sensor do coletor
        for (let sensor of coletor.sensores) {
          // Crie o novo elemento com valor aleatório e data atual
          const novoElemento = {
            valor: Math.random() * 100,
            data: new Date().toISOString(),
          };
          // Adicione o novo elemento na lista de valores do sensor
          setX(novoElemento)
          sensor.valores.push(novoElemento);
        }
        
      }
      // Atualize os dados do sensor
      addSensorData(sensorData);
    }, 2000);

    // Limpe o intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  }, [sensorData, x]);

  return (
    <div>
      <TableComponent data={sensorData} />
    </div>
  );
};

export default TablePage;
