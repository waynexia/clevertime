import { useConfig } from '../ConfigContext';

export function ConnectionsTab() {
    const { config, setConfig } = useConfig();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Connections</h2>
            <p>Manage your database connections here.</p>
        </div>
    )
}

