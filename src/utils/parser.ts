export interface Column {
    name: string;
    dataType: string;
    semanticType: string;
    nullable: boolean;
    index: string | null;
}

interface SQLResponse {
    CreateTable: {
        columns: {
            column_def: {
                name: { value: string };
                data_type: string | { type: string;[key: string]: any };
            };
        }[];
        constraints: {
            PrimaryKey?: { columns: { value: string }[] };
            TimeIndex?: { column: { value: string } };
        }[];
    };
}

function getDataType(dataType: string | { [key: string]: any }): string {
    if (typeof dataType === 'string') return dataType.toLowerCase();
    return Object.keys(dataType)[0].toLowerCase();
}

export async function parseSQL(sql: string, server_addr: string): Promise<Column[]> {
    const url = `http://${server_addr}/v1/sql/parse?sql=${encodeURIComponent(sql)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: SQLResponse = await response.json();

        // Find primary key columns
        const primaryKeyColumns = new Set(
            data.CreateTable.constraints
                .filter(c => 'PrimaryKey' in c)
                .flatMap(c => c.PrimaryKey!.columns.map(col => col.value))
        );

        // Find time index column
        const timeIndexColumn = data.CreateTable.constraints
            .find(c => 'TimeIndex' in c)
            ?.TimeIndex?.column.value;

        // Map columns with their constraints
        return data.CreateTable.columns.map(col => ({
            name: col.column_def.name.value,
            dataType: getDataType(col.column_def.data_type),
            semanticType: col.column_def.name.value === timeIndexColumn ? 'timestamp' : primaryKeyColumns.has(col.column_def.name.value) ? 'tag' : 'field',
            nullable: col.column_def.name.value !== timeIndexColumn,
            index: primaryKeyColumns.has(col.column_def.name.value) ? 'primary' :
                col.column_def.name.value === timeIndexColumn ? 'time' : null
        }));
    } catch (error) {
        console.error('Error parsing SQL:', error);
        throw error;
    }
}