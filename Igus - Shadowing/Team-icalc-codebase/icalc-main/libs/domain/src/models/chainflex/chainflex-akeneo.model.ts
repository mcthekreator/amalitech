/* eslint-disable */
export interface Self {
  href: string;
}

export interface First {
  href: string;
}

export interface Next {
  href: string;
}

export interface Links {
  self: Self;
  first: First;
  next: Next;
}

export interface Self2 {
  href: string;
}

export interface Links2 {
  self: Self2;
}

export interface Labels {
  bg_BG?: any;
  cs_CZ?: any;
  da_DK?: any;
  de_DE: string;
  en_EU: string;
  en_GB: string;
  en_US?: any;
  es_ES: string;
  es_EU: string;
  fi_FI?: any;
  fr_FR?: any;
  hr_HR?: any;
  hu_HU?: any;
  id_ID?: any;
  it_IT?: any;
  ja_JP?: any;
  ko_KR?: any;
  nl_BE?: any;
  nl_NL?: any;
  pl_PL: string;
  pt_BR?: any;
  pt_PT?: any;
  ro_RO?: any;
  ru_RU?: any;
  sk_SK?: any;
  sl_SI?: any;
  sv_SE?: any;
  th_TH?: any;
  tr_TR?: any;
  vi_VN?: any;
  zh_CN?: any;
  zh_TW?: any;
}

export interface LinkedData {
  attribute: string;
  code: string;
  labels: Labels;
}

export interface AttrJacketMaterial {
  locale?: any;
  scope?: any;
  data: string;
  linked_data: LinkedData;
}

export interface AttrInnerJacketSimpleSelect {
  locale?: any;
  scope?: any;
  data: string;
  linked_data: LinkedData;
}

export interface AttrShieldingBoolean {
  locale?: any;
  scope?: any;
  data: boolean;
}

export interface AttrNumberOfCoresAndConductorNominalCrossSectionSimpleSelect {
  locale?: any;
  scope?: any;
  data: string;
  linked_data: LinkedData;
}

export interface PartNumber {
  locale?: any;
  scope?: any;
  data: string;
}

export interface ProductTeaserImage {
  locale?: any;
  scope: string;
  data: string[];
}

export interface AttrNumberOfCoresText {
  locale?: any;
  scope?: any;
  data: string;
}

export interface NominalCrossSectionTextLocalized {
  locale: string;
  scope?: any;
  data: string;
}

export interface ArticleDescriptionTextArea {
  locale: string;
  scope?: any;
  data: string;
}

export interface Data {
  amount: string;
  unit: string;
}

export interface AttrOuterDiameterMaxMetricMm {
  locale?: any;
  scope?: any;
  data: Data;
}

export interface WebshopURLPicture {
  locale?: any;
  scope: string;
  data: string;
}

export interface AttrUlCsaBoolean {
  locale?: any;
  scope?: any;
  data: boolean;
}

export interface AttrConductorNumber {
  locale?: any;
  scope?: any;
  data: string[];
}

export interface Values {
  attr_jacket_material: AttrJacketMaterial[];
  attr_inner_jacket_simple_select: AttrInnerJacketSimpleSelect[];
  attr_shielding_boolean: AttrShieldingBoolean[];
  attr_number_of_cores_and_conductor_nominal_cross_section_simple_select: AttrNumberOfCoresAndConductorNominalCrossSectionSimpleSelect[];
  part_number: PartNumber[];
  asset_product_teaser_image: ProductTeaserImage[]; // previously "product_teaser_image"
  attr_number_of_cores_text: AttrNumberOfCoresText[];
  nominal_cross_section_text_localized: NominalCrossSectionTextLocalized[];
  article_description_text_area: ArticleDescriptionTextArea[];
  attr_outer_diameter_max_metric_mm: AttrOuterDiameterMaxMetricMm[];
  webshop_URL_picture: WebshopURLPicture[];
  attr_ul_csa_boolean: AttrUlCsaBoolean[];
  attr_conductor_number_01?: AttrConductorNumber[];
  attr_conductor_number_02?: AttrConductorNumber[];
  attr_conductor_number_03?: AttrConductorNumber[];
  attr_conductor_number_04?: AttrConductorNumber[];
  attr_conductor_number_05?: AttrConductorNumber[];
  attr_conductor_number_06?: AttrConductorNumber[];
  attr_conductor_number_07?: AttrConductorNumber[];
  attr_conductor_number_08?: AttrConductorNumber[];
  attr_conductor_number_09?: AttrConductorNumber[];
  attr_conductor_number_10?: AttrConductorNumber[];
  attr_conductor_number_11?: AttrConductorNumber[];
  attr_conductor_number_12?: AttrConductorNumber[];
  attr_conductor_number_13?: AttrConductorNumber[];
  attr_conductor_number_14?: AttrConductorNumber[];
  attr_conductor_number_15?: AttrConductorNumber[];
  attr_conductor_number_16?: AttrConductorNumber[];
  attr_conductor_number_17?: AttrConductorNumber[];
  attr_conductor_number_18?: AttrConductorNumber[];
  attr_conductor_number_19?: AttrConductorNumber[];
  attr_conductor_number_20?: AttrConductorNumber[];
  attr_conductor_number_21?: AttrConductorNumber[];
  attr_conductor_number_22?: AttrConductorNumber[];
  attr_conductor_number_23?: AttrConductorNumber[];
  attr_conductor_number_24?: AttrConductorNumber[];
  attr_conductor_number_25?: AttrConductorNumber[];
  attr_conductor_number_26?: AttrConductorNumber[];
  attr_conductor_number_27?: AttrConductorNumber[];
  attr_conductor_number_28?: AttrConductorNumber[];
  attr_conductor_number_29?: AttrConductorNumber[];
  attr_conductor_number_30?: AttrConductorNumber[];
  attr_conductor_number_31?: AttrConductorNumber[];
  attr_conductor_number_32?: AttrConductorNumber[];
  attr_conductor_number_33?: AttrConductorNumber[];
  attr_conductor_number_34?: AttrConductorNumber[];
  attr_conductor_number_35?: AttrConductorNumber[];
  attr_conductor_number_36?: AttrConductorNumber[];
  attr_conductor_number_37?: AttrConductorNumber[];
  attr_conductor_number_38?: AttrConductorNumber[];
  attr_conductor_number_39?: AttrConductorNumber[];
  attr_conductor_number_40?: AttrConductorNumber[];
  attr_conductor_number_41?: AttrConductorNumber[];
  attr_conductor_number_42?: AttrConductorNumber[];
  attr_conductor_number_43?: AttrConductorNumber[];
  attr_conductor_number_44?: AttrConductorNumber[];
  attr_conductor_number_45?: AttrConductorNumber[];
  attr_conductor_number_46?: AttrConductorNumber[];
  attr_conductor_number_47?: AttrConductorNumber[];
  attr_conductor_number_48?: AttrConductorNumber[];
  attr_conductor_number_49?: AttrConductorNumber[];
  attr_conductor_number_50?: AttrConductorNumber[];
  attr_conductor_number_51?: AttrConductorNumber[];
  attr_conductor_number_52?: AttrConductorNumber[];
  attr_conductor_number_53?: AttrConductorNumber[];
  attr_conductor_number_54?: AttrConductorNumber[];
  attr_conductor_number_55?: AttrConductorNumber[];
  attr_conductor_number_56?: AttrConductorNumber[];
  attr_conductor_number_57?: AttrConductorNumber[];
  attr_conductor_number_58?: AttrConductorNumber[];
  attr_conductor_number_59?: AttrConductorNumber[];
  attr_conductor_number_60?: AttrConductorNumber[];
  attr_conductor_number_61?: AttrConductorNumber[];
}

export interface PACK {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface CFCase {
  products: string[];
  product_models: any[];
  groups: any[];
}

export interface UPSELL {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface XSELL {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface Shelves {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface Seperators {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface NewProduct {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface SUBSTITUTION {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface SupportTray {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface ESpoolLinear {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface RolEChainLink {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface SuitableProducts {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface GuideTroughSteel {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface LubricatingGrease {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface InteriorSeperation {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface AdapterEChainLink {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface AlternativeProducts {
  products: any[];
  product_models: string[];
  groups: any[];
}

export interface StandardEChainLink {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface GuideTroughAluminium {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface StrainreliefSeparator {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface ESpoolTwisterbandLeft {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface ESpoolTwisterbandRight {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface ESpoolInteriorSeperation {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface MountingBracketsKMAFixed {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface GuideTroughInstallationSet {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface MountingBracketsSteelFixed {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface MountingBracketsKMAPivoting {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface MountingBracketsPolymerFixed {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface MountingBracketsKMALongFixed {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface MountingBracketsSteelPivoting {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface GuideTroughAluminiumHeavyDuty {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface MountingBracketsPolymerPivoting {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface MountingBracketsKMALongPivoting {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface ESpoolTwisterbandInteriorSeperation {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface MountingBracketsKMAAbbreviatedFixed {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface MountingBracketsKMAPivotingOneSided {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface MountingBracketsKMAAbbreviatedPivoting {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface MountingBracketsPolymerPivotingOneSided {
  products: any[];
  product_models: any[];
  groups: any[];
}

export interface Associations {
  PACK: PACK;
  CFCase: CFCase;
  UPSELL: UPSELL;
  X_SELL: XSELL;
  shelves: Shelves;
  seperators: Seperators;
  new_product: NewProduct;
  SUBSTITUTION: SUBSTITUTION;
  support_tray: SupportTray;
  e_spool_linear: ESpoolLinear;
  rol_e_chain_link: RolEChainLink;
  suitable_products: SuitableProducts;
  guide_trough_steel: GuideTroughSteel;
  lubricating_grease: LubricatingGrease;
  Interior_seperation: InteriorSeperation;
  adapter_e_chain_link: AdapterEChainLink;
  alternative_products: AlternativeProducts;
  standard_e_chain_link: StandardEChainLink;
  guide_trough_aluminium: GuideTroughAluminium;
  strainrelief_separator: StrainreliefSeparator;
  e_spool_twisterband_left: ESpoolTwisterbandLeft;
  e_spool_twisterband_right: ESpoolTwisterbandRight;
  e_spool_interior_seperation: ESpoolInteriorSeperation;
  mounting_brackets_KMA_fixed: MountingBracketsKMAFixed;
  guide_trough_installation_set: GuideTroughInstallationSet;
  mounting_brackets_steel_fixed: MountingBracketsSteelFixed;
  mounting_brackets_KMA_pivoting: MountingBracketsKMAPivoting;
  mounting_brackets_polymer_fixed: MountingBracketsPolymerFixed;
  mounting_brackets_KMA_long_fixed: MountingBracketsKMALongFixed;
  mounting_brackets_steel_pivoting: MountingBracketsSteelPivoting;
  guide_trough_aluminium_heavy_duty: GuideTroughAluminiumHeavyDuty;
  mounting_brackets_polymer_pivoting: MountingBracketsPolymerPivoting;
  mounting_brackets_KMA_long_pivoting: MountingBracketsKMALongPivoting;
  e_spool_twisterband_interior_seperation: ESpoolTwisterbandInteriorSeperation;
  mounting_brackets_KMA_abbreviated_fixed: MountingBracketsKMAAbbreviatedFixed;
  mounting_brackets_KMA_pivoting_one_sided: MountingBracketsKMAPivotingOneSided;
  mounting_brackets_KMA_abbreviated_pivoting: MountingBracketsKMAAbbreviatedPivoting;
  mounting_brackets_polymer_pivoting_one_sided: MountingBracketsPolymerPivotingOneSided;
}

export interface QuantifiedAssociations {}

export interface Metadata {
  workflow_status: string;
}

export interface AkeneoItem {
  _links: Links2;
  identifier: string;
  enabled: boolean;
  family: string;
  categories: string[];
  groups: any[];
  parent: string;
  values: Values;
  created: Date;
  updated: Date;
  associations: Associations;
  quantified_associations: QuantifiedAssociations;
  metadata: Metadata;
}

export interface Embedded {
  items: AkeneoItem[];
}

export interface ChainflexAkeneo {
  _links: Links;
  _embedded: Embedded;
}
/* eslint-enable */
