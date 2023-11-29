// // pages/ChartPage.js
// import React, { useEffect } from 'react';
// import * as d3 from 'd3';

// const ChartPage = () => {
//   useEffect(() => {
//     // Coloque o código do gráfico aqui...
//   }, []);

//   return <div id="chart"></div>;
// };

// export default ChartPage;


import React, { useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import { Modal, Button, Form, Select } from 'antd';
import LinePlot from '../components/LinePlot';

const { Option } = Select;


  const ChartPage = ({ data }) => {
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedValues, setSelectedValues] = useState({
      axisX: null,
      axisY: null,
      unitX: null,
      unitY: null,
      chartType: null,
    });
  
    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };
  
  //   const handleCreateChart = () => {
  //     console.log("estou aqui");
  //     // Gera dados fictícios para o gráfico (temperatura por dia)
  //     const generateFakeData = () => {
  //       const startDate = new Date(2023, 1, 1); // Data inicial (ano, mês, dia)
  //       const endDate = new Date(2023, 1, 10); // Data final (ano, mês, dia)
  
  //       const dateRange = d3.timeDay.range(startDate, endDate);
  
  //       return dateRange.map((date) => ({
  //         date: date,
  //         temperature: Math.random() * 10 + 20, // Temperatura arbitrária entre 20 e 30 graus
  //       }));
  //     };
  
  //     const fakeData = generateFakeData();
  
  //     // Implementa a lógica do gráfico usando D3
  //     const svg = d3.select('#chart');

  // svg.selectAll('*').remove(); // Limpa qualquer conteúdo existente no SVG

  // const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  // const width = 600 - margin.left - margin.right;
  // const height = 400 - margin.top - margin.bottom;

  // const x = d3
  //   .scaleTime()
  //   .domain(d3.extent(fakeData, (d) => d.date))
  //   .range([0, width]);

  // const y = d3
  //   .scaleLinear()
  //   .domain([20, 30]) // Faixa arbitrária de temperaturas
  //   .range([height, 0]);

  // const xAxis = d3.axisBottom(x);
  // const yAxis = d3.axisLeft(y);

  // svg
  //   .append('g')
  //   .attr('transform', `translate(${margin.left},${margin.top})`)
  //   .call(yAxis);

  // svg
  //   .append('g')
  //   .attr('transform', `translate(${margin.left},${height + margin.top})`)
  //   .call(xAxis);

  // svg
  //   .selectAll('circle')
  //   .data(fakeData)
  //   .enter()
  //   .append('circle')
  //   .attr('cx', (d) => x(d.date))
  //   .attr('cy', (d) => y(d.temperature))
  //   .attr('r', 5);
  
  //   console.log('Gráfico criado com sucesso!');
  //   console.log(svg);
  //     setIsModalVisible(false);

  //     // Adicione a função LinePlot
  //   const linePlotData = fakeData.map((d) => d.temperature);
  //   renderLinePlot(linePlotData);
  //   };

    // const renderLinePlot = (lineData) => {
    //   // Obtenha a referência ao contêiner
    //   const container = document.getElementById('line-plot-container');
    
    //   // Limpe o conteúdo existente
    //   container.innerHTML = '';
    
    //   // Renderize o componente LinePlot no contêiner
    //   ReactDOM.render(<LinePlot data={lineData} />, container);
    // };
    


  const onValuesChange = (changedValues, allValues) => {
    setSelectedValues(allValues);
  };
  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Criar Gráfico
      </Button>

      <Modal
        title="Configurações do Gráfico"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button
          form="chartForm"
          key="submit"
          type="primary"
          htmlType="submit"
          // onClick={handleCreateChart}
        >
          Criar Gráfico
        </Button>,
        ]}
      >
        <Form
          id="chartForm"
          // onFinish={handleCreateChart}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="Eixo X"
            name="axisX"
            rules={[{ required: true, message: 'Por favor, selecione o eixo X!' }]}
          >
            <Select placeholder="Selecione o eixo X">
              {/* Opções para o eixo X */}
              <Option value="temperatura">Temperatura</Option>
              <Option value="umidade">Umidade</Option>
              <Option value="tempo">Data</Option>
              {/* Adicione mais opções conforme necessário */}
            </Select>
          </Form.Item>

          <Form.Item
            label="Eixo Y"
            name="axisY"
            rules={[{ required: true, message: 'Por favor, selecione o eixo Y!' }]}
          >
            <Select placeholder="Selecione o eixo Y">
              {/* Opções para o eixo Y */}
              <Option value="temperatura">Temperatura</Option>
              <Option value="umidade">Umidade</Option>
              <Option value="tempo">Data</Option>
              {/* Adicione mais opções conforme necessário */}
           </Select>

          </Form.Item>

          <Form.Item
            label="Unidade do Eixo X"
            name="unitX"
            rules={[{ required: true, message: 'Por favor, insira a unidade do eixo X!' }]}
          >
            <Select placeholder={`Selecione a unidade do eixo`}>
            {/* Opções para unidades de temperatura */}
            <Option value="celsius">Celsius</Option>
            <Option value="fahrenheit">Fahrenheit</Option>
            <Option value="kelvin">Kelvin</Option>
            <Option value="dia">Dia</Option>
            <Option value="semana">Semana</Option>
            <Option value="mes">Mês</Option>
            {/* Adicione mais opções conforme necessário */}
          </Select>
          </Form.Item>


          <Form.Item
            label="Unidade do Eixo Y"
            name="unitY"
            rules={[{ required: true, message: 'Por favor, insira a unidade do eixo Y!' }]}
          >
            <Select placeholder={`Selecione a unidade do eixo`}>
            {/* Opções para unidades de temperatura */}
            <Option value="celsius">Celsius</Option>
            <Option value="fahrenheit">Fahrenheit</Option>
            <Option value="kelvin">Kelvin</Option>
            <Option value="dia">Dia</Option>
            <Option value="semana">Semana</Option>
            <Option value="mes">Mês</Option>
            {/* Adicione mais opções conforme necessário */}
          </Select>
          </Form.Item>

          <Form.Item
            label="Tipo de Gráfico"
            name="chartType"
            rules={[{ required: true, message: 'Por favor, selecione o tipo de gráfico!' }]}
          >
            <Select placeholder="Selecione o tipo de gráfico">
              {/* Tipos de gráfico disponíveis */}
              <Option value="linha">Linha</Option>
              <Option value="barra">Barra</Option>
              {/* Adicione mais opções conforme necessário */}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <div id="line-plot-container"></div>
    </div>
  );
};

export default ChartPage;

