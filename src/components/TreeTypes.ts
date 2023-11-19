type EntityType =
  | 'customer'
  | 'site'
  | 'building'
  | 'endpoint'
  | 'area'
  | 'hvac'
  | 'hvacZone'
  | 'header'
  | 'root';

interface SelectedEventDetail {
  id: string;
  type: EntityType;
}

interface EntityNode {
  id: string;
  name: string;
  type: EntityType;
  isExpanded: boolean;
  isSelected: boolean;
}

interface HvacZoneNode extends EntityNode {}

interface AreaNode extends EntityNode {}

interface EndpointNode extends EntityNode {}

interface SiteNode extends EntityNode {
  buildings: BuildingNode[];
  endpoints: EndpointNode[];
}

interface HvacNode extends EntityNode {
  zones: HvacZoneNode[];
}

interface BuildingNode extends EntityNode {
  areas: AreaNode[];
  hvacs: HvacNode[];
}

interface CustomerNode extends EntityNode {
  sites: SiteNode[];
}

interface RootNode {
  customers: CustomerNode[];
  isExpanded: boolean;
}
