import { StringUtils } from '../../utils/string-utils';
import type { IcalcLocale } from '../chainflex';
import type { SingleCableCalculationPresentation } from '../single-cable-calculation';
import type { ExcelConfiguration } from './excel-file.model';
import { ExcelCalculationMat017ItemList } from './excel-file.model';
import type { ExcelProcessResult } from './process.model';
import type { WorkStepQuantities } from './work-step.model';

export class ProcessModelMappers {
  public static toExcelConfiguration(
    scc: SingleCableCalculationPresentation,
    processResults: ExcelProcessResult[],
    locale: IcalcLocale
  ): ExcelConfiguration | undefined {
    const configurationDataFromSCC = scc.configuration || scc.snapshot?.configurationData;

    if (!configurationDataFromSCC) {
      return;
    }
    const { chainFlexState } = configurationDataFromSCC.state;
    const { chainflexCable } = chainFlexState;

    const calculationExcelMat017ItemList = ExcelCalculationMat017ItemList.create(scc).getData();

    const workStepQuantitiesTemp = {} as WorkStepQuantities;

    const workSteps = [
      'projektierung',
      'auftragsmanagement',
      'einkaufDispo',
      'transportStock',
      'consignment',
      'stripOuterJacket',
      'stripInnerJacket',
      'shieldHandlingOuterShield',
      'shieldHandlingInnerShield',
      'stripShieldHandling',
      'assembly',
      'strip',
      'shieldHandling',
      'skinning',
      'crimp',
      'labeling',
      'drillingSealInsert',
      'test',
      'sendTestReport',
      'cutUnder20MM',
      'cutOver20MM',
      'testFieldPrep',
      'package',
    ] as const;

    workSteps.forEach((item) => {
      workStepQuantitiesTemp[item] =
        processResults
          .find((pr) => pr.configurationReference.sccId === scc.id)
          ?.workSteps?.find?.((workStep) => workStep.name === item)?.quantity ?? undefined;
    });

    let excelConfiguration: ExcelConfiguration = {
      batchSize: scc?.batchSize,
      description: StringUtils.coerceString(configurationDataFromSCC?.description),
      chainflexNumber: chainflexCable?.partNumber,
      chainflexPrice: `${chainflexCable?.price?.germanListPrice}`,
      chainflexLength: scc?.chainflexLength,
      chainflexOuterDiameter: chainflexCable?.outerDiameter?.amount,
      chainflexCableStructure: chainflexCable?.cableStructure?.[locale],
      chainFlexState,
      workStepSet: configurationDataFromSCC.state.workStepSet,
      matNumber: configurationDataFromSCC.matNumber,
      mat017ItemList: calculationExcelMat017ItemList,
      workStepQuantities: workStepQuantitiesTemp,
      configurationId: scc.configurationId,
      snapshotId: scc.snapshotId,
      ...(scc.snapshot && { workStepPrices: scc.snapshot.workStepPrices }),
    };

    if (scc?.calculationFactor) {
      excelConfiguration = {
        ...excelConfiguration,
        calculationFactor: scc.calculationFactor,
      };
    }

    return excelConfiguration;
  }
}
