import React, { createContext, useState, useContext } from 'react';

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState({
        host: 'localhost',
        port: '5432',
        database: 'mydatabase',
        username: '',
        password: '',
        ssl: false,
        timeout: '5000',
        saveLocation: ''
    });

    return (
        <ConfigContext.Provider value={{ config, setConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => useContext(ConfigContext);
