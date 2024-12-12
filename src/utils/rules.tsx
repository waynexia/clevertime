import { Column } from './parser';

export interface GlobalData {
    ingestThroughput?: number;
    hasDuplicates: boolean;
}

export interface SQLSuggestion {
    title: string;
    sql?: string;
    explanation: string;
}

export const optimizeCardinality = (columns: Column[]): SQLSuggestion[] => {
    const suggestions: SQLSuggestion[] = [];

    let invertedCardinality = 1;

    columns.forEach(col => {
        console.log(col);
        if (col.index === 'primary' || col.index === 'inverted') {
            invertedCardinality *= col.cardinality;
            if (col.cardinality >= 1000000) {
                console.log(`big col ${col.name}`)
                suggestions.push({
                    title: `Consider removing index from \`${col.name}\``,
                    explanation: `The cardinality of the \`${col.name}\` column is greater than 1,000,000. Consider removing the index to improve performance.`
                });
            }
        }
    });


    if (invertedCardinality >= 1000000)

        suggestions.push({
            title: `Consider remove some keys from primary key`,
            explanation: `The cardinality of the inverted index is ${invertedCardinality}, which is greater than 1,000,000. Consider removing some keys from the primary key to reduce the cardinality of the inverted index.`
        });

    return suggestions;
};

export const optimizeWrongFulltextIndex = (columns: Column[]): SQLSuggestion[] => {
    const suggestions: SQLSuggestion[] = [];

    columns.forEach(col => {
        if (col.index === 'fulltext' && col.dataType !== 'string') {
            suggestions.push({
                title: `Consider removing fulltext index from \`${col.name}\` which is not a String column`,
                explanation: `The \`${col.name}\` column has a fulltext index. Fulltext on a non-String column is not recommend.`
            });
        }
    });

    return suggestions;
}

export const optimizePartitioning = (
    globalData: GlobalData
): SQLSuggestion[] => {
    const suggestions: SQLSuggestion[] = [];

    if ((globalData.ingestThroughput ?? 0) >= 500000) {
        suggestions.push({
            title: 'Consider table sarding',
            sql: `PARTITION ON COLUMNS (...) (
    ...
);`,
            explanation: 'Consider sharding the table to distribute the data across multiple nodes and improve ingest performance. Document: https://docs.greptime.com/user-guide/administration/manage-data/table-sharding'
        });
    }

    return suggestions;
};

export const optimizeAppendOnly = (
    globalData: GlobalData
): SQLSuggestion[] => {
    const suggestions: SQLSuggestion[] = [];

    if (globalData.hasDuplicates) {
        suggestions.push({
            title: 'Consider using append-only table',
            sql: `CREATE TABLE users (
    ...
) with('append_mode'='true')`,
            explanation: 'Consider using an append-only table to skip data deduplication and improve ingest/query performance. Document: https://docs.greptime.com/user-guide/administration/performance-tuning-tips/#using-append-only-table-if-possible'
        });
    }

    return suggestions;
};

export const generateOptimizedSQL = (
    columnData: Column[],
    globalData: GlobalData
): SQLSuggestion[] => {
    // Combine all optimization suggestions
    return [
        ...optimizeCardinality(columnData),
        ...optimizeWrongFulltextIndex(columnData),
        ...optimizePartitioning(globalData),
        ...optimizeAppendOnly(globalData)
    ];
};
