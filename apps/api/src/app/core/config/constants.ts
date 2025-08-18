import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, ValidatorOptions } from 'class-validator';
import { appConfig } from './app.config';
import { validateEnvVars } from './env.validator';

export const MIN_TCP_PORT = 0 as const;

export const MAX_TCP_PORT = 65_535 as const;

export const DEFAULT_HOST = '0.0.0.0' as const;

export const DEFAULT_PORT = 7200 as const;

export const DEFAULT_DB_HOST = 'localhost' as const;

export const DEFAULT_DB_PORT = 3600 as const;

export const DEFAULT_DB_USER = 'root' as const;

export const DEFAULT_DB_SCHEMA = 'mydb' as const;

export const EnvVarNames = {
    HOST: 'HOST',
    PORT: 'PORT',
    SSL_CERT: 'SSL_CERT',
    SSL_KEY: 'SSL_KEY',

    DB_HOST: 'DB_HOST',
    DB_PORT: 'DB_PORT',
    DB_USER: 'DB_USER',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_SCHEMA: 'DB_SCHEMA',
    DB_URL: 'DB_URL',
} as const;

export class EnvironmentVariables {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Expose()
    [EnvVarNames.HOST]: string = DEFAULT_HOST;

    @Max(MAX_TCP_PORT)
    @Min(MIN_TCP_PORT)
    @IsInt()
    @IsOptional()
    @Expose()
    [EnvVarNames.PORT]: number = DEFAULT_PORT;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Expose()
    [EnvVarNames.SSL_CERT]?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Expose()
    [EnvVarNames.SSL_KEY]?: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    [EnvVarNames.DB_HOST]: string = DEFAULT_DB_HOST;

    @Max(MAX_TCP_PORT)
    @Min(MIN_TCP_PORT)
    @IsInt()
    @Expose()
    [EnvVarNames.DB_PORT]: number = DEFAULT_DB_PORT;

    @IsNotEmpty()
    @IsString()
    @Expose()
    [EnvVarNames.DB_USER]: string = DEFAULT_DB_USER;

    @IsNotEmpty()
    @IsString()
    @Expose()
    [EnvVarNames.DB_PASSWORD]: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    [EnvVarNames.DB_SCHEMA]: string = DEFAULT_DB_SCHEMA;

    @IsNotEmpty()
    @IsString()
    @Expose()
    [EnvVarNames.DB_URL]: string;
}

export const configModuleOptions: ConfigModuleOptions = {
    cache: true,
    envFilePath: ['.env'],
    expandVariables: true,
    isGlobal: true,
    load: [appConfig],
    validate: validateEnvVars,
};

export const validationOptions: ValidatorOptions = {
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    stopAtFirstError: true,
};
