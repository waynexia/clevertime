import React, { useState } from 'react';
import { Input, Button } from 'antd';

const { TextArea } = Input;

interface SQLInputProps {
    onParse: (sql: string) => void;
}

const SQLInput: React.FC<SQLInputProps> = ({ onParse }) => {
    const [sql, setSql] = useState('');

    return (
        <div className="mb-6">
            <TextArea
                rows={4}
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                placeholder="Enter your SQL query here"
                className="mb-4"
            />
            <Button type="primary" onClick={() => onParse(sql)}>
                Parse SQL
            </Button>
        </div>
    );
};

export default SQLInput;
