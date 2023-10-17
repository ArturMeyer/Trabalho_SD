import React, { useEffect } from 'react';
import * as d3 from 'd3';
import {
  AreaChartOutlined,
  TableOutlined,
  FileTextOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Typography, theme } from 'antd';

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    // Dados para o gráfico de linha
    const data = [
      { date: '2023-01-01', value: 10 },
      { date: '2023-02-01', value: 20 },
      { date: '2023-03-01', value: 30 },
      { date: '2023-04-01', value: 40 },
      { date: '2023-05-01', value: 50 },
    ];

    // Configuração do gráfico
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height, 0]);

    const line = d3
      .line()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Eixos
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g').call(d3.axisLeft(y));
  }, []);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['4']}
          items={[
            { icon: AreaChartOutlined, name: 'Gráficos' },
            { icon: TableOutlined, name: 'Tabelas' },
            { icon: FileTextOutlined, name: 'Relatórios' },
            { icon: ExportOutlined, name: 'Exportar' },
          ].map((item, index) => ({
            key: String(index + 1),
            icon: React.createElement(item.icon),
            label: `${item.name}`,
          }))}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 10,
            background: colorBgContainer,
          }}
        >
          <Title style={{ margin: 0 }}>FrontEnd</Title>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <div id="chart"></div>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        ></Footer>
      </Layout>
    </Layout>
  );
};

export default App;
