import React, { useEffect, useRef, useState } from 'react';
import { Descriptions, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import { useSensorData } from '../SensorDataContext';


const Chart = ({ sensorId, sensorChartData }) => {
  const chartRef = useRef(null);
  const [localSensorChartData, setLocalSensorChartData] = useState(sensorChartData);

  useEffect(() => {
    setLocalSensorChartData(sensorChartData);
  }, [sensorChartData]);

  useEffect(() => {
    const createChart = () => {
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = 928;
      const height = 500;

      if (!localSensorChartData[sensorId]) {
        return;
      }

      const data = localSensorChartData[sensorId]?.map((d) => ({
        date: new Date(d.data),
        temperature: convertToFahrenheit(d.valor), // Converte para Celsius
      })) || [];

      const x = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.temperature)).nice()
        .range([height - margin.bottom, margin.top]);

      const color = d3.scaleSequential(y.domain(), d3.interpolateTurbo);

      const line = d3.line()
        .curve(d3.curveStep)
        .defined(d => !isNaN(d.temperature))
        .x(d => x(d.date))
        .y(d => y(d.temperature));

      const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
        .call(g => g.select(".domain").remove());

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").append("tspan").text("°C"));

      const gradientId = `gradient-${sensorId}`;

      svg.append("linearGradient")
        .attr("id", gradientId)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", height - margin.bottom)
        .attr("x2", 0)
        .attr("y2", margin.top)
        .selectAll("stop")
        .data(d3.ticks(0, 1, 10))
        .join("stop")
        .attr("offset", d => d)
        .attr("stop-color", color.interpolator());

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", `url(#${gradientId})`)
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

      chartRef.current.innerHTML = '';
      chartRef.current.appendChild(svg.node());
    };

    createChart();
  }, [sensorId, localSensorChartData]);

  // Função para converter Fahrenheit para Celsius
  const convertToFahrenheit = (fahrenheit) => (fahrenheit - 32) * 5 / 9;

  return <div ref={chartRef}></div>;
};

const CollectorPage = () => {
  const { id } = useParams();
  const { sensorData } = useSensorData();

  const collector = sensorData.find((c) => c.id_coletor === Number(id));

  const [sensorChartData, setSensorChartData] = useState({});

  useEffect(() => {
    if (collector && collector.sensores.length > 0) {
      const initialData = {};
      collector.sensores.forEach((sensor) => {
        initialData[sensor.id_sensor] = sensor.valores;
      });
      setSensorChartData(initialData);
    }
  }, [collector]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (collector && collector.sensores.length > 0) {
        const newData = { ...sensorChartData };
        collector.sensores.forEach((sensor) => {
          const newDataPoint = {
            valor: Math.random() * 100,
            data: new Date().toISOString(),
          };
          newData[sensor.id_sensor] = [...newData[sensor.id_sensor], newDataPoint];
        });
        setSensorChartData(newData);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [sensorChartData, collector]);

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
          <Chart sensorId={sensor.id_sensor} sensorChartData={sensorChartData} />
        </div>
      ))}
    </div>
  );
};

export default CollectorPage;