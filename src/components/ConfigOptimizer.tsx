import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const ConfigOptimizer: React.FC = () => {
    return (
        <div>
            <Title level={2} className="text-center mb-6">Config Optimizer for GreptimeDB</Title>
            <p className="text-center">Config optimization features coming soon...</p>
        </div>
    );
};

export default ConfigOptimizer;
