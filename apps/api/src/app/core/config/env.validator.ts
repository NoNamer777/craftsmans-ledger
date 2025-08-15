import { serialize } from '@craftsmans-ledger/shared';
import { validate } from 'class-validator';
import { EnvironmentVariables, validationOptions } from './constants';

export async function validateEnvVars(config: Record<string, unknown>): Promise<EnvironmentVariables> {
    const parsed = serialize(EnvironmentVariables, config);
    const validateErrors = await validate(parsed, validationOptions);

    if (validateErrors.length > 0) throw validateErrors[0];
    return parsed;
}
