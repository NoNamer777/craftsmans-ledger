import { config } from '@dotenvx/dotenvx';

config({ path: 'apps/api/.env' });

import { join } from 'path';
import { defineConfig } from 'prisma/config';

const prismaConfig = defineConfig({
    schema: join('apps/api/prisma'),
});

export default prismaConfig;
