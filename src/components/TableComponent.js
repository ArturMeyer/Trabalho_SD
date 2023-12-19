import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, Space, Table, Divider, Tag, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useSensorData } from '../SensorDataContext.js';
import { Link } from 'react-router-dom';
import EditCollectorModal from './EditCollectorModal.js';
import * as d3 from 'd3';

const TableComponent = ({ data }) => {
  const [sensorChartData, setSensorChartData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectionType, setSelectionType] = useState('checkbox');
  const [visible, setVisible] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const searchInput = useRef(null);

  const { sensorData } = useSensorData();

  const [allLocations, setAllLocations] = useState([]);

  useEffect(() => {
    // Extract unique locations from the collector data
    const uniqueLocations = [...new Set(data.map((collector) => collector.local))];
    setAllLocations(uniqueLocations);
  }, [data]);
  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  const [editCollectorModalVisible, setEditCollectorModalVisible] = useState(false);
  const [editCollectorId, setEditCollectorId] = useState(null);

  const handleEditLocation = (newLocation) => {
    // Update the location of the collector with editCollectorId
    // You need to implement the logic to update the location in your data
    console.log(`Updating location of collector ${editCollectorId} to ${newLocation}`);
    setEditCollectorModalVisible(false);
  };

  const showUpdateModal = (sensor) => {
    setSelectedSensor(sensor);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const showColletorModal = (record) => {
    setSelectedSensor(record);
    setVisible(true);
  };

  const showEditModal = (record) => {
    setEditCollectorId(record.id_coletor);
    setEditCollectorModalVisible(true);
  };

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${title}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const renderChart = (sensor, record) => {
    const chartContainer = d3.select(`#sensor-chart-${sensor.id_sensor}-${record.id_coletor}`);
  
    // Clear previous content in the chart container
    chartContainer.selectAll('*').remove();
  
    // Example: Create a simple bar chart
    const svg = chartContainer.append('svg')
      .attr('width', 100)
      .attr('height', 50);
  
    const data = sensor.valores.map((entry) => entry.valor);
  
    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, 100]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([50, 0]);
  
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(i))
      .attr('y', (d) => yScale(d))
      .attr('width', 10)
      .attr('height', (d) => 50 - yScale(d))
      .attr('fill', 'blue');
  };

  const columns = [
    {
      key: 'id_coletor',
      title: 'ID Coletor',
      dataIndex: 'id_coletor',
      ...getColumnSearchProps('id_coletor', 'ID Coletor'),
      render: (text, record) => <Link to={`/collector/${record.id_coletor}`}>{text}</Link>,
    },
    {
      key: 'data_inicio',
      title: 'Data de Início',
      dataIndex: 'data_inicio',
      ...getColumnSearchProps('data_inicio', 'Data de Início'),
    },
    {
      key: 'local',
      title: 'Local',
      dataIndex: 'local',
      ...getColumnSearchProps('local', 'Local'),
    },
    {
      key: 'edit',
      title: 'Atualizar',
      dataIndex: 'edit',
      render: (_, record) => (
        <Button type="primary" onClick={() => showEditModal(record)}>
          Atualizar
        </Button>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => (
        <Tag color={record.status ? 'green' : 'red'}>
          {record.status ? "Online" : "Offline"}
        </Tag>
      ),
      filters: [
        { text: 'Online', value: 'Online' },
        { text: 'Offline', value: 'Offline' },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  const expandedRowRender = (record) => {
    const sensorColumns = [
      { title: 'ID Sensor', dataIndex: 'id_sensor', key: 'id_sensor' },
      { title: 'Tipo Sensor', dataIndex: 'tipo', key: 'tipo' },
      {
        title: 'Último Valor',
        dataIndex: 'valores',
        key: 'valores',
        render: (_, sensor) => (
          <span>
            {sensor.valores.length > 0 &&
              `${sensor.valores[sensor.valores.length - 1].data}: ${sensor.valores[sensor.valores.length - 1].valor}`}
          </span>
        ),
      },
      {
        title: 'Gráfico',
        dataIndex: 'chart',
        key: 'chart',
        render: (_, sensor) => {
          renderChart(sensor, record);
          return <div id={`sensor-chart-${sensor.id_sensor}-${record.id_coletor}`} style={{ width: '100px', height: '50px' }} />;
        },
      }
      
    ];

    return (
      <Table
        columns={sensorColumns}
        dataSource={record.sensores}
        pagination={false}
      />
    );
  };

  return (
    <div>
      <Divider />
      <Table
        rowSelection={{
          type: 'radio',
          fixed: true,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        rowKey="id_coletor"
        expandable={{
          expandedRowRender,
        }}
      />
      <EditCollectorModal
        visible={editCollectorModalVisible}
        onCancel={() => setEditCollectorModalVisible(false)}
        onConfirm={handleEditLocation}
        existingLocations={allLocations}
      />
    </div>
  );
};

export default TableComponent;
