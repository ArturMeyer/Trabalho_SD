import React, { useState, useEffect} from 'react';
import { Modal, Button, Form, Select } from 'antd';
import FormComponent from '../components/CollectorTableComponent.js';

const CollectorRegisterPage = () => {
    const [data, setData] = useState([]);

    function generateCollectorData() {
        const id = Math.floor(Math.random() * 1000);
        const date_init = new Date().toISOString();
        const date_end = null;
        const local = 'Sala 2305';

        return {id, date_init, date_end, local};
    }

    useEffect(() => {
        const collectorData = generateCollectorData();

        setData((prevData) => [...prevData, { ...collectorData}]);
    }, [data]);

    return (
        <div>
            <FormComponent data={data}/>
        </div>

    );
}

export default CollectorRegisterPage