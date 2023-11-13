import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Radio, Divider, Tag } from 'antd';

const TableComponent = ({ data }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectionType, setSelectionType] = useState('checkbox');
  const searchInput = useRef(null);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
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
  const columns = [
    {
      key: 1,
      title: 'id_coletor',
      dataIndex: 'id_coletor',
      key: 'id_coletor',
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps('id_coletor'),
      sorter: {
        compare: (a, b) => a.id_coletor - b.id_coletor,
        multiple: 4,
      },
    },
    {
      key: 2,
      title: 'id_sensor',
      dataIndex: 'id_sensor',
      key: 'id_sensor',
      ...getColumnSearchProps('id_sensor'),
      sorter: {
        compare: (a, b) => a.id_sensor - b.id_sensor,
        multiple: 3,
      },
    },
    {
      key: 3,
      title: 'Tipo',
      key: 'tipo_sensor',
      dataIndex: 'tipo_sensor',
      ...getColumnSearchProps('tipo_sensor'),
      render: (_, record) => (
        <>
          {Array.isArray(record.tipo_sensor) &&
            record.tipo_sensor.map((tag) => (
              <Tag color={'default'} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            ))}
        </>
      ),
    },
    {
      key: 4,
      title: 'Valor',
      dataIndex: 'valor_sensor',
      key: 'valor_sensor',
      ...getColumnSearchProps('valor_sensor'),
      sorter: {
        compare: (a, b) => a.valor_sensor - b.valor_sensor,
        multiple: 2,
      },
    },
    {
      key: 5,
      title: 'Horário',
      dataIndex: 'timestamp',
      key: 'timestamp',
      ...getColumnSearchProps('timestamp'),
      sorter: {
        compare: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
        multiple: 1,
      },
    },
  ];

  return (
    <div>
      <Divider />

      <Table
        rowSelection={{
          type: selectionType,
          fixed: true,  
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};
export default TableComponent;


