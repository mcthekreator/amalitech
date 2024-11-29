import type {
  AkeneoItem,
  AttrConductorNumber,
  Core,
  CableStructureItemType,
  Shield,
  Twisting,
  Values,
} from '../../models';
import { colors } from './colors';

// TODO use string constants for akeneo fields

/**
 * Conductors are elements that define the structure of a CfItem.
 * They can be further defined as Core- or ShieldConductors.
 */
abstract class Conductor {
  public type: CableStructureItemType;
  public position: number; // the position this conductor is given, by the number of the key (attr_conductor_number_...)
  public shieldedBy: string | undefined; // shield this core/shield is directly shielded by
  public coreAmount: number; // amount of cores (for CoreConductors this should be 1, for ShieldConductors this specifies how many cores are directly shielded by this shield)

  constructor(keyString: string, data: string[]) {
    this.position = Number(keyString.toLowerCase().replace('attr_conductor_number_', ''));
    this.parseShieldedBy(data);
  }

  public getPosition(): number {
    return this.position;
  }

  private parseShieldedBy(data: string[]): void {
    const shieldCode: string | undefined = data.find((e) => e.startsWith('shield_'));

    if (shieldCode) {
      this.shieldedBy = shieldCode.replace('shield_', '');
      if (this.shieldedBy === 'SH') {
        this.shieldedBy = 'SH0';
      }
    }
  }

  public abstract validate(): string[];
}

/**
 * CoreColor encapsulates information on:
 * - cssClassName: how a core should be colored
 * - translateKey: which text should be displayed as a description for the core
 */
export interface CoreColor {
  cssClassName: string;
  translateKey: string;
}

/**
 * CoupleIndex encapsulates information on:
 * - coupleKey: the key of this specific couple of cores, which is the first number in the couple_index_... key (couple_index_firstNumber_secondNumber)
 * - index: the index of the core inside this specific couple, which is the second number in the couple_index_... key (couple_index_firstNumber_secondNumber)
 * - corePosition: the position of the core inside the whole structure (see position of Conductor)
 */
interface CoupleIndex {
  coupleKey: number;
  index: number;
  corePosition: number;
}

class CoreConductor extends Conductor {
  public color: CoreColor | undefined;
  public coupleIndex: CoupleIndex | undefined; // twisting structure
  public crossSection: number | undefined; // thickness

  constructor(keyString: string, data: string[]) {
    super(keyString, data);
    this.type = 'core';
    this.coreAmount = 1;

    this.parseColor(data);
    this.parseCoupleIndex(data);
    this.parseCrossSection(data);
  }

  public validate(): string[] {
    const errors: string[] = [];

    if (!this.color) {
      errors.push('missing or invalid color');
    }

    if (!this.crossSection) {
      errors.push('missing or invalid crossSection');
    }

    return errors;
  }

  private parseColor(data: string[]): void {
    const colorCode: string | undefined = data.find((e) => e.startsWith('Nu_Coulour_'));

    if (colorCode) {
      const colorObject = colors.find((e) => e.key === colorCode)?.value; // for more information on colors see: colors.md

      this.color = colorObject;
    }
  }

  private parseCoupleIndex(data: string[]): void {
    const completeCoupleIndexCode: string | undefined = data.find((e) => e.startsWith('couple_index_'));

    if (completeCoupleIndexCode) {
      const lastPartCoupleIndex = completeCoupleIndexCode.toLowerCase().replace('couple_index_', '');
      const coupleValues = lastPartCoupleIndex.split('_');

      this.coupleIndex = {
        coupleKey: Number(coupleValues[0]),
        index: Number(coupleValues[1]),
        corePosition: this.getPosition(),
      };
    }
  }

  private parseCrossSection(data: string[]): void {
    const completeCrossSectionCode: string | undefined = data.find((e) => e.startsWith('cross_section_'));

    if (completeCrossSectionCode) {
      const lastPartCrossSection = completeCrossSectionCode.toLowerCase().replace('cross_section_', ''); // example: cross_section_1_4

      this.crossSection = Number(lastPartCrossSection.toLowerCase().replace('_', '.')); // example result: 1.4
    }
  }
}

class ShieldConductor extends Conductor {
  public shieldKey: string; // key of this shield to match with shieldedBy of CoreConductors
  public shieldIndex: number; // index of this shield (# of this shield) in context of all shields

  constructor(keyString: string, data: string[]) {
    super(keyString, data);
    this.type = 'shield';

    this.parseShieldKeyAndShieldIndex(data);
  }

  public validate(): string[] {
    const errors: string[] = [];

    if (!this.shieldKey) {
      errors.push('missing shieldKey');
    }

    if (this.shieldKey === this.shieldedBy) {
      errors.push(
        'shieldKey (' +
          this.shieldKey +
          ') and shieldedBy (' +
          this.shieldedBy +
          ') are identical, a shield can not shield itself'
      );
    }

    if (!this.shieldKey?.startsWith('SH')) {
      errors.push('invalid shieldKey (' + this.shieldKey + '), must start with SH');
    }

    if (this.shieldIndex < 0) {
      errors.push('invalid shieldIndex (' + this.shieldIndex + '), must be greater or equal 0');
    }

    return errors;
  }

  private parseShieldKeyAndShieldIndex(data: string[]): void {
    const colorCode: string | undefined = data.find((e) => e.startsWith('Nu_Coulour_'));

    if (colorCode) {
      this.shieldKey = colorCode.replace('Nu_Coulour_', '');

      if (this.shieldKey === 'SH') {
        this.shieldKey = 'SH0';
      }

      const index = colorCode.replace('Nu_Coulour_SH', '');

      this.shieldIndex = Number(index);
    }
  }
}

class ConductorFactory {
  /**
   * produces Core- or ShieldConductors depending on input data
   *
   * @param conductorKey of this conductor entry
   * @param conductor Akeneo conductor attribute
   * @returns Core- or ShieldConductor
   */
  public static produce(conductorKey: string, conductor: AttrConductorNumber[]): Conductor {
    const data = conductor[0]['data'];
    const isShield = data.find((e: string) => e.startsWith('Nu_Coulour_SH'));

    return isShield ? new ShieldConductor(conductorKey, data) : new CoreConductor(conductorKey, data);
  }
}

export class CfItem {
  public partNumber: string;
  private conductors: Conductor[]; // all conductors
  private shields: ShieldConductor[]; // only shield conductors
  private coupleIndices: CoupleIndex[];
  private validationErrors: string[]; // collection of all validation errors

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(akeneoItem: AkeneoItem) {
    this.partNumber = akeneoItem.values?.part_number[0]?.data;

    if (!this.partNumber) {
      throw new Error('missing part_number');
    }
    this.conductors = [];

    for (const conductorKey in akeneoItem.values) {
      if (conductorKey.startsWith('attr_conductor_number_')) {
        this.conductors.push(
          ConductorFactory.produce(
            conductorKey,
            akeneoItem.values[conductorKey as keyof Values] as AttrConductorNumber[]
          )
        );
      }
    }

    this.conductors = this.conductors.sort((a, b) => a.position - b.position);

    this.shields = this.conductors
      .filter((e) => e.type === 'shield')
      .map((e) => e as ShieldConductor)
      .sort((a, b) => a.shieldIndex - b.shieldIndex);

    this.shields.forEach((shield) => {
      let coreCount = 0;

      this.conductors.forEach((e) => {
        if (e.shieldedBy === shield.shieldKey) {
          coreCount++;
        }
      });

      shield.coreAmount = coreCount;
    });

    this.coupleIndices = this.conductors
      .filter((e) => e.type === 'core')
      .map((e) => e as CoreConductor)
      .filter((e) => e.coupleIndex)
      .map((e) => e.coupleIndex as CoupleIndex)
      // eslint-disable-next-line prettier/prettier
      .sort((a, b) => a.coupleKey * 10000 + a.index - (b.coupleKey * 10000 + b.index)); // sorts all couple indices in ascending order: 1_1 = 10001, 1_2 = 100002, 2_1 = 20002, ...

    this.validationErrors = this.validate();
  }

  public isValid(): boolean {
    return this.validationErrors.length === 0;
  }

  public getValidationErrorList(): string[] {
    return this.validationErrors;
  }

  /**
   * getStructure maps conductor information of a CfItem into a readable/interpretable structure for the icalc frontend
   *
   * @returns (Core | Shield | Twisting)[]
   */
  public getStructure(): (Core | Shield | Twisting)[] {
    const conductorStructure: (Core | Shield | Twisting)[] = [];

    // add cores
    this.conductors
      .filter((e) => e.type === 'core')
      .map((e) => e as CoreConductor)
      .forEach((coreConductor) => {
        conductorStructure.push({
          type: coreConductor.type,
          color: coreConductor.color,
          thickness: coreConductor.crossSection,
        } as Core);
      });

    // add shields (optional)
    if (this.shields) {
      this.shields.forEach((shieldConductor) => {
        const shieldDesc = shieldConductor.shieldKey;

        const shieldedItems = this.conductors.filter((e) => e.shieldedBy === shieldDesc);

        let shieldedItemCount = 0;

        shieldedItems.forEach((item) => {
          if (item.type === 'shield') {
            shieldedItemCount++; // shields need to be counted once as shielded items as well
          }
          shieldedItemCount = shieldedItemCount + item.coreAmount; // cores get counted by adding coreAmounts for all conductor types
        });

        // shields get added to the result structure at the same indices as the origin structure
        conductorStructure.splice(this.conductors.indexOf(shieldConductor), 0, {
          type: shieldConductor.type,
          description: shieldDesc,
          shieldedItemCount,
          horizontalOrder: shieldConductor.shieldIndex === 0 ? 3 : 2, // see Validation Rules README (inner shields (!== SH0) always have horizontal order 2, overall shield (SH0) always has horizontal order 3)
        } as Shield);
      });
    }

    // add twistings (optional)
    if (this.coupleIndices) {
      const uniqueCoupleKeys: number[] = this.coupleIndices
        .map((e) => e.coupleKey)
        .filter((value, index, self) => self.indexOf(value) === index) // filters unique coupleKeys
        .sort((a, b) => a - b);

      uniqueCoupleKeys.forEach((coupleKey, index) => {
        const coupleCoreCount = this.coupleIndices.filter((e) => e.coupleKey === coupleKey).length; // identifies all cores with this coupleKey

        const insertPosition =
          Math.max(...this.coupleIndices.filter((e) => e.coupleKey === coupleKey).map((e) => e.corePosition)) + index; // identifies the position of the last twisted core which can be used as insert position (0-based) for the twisting

        conductorStructure.splice(insertPosition, 0, {
          type: 'twisting',
          twistedCoreCount: coupleCoreCount,
          horizontalOrder: 1, // see Validation Rules README (Twistings always have the horizontal order 1)
        } as Twisting);
      });
    }

    return conductorStructure;
  }

  private validate(): string[] {
    return [...this.validateConductors(), ...this.validateShields(), ...this.validateCoupleIndices()];
  }

  private validateConductors(): string[] {
    const errors: string[] = [];

    this.conductors.forEach((conductor, index: number) => {
      const conductorErrors = conductor.validate();

      conductorErrors.forEach((conductorError) => {
        errors.push('conductor #' + conductor.position + ': ' + conductorError); // adds individual conductor errors
      });

      if (index + 1 !== conductor.position) {
        errors.push('conductor #' + conductor.position + ' at index ' + (index + 1)); // validates order/position of conductors
      }
    });

    return errors;
  }

  private validateShields(): string[] {
    const errors: string[] = [];

    this.shields.forEach((shield, index) => {
      if (shield.shieldIndex !== index) {
        errors.push('invalid shieldIndex (#' + shield.shieldIndex + ' at index ' + index + ')'); // validates order/position of shields
      }
    });

    return errors;
  }

  private validateCoupleIndices(): string[] {
    const errors: string[] = [];

    const uniqueCoupleKeys: number[] = this.coupleIndices
      .map((e) => e.coupleKey)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a - b);

    uniqueCoupleKeys.forEach((coupleKey, index) => {
      if (coupleKey !== index + 1) {
        errors.push('invalid coupleKey (#' + coupleKey + ' at index ' + (index + 1) + ')'); // validates order/position of couple keys
      }

      const coupleKeyIndices = this.coupleIndices
        .filter((coupleIndex) => coupleIndex.coupleKey === coupleKey)
        .map((e) => e.index)
        .sort((a, b) => a - b);

      coupleKeyIndices.forEach((coupleKeyIndex, innerIndex) => {
        if (coupleKeyIndex !== innerIndex + 1) {
          errors.push(
            '[coupleKey ' +
              coupleKey +
              '] invalid coupleKeyIndex (#' +
              coupleKeyIndex +
              ' at index ' +
              (innerIndex + 1) +
              ')'
          ); // validates order/position of indices (coupleKeyIndices) inside an individual couple key
        }
      });

      if (coupleKeyIndices.length < 2) {
        errors.push('[coupleKey ' + coupleKey + '] invalid amount of coupleKeyIndices (less than 2)'); // a couple needs at least 2 cores
      }

      const coupleKeyCoreIndices = this.coupleIndices
        .filter((coupleIndex) => coupleIndex.coupleKey === coupleKey)
        .map((e) => e.corePosition)
        .sort((a, b) => a - b);

      let previousIndex = coupleKeyCoreIndices[0] - 1;

      coupleKeyCoreIndices.forEach((coupleKeyCorePosition) => {
        if (coupleKeyCorePosition !== previousIndex + 1) {
          // coupleKeyCoreIndices (the indices/positions of all cores which are part of a coupleKey (twisting)) have to be consecutive, a twisting can not span cores that are not part of the twisting itself
          errors.push('[coupleKey ' + coupleKey + '] coupleKeyCoreIndices are not consecutive');
        }
        previousIndex = coupleKeyCorePosition;
      });
    });

    return errors;
  }
}
