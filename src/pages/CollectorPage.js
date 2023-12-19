import React, { useEffect, useState } from 'react';
import { Descriptions, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import { useSensorData } from '../SensorDataContext';

const CollectorPage = () => {
  const { id } = useParams();
  const { sensorData } = useSensorData();

  const collector = sensorData.find((c) => c.id_coletor === Number(id));

  const [sensorChartData, setSensorChartData] = useState({});

  useEffect(() => {
    // Inicialize o estado com os dados de todos os sensores
    if (collector && collector.sensores.length > 0) {
      const initialData = {};
      collector.sensores.forEach((sensor) => {
        initialData[sensor.id_sensor] = sensor.valores;
      });
      setSensorChartData(initialData);
    }
  }, [collector]);

  useEffect(() => {
    // Atualize o gráfico do sensor correspondente a cada 2000 milissegundos
    const intervalId = setInterval(async () => {
      // Para fins de demonstração, vamos gerar dados fictícios para cada sensor
      if (collector && collector.sensores.length > 0) {
        const newData = { ...sensorChartData };
        collector.sensores.forEach((sensor) => {
          const newDataPoint = {
            valor: Math.random() * 100, // Substitua isso pelo valor real do sensor
            data: new Date().toISOString(),
          };
          newData[sensor.id_sensor] = [...newData[sensor.id_sensor], newDataPoint];
        });
        setSensorChartData(newData);
      }
    }, 2000);

    // Limpe o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [sensorChartData, collector]);

const drawChart = (sensorId) => {
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  d3.select(`#sensor-chart-${sensorId}`).selectAll('*').remove();

  // Verifique se sensorChartData[sensorId] está definido
  if (!sensorChartData[sensorId]) {
    return;
  }

  const svg = d3
    .select(`#sensor-chart-${sensorId}`)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ');
  const formatDate = d3.timeFormat('%H:%M:%S');

  // Aqui adicionamos uma verificação de nulidade para sensorChartData[sensorId]
  const data = sensorChartData[sensorId]?.map((d) => ({
    data: parseTime(d.data),
    temperatura: d.valor,
  })) || [];

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.data))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.temperatura)])
    .range([height, 0]);

  const line = d3
    .line()
    .x((d) => xScale(d.data))
    .y((d) => yScale(d.temperatura));

  // Adicione a linha ao gráfico
  svg.append('path')
    .data([data])
    .attr('d', line)
    .attr('stroke', 'black')
    .attr('stroke-width', 2);

  // Adicione rótulos ao gráfico, se necessário
  svg.append('text')
    .attr('transform', `translate(${width / 2},${height + margin.top + 10})`)
    .style('text-anchor', 'middle')
    .text('Horário');

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text(`Sensor ${sensorId} - Temperatura`);
};
  

  if (!collector) {
    return <div>Coletor não encontrado</div>;
  }

  return (
    <div>
      <h2>Coletor {id}</h2>
      <Descriptions bordered>
        <Descriptions.Item label="ID Coletor">{collector.id_coletor}</Descriptions.Item>
        <Descriptions.Item label="Data de Início">{collector.data_inicio}</Descriptions.Item>
        <Descriptions.Item label="Local">{collector.local}</Descriptions.Item>
      </Descriptions>

      {collector.sensores.map((sensor) => (
        <div key={sensor.id_sensor}>
          <h3>Sensor {sensor.id_sensor}</h3>
          <div id={`sensor-chart-${sensor.id_sensor}`}>
            {sensorChartData[sensor.id_sensor]?.length === 0 && <Spin size="large" />}
          </div>
          {drawChart(sensor.id_sensor)}
        </div>
      ))}
    </div>
  );
};

export default CollectorPage;
