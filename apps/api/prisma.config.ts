import { defineConfig } from 'prisma/config';

function parseInt(fallback: number, value?: string) {
    if (!value) return fallback;
    const parsed = Number.parseInt(value);

    if (Number.isNaN(parsed)) return fallback;
    return parsed;
}

interface DbUrlParams {
    host: string;
    port: number;
    schema: string;
    user: string;
    password: string;
}

function dbUrl(params: DbUrlParams) {
    const { host, port, schema, user, password } = params;
    return `mysql://${user}:${password}@${host}:${port}/${schema}`;
}

const dbConfig: DbUrlParams = {
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(3306, process.env['DB_PORT']),
    schema: process.env['DB_SCHEMA'] || 'my_db',
    user: process.env['DB_USER'] || 'root',
    password: process.env['DB_PASSWORD'],
};

export default defineConfig({
    schema: './prisma/schema.prisma',
    datasource: {
        url: dbUrl(dbConfig),
        shadowDatabaseUrl: `${dbUrl(dbConfig)}_shadow`,
    },
    migrations: {
        path: './prisma/migrations',
    },
});
