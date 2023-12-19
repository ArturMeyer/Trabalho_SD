import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Divider, Input, Select, Space, Button, message } from 'antd';

const { Option } = Select;

const EditCollectorModal = ({ visible, onCancel, onConfirm, existingLocations }) => {
  const [newLocation, setNewLocation] = useState('');
  const inputRef = useRef(null);

  const onLocationChange = (value) => {
    setNewLocation(value);
  };

  const addLocation = () => {
    const trimmedLocation = newLocation.trim();
    if (!trimmedLocation) {
      message.error('O nome da localização não pode estar vazio');
      return;
    }

    // Check if the location already exists
    if (existingLocations.includes(trimmedLocation)) {
      message.error('Esta localização já existe');
      return;
    }

    existingLocations.push(trimmedLocation);
    setNewLocation('');
    inputRef.current?.focus();
  };

  const handleConfirm = () => {
    console.log(newLocation)
    if (existingLocations.length === 0) {
      message.error('Selecione pelo menos uma localização antes de confirmar');
      return;
    }

    Modal.confirm({
      title: 'Confirmar Mudança de Localização',
      content: `Tem certeza de que deseja mudar para ${newLocation}?`,
      okText: 'Sim',
      cancelText: 'Não',
      onOk: () => {
        onConfirm(newLocation);
        setNewLocation([]);
        onCancel();
      },
    });
  };

  const handleClear = () => {
    setNewLocation([]);
  };

  const handleChange = (value) => {
    setNewLocation(value);
  };

  return (
    <Modal
      title="Mudar Localização"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="confirm" onClick={handleConfirm} type="primary" danger>
          Confirmar
        </Button>,
      ]}
    >
      <Select
        style={{ width: '100%' }}
        placeholder="Selecione uma localização existente ou insira uma nova"
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Space style={{ padding: '0 8px 4px' }}>
              <Input
                placeholder="Digite a nova localização"
                ref={inputRef}
                value={newLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
              />
              <PlusOutlined
                onClick={addLocation}
                style={{ fontSize: '16px', color: '#1890ff', cursor: 'pointer' }}
              />
            </Space>
          </>
        )}
      >
        {existingLocations.map((location) => (
          <Option key={location} value={location}>
            {location}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default EditCollectorModal;
