import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  AreaChartOutlined,
  TableOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { SensorDataProvider } from './SensorDataContext.js';
import ChartPage from './pages/ChartPage.js';
import TablePage from './pages/TablePage.js';
import CollectorPage from './pages/CollectorPage.js';

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  return (
    <SensorDataProvider>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
            <div className="demo-logo-vertical" />
          <Layout>
            <Header
              style={{
                padding: 10,
                background: '#001529',
              }}
            >
              <Title style={{ margin: 0, color: '#fff' }}></Title>
            </Header>
            <Content style={{ margin: '24px 16px 0' }}>
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: '#fff',
                }}
              >
                <Routes>
                  <Route path="/" element={<TablePage />} />
                  <Route path="/collector/:id" element={<CollectorPage/>} />
                </Routes>
              </div>
            </Content>
            <Footer
              style={{
                textAlign: 'center',
              }}
            ></Footer>
          </Layout>
        </Layout>
      </Router>
    </SensorDataProvider>
  );
};

export default App;