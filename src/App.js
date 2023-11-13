// App.js
import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  AreaChartOutlined,
  TableOutlined,
  FileTextOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import ChartPage from './pages/ChartPage.js';
import TablePage from './pages/TablePage.js';
import HomePage from './pages/HomePage.js';

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handleMenuClick = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'chart':
        return <ChartPage />;
      case 'table':
        return <TablePage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        style={{ minHeight: '100vh' }}
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
          style={{ minHeight: '100vh' }}
          theme="dark"
          mode="inline"
          selectedKeys={[currentPage]}
          onClick={({ key }) => handleMenuClick(key)}
        >
          <Menu.Item key="home" icon={<FileTextOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="chart" icon={<AreaChartOutlined />}>
            Gráficos
          </Menu.Item>
          <Menu.Item key="table" icon={<TableOutlined />}>
            Tabelas
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 10,
            background: '#001529', // Altere a cor de fundo conforme necessário
          }}
        >
          <Title style={{ margin: 0, color: '#fff' }}>FrontEnd</Title>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: '#fff', // Altere a cor de fundo conforme necessário
            }}
          >
            {renderPage()}
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