import * as process from 'node:process';
import {
    DEFAULT_CORS_ORIGINS,
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

export interface SslConfig {
    cert: string;
    key: string;
}

export interface AppConfig {
    host: string;
    port: number;
    corsOrigins: string[];
    ssl?: SslConfig;
    database: DatabaseConfig;
}

function hasSslConfigured() {
    return process.env[EnvVarNames.SSL_CERT] && process.env[EnvVarNames.SSL_KEY];
}

export function appConfig(): AppConfig {
    return {
        host: process.env[EnvVarNames.HOST] || DEFAULT_HOST,
        port: Number.parseInt(process.env[EnvVarNames.PORT]) || DEFAULT_PORT,
        ...(hasSslConfigured()
            ? {
                  ssl: {
                      cert: process.env[EnvVarNames.SSL_CERT],
                      key: process.env[EnvVarNames.SSL_KEY],
                  },
              }
            : {}),
        corsOrigins: process.env[EnvVarNames.CORS_ORIGINS].split(',') ?? DEFAULT_CORS_ORIGINS,

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
