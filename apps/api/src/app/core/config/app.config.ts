import {
    DEFAULT_DB_HOST,
    DEFAULT_DB_PORT,
    DEFAULT_DB_SCHEMA,
    DEFAULT_DB_USER,
    DEFAULT_HOST,
    DEFAULT_PORT,
    EnvVarNames,
} from './constants';

export interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    schema: string;
    url: string;
}

export interface AppConfig {
    host: string;
    port: number;
    database: DatabaseConfig;
}

export function appConfig(): AppConfig {
    return {
        host: process.env[EnvVarNames.HOST] || DEFAULT_HOST,
        port: Number.parseInt(process.env[EnvVarNames.PORT]) || DEFAULT_PORT,

        database: {
            host: process.env[EnvVarNames.DB_HOST] || DEFAULT_DB_HOST,
            port: Number.parseInt(process.env[EnvVarNames.DB_PORT]) || DEFAULT_DB_PORT,
            user: process.env[EnvVarNames.DB_URL] || DEFAULT_DB_USER,
            password: process.env[EnvVarNames.DB_PASSWORD],
            schema: process.env[EnvVarNames.DB_SCHEMA] || DEFAULT_DB_SCHEMA,
            url: process.env[EnvVarNames.DB_URL],
        },
    };
}
