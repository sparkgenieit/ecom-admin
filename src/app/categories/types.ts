export interface Category {
  id?: number;
  title: string;
  parent_id?: number | null;
  position?: number;
  status?: boolean;
  frontDisplay?: string;
  appIcon?: string;
  webImage?: string;
  mainImage?: string;
  filterTypeId?: number;
  featureTypeId?: number;
}
