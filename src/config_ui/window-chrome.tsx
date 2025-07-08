import { CloseOutlined, MinusOutlined, BorderOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export function WindowChrome() {
    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b">
            <div className="flex gap-2">
                <Button
                    type="text"
                    className="w-3 h-3 p-0 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
                    icon={<CloseOutlined className="text-[8px] text-red-800 opacity-0 group-hover:opacity-100" />}
                />
                <Button
                    type="text"
                    className="w-3 h-3 p-0 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center"
                    icon={<MinusOutlined className="text-[8px] text-yellow-800 opacity-0 group-hover:opacity-100" />}
                />
                <Button
                    type="text"
                    className="w-3 h-3 p-0 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center"
                    icon={<BorderOutlined className="text-[8px] text-green-800 opacity-0 group-hover:opacity-100" />}
                />
            </div>
            <h1 className="flex-1 text-center text-sm font-medium">Database Configuration</h1>
        </div>
    )
}

