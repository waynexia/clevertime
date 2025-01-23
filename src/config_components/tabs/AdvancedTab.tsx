import { useConfig } from '../ConfigContext';

export function AdvancedTab() {
    const { config, setConfig } = useConfig();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Advanced Settings</h2>
            <p>Configure advanced settings for your database here.</p>
        </div>
    );
}

