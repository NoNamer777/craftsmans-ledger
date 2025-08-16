import { ItemBuilder } from '@craftsmans-ledger/shared';
import { TEMP_RESOURCE_ID } from '../../../models';

export const TEMP_ITEM = new ItemBuilder().withId(TEMP_RESOURCE_ID).withName('').withBaseValue(0).withWeight(0).build();
