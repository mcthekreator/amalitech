# Akeneo Import/Mapping CF cable structure information

## Rules (Akeneo/Source)

We need to interpret/analyse the `attr_conductor_number_...` fields for each chainflex cable.

### `attr_conductor_number_01` - `attr_conductor_number_n`

- `attr_conductor_number...` fields have to be consecutively numbered without gaps (starting with attr_conductor_number_01)
- if `Nu_Coulour_...` !== SH... than this entry is a core
  - `Nu_Coulour_...` specifies color & description of the core (needs to be defined further, see i.a.: https://igusdev.atlassian.net/l/cp/W13NRagV)
  - if a `couple_index_...` is provided, this is a twisted core (see rules below)
  - the `cross_section_...` specifies the thickness of the core
  - `pot_type_...` can be ignored
  - `shield_...` specifies the shield this core is (directly) shielded by, a shield can not shield itself
- if `Nu_Coulour_...` === SH (currently available in Akeneo: SH - SH16) than this entry is a shield
  - `Nu_Coulour_...` specifies description of the core
    - Example:
      - Nu_Coulour_SH1 --> description = SH1
  - SH is the key for the overall shield (description = SH0)

### `couple_index_...`

- if a `couple_index_...` is provided the core is twisted
  - the first number specifies the # of the twisted "group" of cores
  - the second number specifies the # of the individual core inside the twisted "group" (these groups can only consist consecutive cores)
    - Example:
      - first core: couple_index_1_1
      - second core: couple_index_1_2
      - no other core has a `couple_index_1_...`
      - this would specifiy that the first and the second core are a twisted pair
  - currently there is (for example) the possibility in Akeneo to set couple_index_1_1 - couple_index_1_5 which might indicate a twisting of up to 5 cores together
- if no `couple_index_...` is provided the core is not twisted
- `couple_index_...` entries can only be interpreted in "groups" (a couple_index_1_1 without at least couple_index_1_2 is not valid)

## Rules (Cable Structure/Target)

### horizontalOrder

- Twistings always have the horizontal order 1
- inner shields (!== SH0) always have horizontal order 2
- overall shield (SH0) always has horizontal order 3

## Examples / current Options (Akeneo/Source)

### `Nu_Coulour_...` !== SH... (Cores)

- see: https://igusdev.atlassian.net/l/cp/W13NRagV

### `Nu_Coulour_SH...` (Shields)

| Key             | Value |
| --------------- | ----- |
| Nu_Coulour_SH   | SH    |
| Nu_Coulour_SH1  | SH1   |
| Nu_Coulour_SH2  | SH2   |
| Nu_Coulour_SH3  | SH3   |
| Nu_Coulour_SH4  | SH4   |
| Nu_Coulour_SH5  | SH5   |
| Nu_Coulour_SH6  | SH6   |
| Nu_Coulour_SH7  | SH7   |
| Nu_Coulour_SH8  | SH8   |
| Nu_Coulour_SH9  | SH9   |
| Nu_Coulour_SH10 | SH10  |
| Nu_Coulour_SH11 | SH11  |
| Nu_Coulour_SH12 | SH12  |
| Nu_Coulour_SH13 | SH13  |
| Nu_Coulour_SH14 | SH14  |
| Nu_Coulour_SH15 | SH15  |
| Nu_Coulour_SH16 | SH16  |

### `couple_index_...`

couple_index_1_1
couple_index_1_2
couple_index_1_3
couple_index_1_4
couple_index_1_5

couple_index_2_1
couple_index_2_2
couple_index_2_3
couple_index_2_4
couple_index_2_5

couple_index_3_1
couple_index_3_2
couple_index_3_3
couple_index_3_4

couple_index_4_1
couple_index_4_2
couple_index_4_3
couple_index_4_4

couple_index_5_1
couple_index_5_2
couple_index_5_3
couple_index_5_4

couple_index_6_1
couple_index_6_2
couple_index_6_3
couple_index_6_4

couple_index_7_1
couple_index_7_2

couple_index_8_1
couple_index_8_2

couple_index_9_1
couple_index_9_2

couple_index_10_1
couple_index_10_2

couple_index_11_1
couple_index_11_2

couple_index_12_1
couple_index_12_2

couple_index_13_1
couple_index_13_2

couple_index_14_1
couple_index_14_2

couple_index_15_1
couple_index_15_2

couple_index_16_1
couple_index_16_2
couple_index_16_3
couple_index_16_4

couple_index_17_1
couple_index_17_2

couple_index_18_1
couple_index_18_2

### `cross_section_...` (Querschnitt/thickness)

| Key                | Value |
| ------------------ | ----- |
| cross_section_0_08 | 0,08  |
| cross_section_0_14 | 0,14  |
| cross_section_0_15 | 0,15  |
| cross_section_0_2  | 0,2   |
| cross_section_0_22 | 0,22  |
| cross_section_0_23 | 0,23  |
| cross_section_0_25 | 0,25  |
| cross_section_0_28 | 0,28  |
| cross_section_0_34 | 0,34  |
| cross_section_0_35 | 0,35  |
| cross_section_0_38 | 0,38  |
| cross_section_0_5  | 0,5   |
| cross_section_0_51 | 0,51  |
| cross_section_0_75 | 0,75  |
| cross_section_0_76 | 0,76  |
| cross_section_0_77 | 0,77  |
| cross_section_1    | 1     |
| cross_section_1_5  | 1,5   |
| cross_section_2    | 2     |
| cross_section_2_5  | 2,5   |
| cross_section_4    | 4     |
| cross_section_4_1  | 4,1   |
| cross_section_4_2  | 4,2   |
| cross_section_4_3  | 4,3   |
| cross_section_6    | 6     |
| cross_section_10   | 10    |
| cross_section_16   | 16    |
| cross_section_18   | 18    |
| cross_section_25   | 25    |
| cross_section_25_1 | 25,1  |
| cross_section_25_2 | 25,2  |
| cross_section_25_3 | 25,3  |
| cross_section_35   | 35    |
| cross_section_50   | 50    |
| cross_section_70   | 70    |
| cross_section_95   | 95    |
| cross_section_120  | 120   |
| cross_section_150  | 150   |
| cross_section_185  | 185   |
| cross_section_240  | 240   |

### `shield_...`

| Key         | Value |
| ----------- | ----- |
| shield_SH   | SH    |
| shield_SH1  | SH1   |
| shield_SH2  | SH2   |
| shield_SH3  | SH3   |
| shield_SH4  | SH4   |
| shield_SH5  | SH5   |
| shield_SH6  | SH6   |
| shield_SH7  | SH7   |
| shield_SH8  | SH8   |
| shield_SH9  | SH9   |
| shield_SH10 | SH10  |
| shield_SH11 | SH11  |
| shield_SH12 | SH12  |
| shield_SH13 | SH13  |
| shield_SH14 | SH14  |
| shield_SH15 | SH15  |
| shield_SH16 | SH16  |
