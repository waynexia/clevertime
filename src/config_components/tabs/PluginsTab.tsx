import { useConfig } from '../ConfigContext';

export function PluginsTab() {
    const { config, setConfig } = useConfig();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Plugins</h2>
            <p>Manage and configure plugins for your database here.</p>
        </div>
    );
}

