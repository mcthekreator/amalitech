/* eslint-disable @typescript-eslint/naming-convention */
import type { Mat017ItemStatus } from '@igus/icalc-domain';

export interface Mat017ItemDbResult {
  id: string;
  mat_number: string;
  item_description_1: string;
  item_description_2: string;
  mat017_item_group: string;
  supplier_item_number: string;
  supplier_id: string;
  item_status: Mat017ItemStatus;
  modification_date: Date;
  price_unit: number;
  amount: number;
  amount_divided_by_price_unit: number;
  dynamic_score: number;
  manually_created: boolean;
}
