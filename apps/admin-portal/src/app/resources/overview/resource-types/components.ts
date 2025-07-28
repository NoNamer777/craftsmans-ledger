import { ResourceTypes } from '../../models';
import { ItemsOverviewComponent } from './items';
import { LocationsOverviewComponent } from './locations';
import { RealmsOverviewComponent } from './realms';
import { StructuresOverviewComponent } from './structures';
import { TechnologyTreeOverviewComponent } from './technology-trees';
import { VendorTypesOverviewComponent } from './vendor-types';
import { VillagersOverviewComponent } from './villagers';

export const resourceTypeComponents = {
    [ResourceTypes.ITEMS]: ItemsOverviewComponent,
    [ResourceTypes.LOCATIONS]: LocationsOverviewComponent,
    [ResourceTypes.REALMS]: RealmsOverviewComponent,
    [ResourceTypes.STRUCTURES]: StructuresOverviewComponent,
    [ResourceTypes.TECHNOLOGY_TREES]: TechnologyTreeOverviewComponent,
    [ResourceTypes.VENDOR_TYPE]: VendorTypesOverviewComponent,
    [ResourceTypes.VILLAGERS]: VillagersOverviewComponent,
} as const;
