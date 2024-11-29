import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as tmp from 'tmp';
import { ArrayUtils, NumberUtils } from '@igus/icalc-utils';
import type {
  Calculation,
  ExcelProcessResult,
  ExcelProductionPlans,
  FileDownloadOptions,
  IcalcLocale,
  OuterDiameter,
  ProductionPlan,
  SingleCableCalculationPresentation,
} from '@igus/icalc-domain';
import {
  CustomerTypeEnum,
  ExcelProductionPlanMat017ItemList,
  FileFormatEnum,
  ProcessModelMappers,
  WorkStepName,
  WorkStepPricesValueObject,
  WorkStepSet,
} from '@igus/icalc-domain';
import { CalculationDataAccessService } from '@igus/icalc-calculations-infrastructure';

import AdmZip from 'adm-zip';
import sizeOf from 'image-size';
import type { ISizeCalculationResult } from 'image-size/dist/types/interface';
import {
  calculationFactorColumn,
  configurationBatchSizeColumn,
  configurationGesamtColumn,
  configurationGesamtValueColumn,
  configurationInfoOp2Column,
  configurationDescriptionColumn,
  configurationMatNumberColumn,
  configurationPosIndexColumn,
  customerTypeStartCoord,
  discountColumn,
  mat017ItemAndWorkStepRiskFactorColumn,
  mat017ItemDescription1Column,
  mat017ItemDescription2Column,
  mat017ItemGroupColumn,
  mat017ItemNumberColumn,
  mat017ItemPriceColumn,
  mat017ItemQuantityColumn,
  mat017ItemRiskFactorColumn,
  mat017ItemSupplierItemNumberColumn,
  priceAllPositionsColumn,
  pricePerPositionColumn,
  priceTotalColumn,
  workStepNameColumn,
  workStepPriceColumn,
  workStepQuantityColumn,
  quoteNumberColumn,
  customerColumn,
} from './excel-column-index';
import type { StandardWorkStepCellDefinition, StandardWorkStepStartingRows } from './excel-work-step-row-definitions';
import {
  buildWorkStepRowDefinitions,
  calcFactorAndRiskFactorRow,
  configurationBatchSizeAndPosIndexRow,
  configurationEndBorderRow,
  configurationGesamtRow,
  configurationInfoOp2Row,
  configurationDescriptionRow,
  configurationMatNumberAndTotalRow,
  quoteNumberRow,
  customerRow,
} from './excel-work-step-row-definitions';
import { configurationGesamtCellStyleAndFormat } from './static-cell-styles';
import { ConvertToXlsService } from './convert-to-xls-service';

@Injectable()
export class ExcelService {
  constructor(
    private readonly calculationDataAcessService: CalculationDataAccessService,
    private readonly convertToXlsService: ConvertToXlsService
  ) {}

  public async generateExcelCalculationFile(
    calculation: Calculation,
    singleCableCalculations: SingleCableCalculationPresentation[],
    customerType: string,
    customerTypeEnum: CustomerTypeEnum,
    processResults: ExcelProcessResult[],
    locale: IcalcLocale
  ): Promise<unknown> {
    if (!calculation) {
      throw new NotFoundException(`No calculation was provided.`);
    }

    const baseFile = __dirname + '/assets/Vorlage-Kalkulation-ICALC-211.xlsx';
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(baseFile);

    // get the main worksheet (the cells need absolute data, which igus uses in later working steps outside of icalc)
    const sheet = workbook.getWorksheet(1);

    // format variables for calculation
    const calculationFactorRounded = NumberUtils.round(calculation.calculationFactor);

    const quoteNumber = calculation.quoteNumber;
    const customer = calculation.customer;

    const mat017ItemRiskFactor = calculation.mat017ItemRiskFactor;
    const mat017ItemAndWorkStepRiskFactor = calculation.mat017ItemAndWorkStepRiskFactor;

    // calculation: get cell values
    const riskFactorYear = Number(sheet.getCell(`${pricePerPositionColumn}${calcFactorAndRiskFactorRow}`).value);
    const riskFactorMonth = Number(sheet.getCell(`${priceAllPositionsColumn}${calcFactorAndRiskFactorRow}`).value);

    // configuration: get row templates
    const configurationBatchSizeAndPosIndexTemplateRow = sheet.getRow(configurationBatchSizeAndPosIndexRow);
    const configurationDescriptionTemplateRow = sheet.getRow(configurationDescriptionRow);
    const configurationMatNumberAndTotalTemplateRow = sheet.getRow(configurationMatNumberAndTotalRow);
    const configurationInfoOp2TemplateRow = sheet.getRow(configurationInfoOp2Row);

    // configuration: get cell styles
    const configurationBatchSizeCellStyle =
      configurationBatchSizeAndPosIndexTemplateRow.getCell(configurationBatchSizeColumn).style;
    const configurationPosIndexCellStyle =
      configurationBatchSizeAndPosIndexTemplateRow.getCell(configurationPosIndexColumn).style;
    const configurationDescriptionCellStyle =
      configurationDescriptionTemplateRow.getCell(configurationMatNumberColumn).style;
    const configurationMatNumberCellStyle =
      configurationMatNumberAndTotalTemplateRow.getCell(configurationMatNumberColumn).style;
    const configurationInfoOp2CellStyle = configurationInfoOp2TemplateRow.getCell(configurationInfoOp2Column).style;

    // configuration: get cell values
    const configurationInfoOp2CellValue = configurationInfoOp2TemplateRow.getCell(configurationInfoOp2Column).value;

    // General used Row Index
    let rowsAddedToExcelCounter = 0;
    let startRowTotalPrice = 53;
    const endRowTotalPrice = 71;
    const startRowDifferenceToNextConfiguration = 29;

    // mat017Item
    const mat017ItemRow = 53;

    // chainflex: info coordinates
    const chainflexNumberColumn = 'B';
    const chainflexOuterDiameterColumn = 'C';
    const chainflexCableStructureColumn = 'E';
    const chainflexPriceColumn = 'F';
    const chainflexLengthColumn = 'G';
    const chainflexRow = 49;

    // chainflex: get row template
    const chainflexRowTemplate = sheet.getRow(chainflexRow);

    // chainflex: get cell styles
    const chainflexNumberCellStyle = chainflexRowTemplate.getCell(chainflexNumberColumn).style;
    const chainflexOuterDiameterCellStyle = chainflexRowTemplate.getCell(chainflexOuterDiameterColumn).style;
    const chainflexCableStructureCellStyle = chainflexRowTemplate.getCell(chainflexCableStructureColumn).style;
    const chainflexPriceCellStyle = chainflexRowTemplate.getCell(chainflexPriceColumn).style;
    const chainflexLengthCellStyle = chainflexRowTemplate.getCell(chainflexLengthColumn).style;
    const chainflexDiscountCellStyle = chainflexRowTemplate.getCell(discountColumn).style;
    const chainflexMarketFactorCellStyle = chainflexRowTemplate.getCell(calculationFactorColumn).style;
    const chainflexPricePerPositionCellStyle = chainflexRowTemplate.getCell(pricePerPositionColumn).style;
    const chainflexPriceAllPositionsCellStyle = chainflexRowTemplate.getCell(priceAllPositionsColumn).style;
    const chainflexPriceTotalColumnCellStyle = chainflexRowTemplate.getCell(priceTotalColumn).style;

    // chainflex: set values not used by iCalc
    const chainflexDiscountValue = Number(chainflexRowTemplate.getCell(discountColumn).value);

    // mat017Item: get row template
    const mat017ItemRowTemplate = sheet.getRow(mat017ItemRow);

    // mat017Item: get cell styles
    const mat017ItemNumberCellStyle = mat017ItemRowTemplate.getCell(mat017ItemNumberColumn).style;
    const mat017ItemDescription1CellStyle = mat017ItemRowTemplate.getCell(mat017ItemDescription1Column).style;
    const mat017ItemDescription2CellStyle = mat017ItemRowTemplate.getCell(mat017ItemDescription2Column).style;
    const mat017ItemGroupCellStyle = mat017ItemRowTemplate.getCell(mat017ItemGroupColumn).style;
    const mat017ItemSupplierItemNumberCellStyle = mat017ItemRowTemplate.getCell(
      mat017ItemSupplierItemNumberColumn
    ).style;
    const mat017ItemPriceCellStyle = mat017ItemRowTemplate.getCell(mat017ItemPriceColumn).style;
    const mat017ItemQuantityCellStyle = mat017ItemRowTemplate.getCell(mat017ItemQuantityColumn).style;
    const mat017ItemDiscountCellStyle = mat017ItemRowTemplate.getCell(discountColumn).style;
    const mat017ItemMarketFactorCellStyle = mat017ItemRowTemplate.getCell(calculationFactorColumn).style;
    const mat017ItemPricePerPositionCellStyle = mat017ItemRowTemplate.getCell(pricePerPositionColumn).style;
    const mat017ItemPriceAllPositionsCellStyle = mat017ItemRowTemplate.getCell(priceAllPositionsColumn).style;

    sheet.getCell(customerTypeStartCoord).value = customerType;
    sheet.getCell(`${calculationFactorColumn}${calcFactorAndRiskFactorRow}`).value = calculationFactorRounded;

    sheet.getCell(`${quoteNumberColumn}${quoteNumberRow}`).value = quoteNumber;
    sheet.getCell(`${customerColumn}${customerRow}`).value = customer;

    sheet.getCell(`${mat017ItemRiskFactorColumn}${calcFactorAndRiskFactorRow}`).value = mat017ItemRiskFactor;
    sheet.getCell(`${mat017ItemAndWorkStepRiskFactorColumn}${calcFactorAndRiskFactorRow}`).value =
      mat017ItemAndWorkStepRiskFactor;

    ArrayUtils.fallBackToEmptyArray(singleCableCalculations).forEach((scc, configIndex) => {
      const configuration = ProcessModelMappers.toExcelConfiguration(scc, processResults, locale);

      // format individual calculation factor
      let individualCalculationFactorRounded = null;

      if (scc?.calculationFactor) {
        individualCalculationFactorRounded = NumberUtils.round(configuration?.calculationFactor);
      }

      // configuration: relevant variables/ constants
      const chainflexPriceRounded = Number(configuration?.chainflexPrice);

      const workStepsPriceTotalResult = 0;
      //mat017Item: const
      let mat017ItemTotalPriceResult = 0;

      // configuration: insert
      sheet.getCell(
        `${configurationPosIndexColumn}${configurationBatchSizeAndPosIndexRow + rowsAddedToExcelCounter}`
      ).value = `${configIndex + 1}`;

      sheet.getCell(
        `${configurationPosIndexColumn}${configurationBatchSizeAndPosIndexRow + rowsAddedToExcelCounter}`
      ).style = configurationPosIndexCellStyle;

      sheet.getCell(
        `${configurationBatchSizeColumn}${configurationBatchSizeAndPosIndexRow + rowsAddedToExcelCounter}`
      ).value = configuration?.batchSize;

      sheet.getCell(
        `${configurationBatchSizeColumn}${configurationBatchSizeAndPosIndexRow + rowsAddedToExcelCounter}`
      ).style = configurationBatchSizeCellStyle;

      sheet.getCell(`${configurationDescriptionColumn}${configurationDescriptionRow + rowsAddedToExcelCounter}`).value =
        configuration?.description;

      sheet.getCell(`${configurationDescriptionColumn}${configurationDescriptionRow + rowsAddedToExcelCounter}`).style =
        configurationDescriptionCellStyle;

      // chainflex: insert
      const snapshotChainflexRow = chainflexRow + rowsAddedToExcelCounter;

      sheet.getCell(`${chainflexNumberColumn}${chainflexRow + rowsAddedToExcelCounter}`).value =
        configuration?.chainflexNumber;
      sheet.getCell(`${chainflexNumberColumn}${chainflexRow + rowsAddedToExcelCounter}`).style =
        chainflexNumberCellStyle;
      sheet.getCell(`${chainflexOuterDiameterColumn}${chainflexRow + rowsAddedToExcelCounter}`).value =
        configuration?.chainflexOuterDiameter;
      sheet.getCell(`${chainflexOuterDiameterColumn}${chainflexRow + rowsAddedToExcelCounter}`).style =
        chainflexOuterDiameterCellStyle;
      sheet.getCell(`${chainflexCableStructureColumn}${chainflexRow + rowsAddedToExcelCounter}`).value =
        configuration?.chainflexCableStructure;
      sheet.getCell(`${chainflexCableStructureColumn}${chainflexRow + rowsAddedToExcelCounter}`).style =
        chainflexCableStructureCellStyle;
      sheet.getCell(`${chainflexPriceColumn}${chainflexRow + rowsAddedToExcelCounter}`).value = chainflexPriceRounded;
      sheet.getCell(`${chainflexPriceColumn}${chainflexRow + rowsAddedToExcelCounter}`).style = chainflexPriceCellStyle;
      sheet.getCell(`${chainflexLengthColumn}${chainflexRow + rowsAddedToExcelCounter}`).value =
        configuration?.chainflexLength;
      sheet.getCell(`${chainflexLengthColumn}${chainflexRow + rowsAddedToExcelCounter}`).style =
        chainflexLengthCellStyle;
      sheet.getCell(`${discountColumn}${chainflexRow + rowsAddedToExcelCounter}`).value = chainflexDiscountValue;
      sheet.getCell(`${discountColumn}${chainflexRow + rowsAddedToExcelCounter}`).style = chainflexDiscountCellStyle;
      // =I45
      const chainflexMarketFactorResult = individualCalculationFactorRounded
        ? individualCalculationFactorRounded
        : calculationFactorRounded;

      sheet.getCell(`${calculationFactorColumn}${chainflexRow + rowsAddedToExcelCounter}`).value = {
        formula: individualCalculationFactorRounded
          ? individualCalculationFactorRounded
          : `=${calculationFactorColumn}${calcFactorAndRiskFactorRow}`,
        result: chainflexMarketFactorResult,
        date1904: false,
      };

      sheet.getCell(`${calculationFactorColumn}${chainflexRow + rowsAddedToExcelCounter}`).style =
        chainflexMarketFactorCellStyle;

      // =ROUND(F49*H49*I49;2)
      const chainflexPricePerPositionResult = NumberUtils.round(
        chainflexPriceRounded * chainflexDiscountValue * chainflexMarketFactorResult
      );

      sheet.getCell(`${pricePerPositionColumn}${chainflexRow + rowsAddedToExcelCounter}`).value = {
        formula: `ROUND(${chainflexPriceColumn}${chainflexRow + rowsAddedToExcelCounter}*${discountColumn}${
          chainflexRow + rowsAddedToExcelCounter
        }*${calculationFactorColumn}${chainflexRow + rowsAddedToExcelCounter},2)`,
        result: chainflexPricePerPositionResult,
        date1904: false,
      };
      sheet.getCell(`${pricePerPositionColumn}${chainflexRow + rowsAddedToExcelCounter}`).style =
        chainflexPricePerPositionCellStyle;

      // =ROUND(G49*J49;2)
      const chainflexPriceAllPositionsResult = NumberUtils.round(
        configuration?.chainflexLength * chainflexPricePerPositionResult
      );

      sheet.getCell(`${priceAllPositionsColumn}${chainflexRow + rowsAddedToExcelCounter}`).value = {
        formula: `ROUND(${chainflexLengthColumn}${chainflexRow + rowsAddedToExcelCounter}*${pricePerPositionColumn}${
          chainflexRow + rowsAddedToExcelCounter
        },2)`,
        result: chainflexPriceAllPositionsResult,
        date1904: false,
      };
      sheet.getCell(`${priceAllPositionsColumn}${chainflexRow + rowsAddedToExcelCounter}`).style =
        chainflexPriceAllPositionsCellStyle;
      // =SUM(K49)
      const chainflexPriceTotalResult = chainflexPriceAllPositionsResult;

      sheet.getCell(`${priceTotalColumn}${chainflexRow + rowsAddedToExcelCounter}`).value = {
        formula: `SUM(${priceAllPositionsColumn}${chainflexRow + rowsAddedToExcelCounter})`,
        result: chainflexPriceTotalResult,
        date1904: false,
      };
      sheet.getCell(`${priceTotalColumn}${chainflexRow + rowsAddedToExcelCounter}`).style =
        chainflexPriceTotalColumnCellStyle;

      // configuration: insert after chainflex info
      sheet.getCell(
        `${configurationMatNumberColumn}${configurationMatNumberAndTotalRow + rowsAddedToExcelCounter}`
      ).value = configuration?.matNumber;
      sheet.getCell(
        `${configurationMatNumberColumn}${configurationMatNumberAndTotalRow + rowsAddedToExcelCounter}`
      ).style = configurationMatNumberCellStyle;
      sheet.getCell(`${configurationInfoOp2Column}${configurationInfoOp2Row + rowsAddedToExcelCounter}`).value =
        configurationInfoOp2CellValue;
      sheet.getCell(`${configurationInfoOp2Column}${configurationInfoOp2Row + rowsAddedToExcelCounter}`).style =
        configurationInfoOp2CellStyle;
      const configurationPriceTotalRow = configurationMatNumberAndTotalRow + rowsAddedToExcelCounter;

      startRowTotalPrice = configurationPriceTotalRow + 3;

      // mat017Item: insert
      ArrayUtils.fallBackToEmptyArray(configuration?.mat017ItemList).forEach((mat017Item, matIndex) => {
        let tempMat017ItemRow = mat017ItemRow;

        if (matIndex !== 0 && configIndex === 0) {
          rowsAddedToExcelCounter += 1;
          tempMat017ItemRow += rowsAddedToExcelCounter;
          sheet.insertRow(tempMat017ItemRow, {}, 'n');
        } else if (matIndex !== 0 || configIndex !== 0) {
          tempMat017ItemRow += rowsAddedToExcelCounter;
          rowsAddedToExcelCounter += 1;
        }

        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemNumberColumn).value = mat017Item[0];
        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemNumberColumn).style = mat017ItemNumberCellStyle;
        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemDescription1Column).value = mat017Item[1];
        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemDescription1Column).style = mat017ItemDescription1CellStyle;
        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemDescription2Column).value = mat017Item[2];
        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemDescription2Column).style = mat017ItemDescription2CellStyle;
        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemGroupColumn).value = mat017Item[3];
        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemGroupColumn).style = mat017ItemGroupCellStyle;
        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemSupplierItemNumberColumn).value = mat017Item[4];
        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemSupplierItemNumberColumn).style =
          mat017ItemSupplierItemNumberCellStyle;
        const mat017ItemPriceRounded = NumberUtils.round(mat017Item[5]);

        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemPriceColumn).value = mat017ItemPriceRounded;
        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemPriceColumn).style = mat017ItemPriceCellStyle;
        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemQuantityColumn).value = mat017Item[6];
        sheet.getRow(tempMat017ItemRow).getCell(mat017ItemQuantityColumn).style = mat017ItemQuantityCellStyle;
        const mat017ItemDiscountResult = NumberUtils.round(riskFactorYear * riskFactorMonth);

        // =J45*K45
        sheet.getRow(tempMat017ItemRow).getCell(discountColumn).value = {
          formula: `${pricePerPositionColumn}${calcFactorAndRiskFactorRow}*${priceAllPositionsColumn}${calcFactorAndRiskFactorRow}`,
          result: mat017ItemDiscountResult,
          date1904: false,
        };
        sheet.getRow(tempMat017ItemRow).getCell(discountColumn).style = mat017ItemDiscountCellStyle;
        // =I45
        const mat017ItemMarketFactorResult = individualCalculationFactorRounded
          ? individualCalculationFactorRounded
          : calculationFactorRounded;

        sheet.getRow(tempMat017ItemRow).getCell(calculationFactorColumn).value = {
          formula: individualCalculationFactorRounded
            ? individualCalculationFactorRounded
            : `=${calculationFactorColumn}${calcFactorAndRiskFactorRow}`,
          result: mat017ItemMarketFactorResult,
          date1904: false,
        };
        sheet.getRow(tempMat017ItemRow).getCell(calculationFactorColumn).style = mat017ItemMarketFactorCellStyle;

        // =ROUND(F53*H53*I53;2)
        const mat017ItemPricePerPositionResult = NumberUtils.round(
          mat017ItemPriceRounded * mat017ItemDiscountResult * mat017ItemMarketFactorResult
        );

        sheet.getRow(tempMat017ItemRow).getCell(pricePerPositionColumn).value = {
          formula: `ROUND(${mat017ItemPriceColumn}${tempMat017ItemRow}*${discountColumn}${tempMat017ItemRow}*${calculationFactorColumn}${tempMat017ItemRow},2)`,
          result: mat017ItemPricePerPositionResult,
          date1904: false,
        };
        sheet.getRow(tempMat017ItemRow).getCell(pricePerPositionColumn).style = mat017ItemPricePerPositionCellStyle;
        // =ROUND(G53*J53;2)
        const mat017ItemPriceAllPositionResult = NumberUtils.round(mat017Item[6] * mat017ItemPricePerPositionResult);

        sheet.getRow(tempMat017ItemRow).getCell(priceAllPositionsColumn).value = {
          formula: `ROUND(${mat017ItemQuantityColumn}${tempMat017ItemRow}*${pricePerPositionColumn}${tempMat017ItemRow},2)`,
          result: mat017ItemPriceAllPositionResult,
          date1904: false,
        };
        sheet.getRow(tempMat017ItemRow).getCell(priceAllPositionsColumn).style = mat017ItemPriceAllPositionsCellStyle;
        mat017ItemTotalPriceResult += mat017ItemPriceAllPositionResult;
      });

      // this needs to be done to have only one empty row between mat017Item and workSteps for all configurations and not only the first
      // the first configuration is modifying template rows while the other configurations are inserting rows.
      if (configIndex !== 0) {
        rowsAddedToExcelCounter -= 1;
      }

      const { workStepSet, workStepPrices, chainFlexState } = configuration;
      const { value: workStepPricesValue, error } = WorkStepPricesValueObject.create(
        workStepSet,
        chainFlexState,
        workStepPrices
      ).getValue();

      if (error) {
        throw new NotAcceptableException('Could not complete calculation - provided workStepPrices are not valid');
      }

      const {
        workStepNameStyles,
        workStepQuantityStyles,
        workStepCalculationFactorStyles,
        workStepName,
        workStepDiscountStyles,
        workStepPricePerPositionStyles,
        workStepPriceAllPositionsStyles,
        workStepStartingRows,
      } = buildWorkStepRowDefinitions<
        StandardWorkStepCellDefinition<ExcelJS.Style>,
        StandardWorkStepCellDefinition<ExcelJS.CellValue>,
        StandardWorkStepStartingRows
      >(sheet, configuration.workStepSet);

      // workStep: insert info
      Object.keys(workStepStartingRows).forEach((key, i) => {
        if (!workStepPricesValue[WorkStepName[key]]) {
          return;
        }
        let price = workStepPricesValue[WorkStepName[key]].serialCustomer;

        if (customerTypeEnum === CustomerTypeEnum.betriebsMittler) {
          price = workStepPricesValue[WorkStepName[key]].betriebsMittler;
        }
        const workStepRow = workStepStartingRows[key] + rowsAddedToExcelCounter;

        sheet.getRow(workStepRow).getCell(`${workStepNameColumn}`).value = workStepName[key];
        sheet.getRow(workStepRow).getCell(`${workStepNameColumn}`).style = workStepNameStyles[key];
        sheet.getRow(workStepRow).getCell(`${mat017ItemDescription1Column}`).style = workStepNameStyles[key];
        sheet.getRow(workStepRow).getCell(`${mat017ItemDescription2Column}`).style = workStepNameStyles[key];
        sheet.getRow(workStepRow).getCell(`${mat017ItemGroupColumn}`).style = workStepNameStyles[key];
        sheet.getRow(workStepRow).getCell(`${mat017ItemSupplierItemNumberColumn}`).style = workStepNameStyles[key];
        sheet.getRow(workStepRow).getCell(`${priceTotalColumn}`).style = workStepNameStyles[key];
        sheet.getRow(workStepRow).getCell(`${mat017ItemNumberColumn}`).style = workStepNameStyles[key];

        if (key === 'cutOver20MM') {
          sheet.getRow(workStepRow).getCell(`${mat017ItemDescription2Column}`).value =
            'für Leitungen ab 20mm Außendurchmesser / more than 20mm diameter';
          sheet.getRow(workStepRow).getCell(`${mat017ItemDescription2Column}`).style = workStepNameStyles[key];
        } else if (key === 'cutUnder20MM') {
          sheet.getRow(workStepRow).getCell(`${mat017ItemDescription2Column}`).value =
            'für Leitungen bis 20mm Außendurchmesser / 0-20mm diameter';
          sheet.getRow(workStepRow).getCell(`${mat017ItemDescription2Column}`).style = workStepNameStyles[key];
        }

        const quantity = configuration?.workStepQuantities?.[key] ? configuration?.workStepQuantities?.[key] : 0;

        sheet.getRow(workStepRow).getCell(`${workStepQuantityColumn}`).value = quantity;
        sheet.getRow(workStepRow).getCell(`${workStepQuantityColumn}`).style = workStepQuantityStyles[key];
        sheet.getRow(workStepRow).getCell(`${workStepPriceColumn}`).value = price;
        sheet.getRow(workStepRow).getCell(`${workStepPriceColumn}`).style = workStepPricePerPositionStyles[key];

        // =K45 (risk factor month)
        sheet.getRow(workStepRow).getCell(`${discountColumn}`).value = {
          formula: `=${priceAllPositionsColumn}${calcFactorAndRiskFactorRow}`,
          result: `${riskFactorMonth}`,
          date1904: false,
        };
        sheet.getRow(workStepRow).getCell(`${discountColumn}`).style = workStepDiscountStyles[key];
        // =I45 (calculation factor)
        const workStepsMarketFactorResult = individualCalculationFactorRounded
          ? individualCalculationFactorRounded
          : calculationFactorRounded;

        sheet.getRow(workStepRow).getCell(`${calculationFactorColumn}`).value = {
          formula: individualCalculationFactorRounded
            ? individualCalculationFactorRounded
            : `=${calculationFactorColumn}${calcFactorAndRiskFactorRow}`,
          result: `${workStepsMarketFactorResult}`,
          date1904: false,
        };
        sheet.getRow(workStepRow).getCell(`${calculationFactorColumn}`).style = workStepCalculationFactorStyles[key];
        // =ROUND(F55*H55*I55;2)
        const workStepPricePerPosition = NumberUtils.round(price * workStepsMarketFactorResult * riskFactorMonth);

        // =ROUND(G55*J55;2)
        sheet.getRow(workStepRow).getCell(pricePerPositionColumn).value = {
          formula: `ROUND(${workStepPriceColumn}${workStepRow}*${discountColumn}${workStepRow}*${calculationFactorColumn}${workStepRow},2)`,
          result: workStepPricePerPosition,
          date1904: false,
        };

        sheet.getRow(workStepRow).getCell(pricePerPositionColumn).style = workStepPricePerPositionStyles[key];

        sheet.getRow(workStepRow).getCell(priceAllPositionsColumn).value = {
          formula: `ROUND(${workStepQuantityColumn}${workStepRow}*${pricePerPositionColumn}${workStepRow},2)`,
          result: NumberUtils.round(price * workStepsMarketFactorResult * riskFactorMonth),
          date1904: false,
        };

        sheet.getRow(workStepRow).getCell(priceAllPositionsColumn).style = workStepPriceAllPositionsStyles[key];

        // update unintentional spacing after last row
        if (Object.keys(workStepStartingRows).length === i + 1) {
          switch (workStepSet) {
            case WorkStepSet.driveCliq:
              sheet.spliceRows(workStepRow + 1, 2);
              break;
            case WorkStepSet.ethernet:
              sheet.spliceRows(workStepRow + 1, 2);
              break;
            default:
              break;
          }
        }
      });

      const configurationPriceTotalResult = NumberUtils.round(mat017ItemTotalPriceResult + workStepsPriceTotalResult);

      switch (workStepSet) {
        case WorkStepSet.driveCliq:
          rowsAddedToExcelCounter = rowsAddedToExcelCounter - 2;
          break;
        case WorkStepSet.ethernet:
          rowsAddedToExcelCounter = rowsAddedToExcelCounter - 2;
          break;
        case WorkStepSet.machineLine:
          rowsAddedToExcelCounter = rowsAddedToExcelCounter + 2;
          break;
        default:
          break;
      }

      sheet.getCell(`${priceTotalColumn}${configurationPriceTotalRow}`).value = {
        formula: `SUM(${priceAllPositionsColumn}${startRowTotalPrice}:${priceAllPositionsColumn}${
          endRowTotalPrice + rowsAddedToExcelCounter
        })`,
        result: configurationPriceTotalResult,
        date1904: false,
      };

      // Set border above Gesamt
      const configurationGesamtCellValue = 'Gesamt';

      sheet.getCell(`${configurationGesamtColumn}${configurationGesamtRow + rowsAddedToExcelCounter}`).style =
        configurationGesamtCellStyleAndFormat;

      sheet.getCell(`${configurationGesamtValueColumn}${configurationGesamtRow + rowsAddedToExcelCounter}`).style =
        configurationGesamtCellStyleAndFormat;

      sheet.getCell(`${configurationGesamtColumn}${configurationGesamtRow + rowsAddedToExcelCounter}`).value =
        configurationGesamtCellValue;

      sheet.getCell(`${configurationGesamtColumn}${configurationGesamtRow + rowsAddedToExcelCounter}`).style =
        configurationGesamtCellStyleAndFormat;

      sheet.getCell(`${configurationGesamtValueColumn}${configurationGesamtRow + rowsAddedToExcelCounter}`).style =
        configurationGesamtCellStyleAndFormat;

      // SUM(M49:M50) Gesamt Formula
      const configurationTotalResult = NumberUtils.round(chainflexPriceTotalResult + configurationPriceTotalResult);

      sheet.getCell(`${configurationGesamtValueColumn}${configurationGesamtRow + rowsAddedToExcelCounter}`).value = {
        formula: `SUM(${priceTotalColumn}${snapshotChainflexRow}:${priceTotalColumn}${configurationPriceTotalRow})`,
        result: configurationTotalResult,
        date1904: false,
      };

      // create medium border after each Configuration
      for (let cellColumn = 1; cellColumn < 14; cellColumn++) {
        if (cellColumn !== 12) {
          sheet.getRow(configurationEndBorderRow + rowsAddedToExcelCounter).getCell(cellColumn).value = '';
          sheet.getRow(configurationEndBorderRow + rowsAddedToExcelCounter).getCell(cellColumn).style = {};
          sheet.getRow(configurationEndBorderRow + rowsAddedToExcelCounter).getCell(cellColumn).border = {
            bottom: { style: 'medium' },
          };
        }
      }

      rowsAddedToExcelCounter += startRowDifferenceToNextConfiguration;
    });

    //
    // generate excel
    //
    const tempFile = await new Promise((resolve) => {
      tmp.file(
        { discardDescriptor: true, prefix: 'calculation', postfix: 'xls', mode: parseInt('0600', 8) },
        async (err, file) => {
          workbook.xlsx.writeFile(file).then((_) => resolve(file));
        }
      );
    });

    return tempFile;
  }

  public async generateExcelProductionPlanFile(
    singleCableCalculations: SingleCableCalculationPresentation[],
    locale: string,
    fileDownloadOptions: FileDownloadOptions
  ): Promise<Iterable<unknown>> {
    const excelProductionPlans: ExcelProductionPlans = {
      productionPlans: [],
    };

    for await (const scc of singleCableCalculations) {
      const configuration = scc.configuration || scc.snapshot?.configurationData;
      const userName = `${configuration.createdBy}`;

      const pinAssignmentImage = configuration.state?.pinAssignmentState?.base64Image;
      const libraryImage = configuration.state?.libraryState?.base64Image;

      const chainflexCable = configuration.state?.chainFlexState?.chainflexCable;
      const diameterUnit = chainflexCable.outerDiameter?.unit;
      const diameterAmount = chainflexCable.outerDiameter?.amount;

      const productionPlanExcelMat017ItemList = ExcelProductionPlanMat017ItemList.create(scc).getData();
      const imageData = {
        libraryImage: '',
        libraryImageWidth: 0,
        libraryImageHeight: 0,
        pinAssignmentImage: '',
        pinAssignmentImageWidth: 0,
        pinAssignmentImageHeight: 0,
      };

      try {
        const dimensions = this.getImageSizeFromBase64String(libraryImage);

        imageData.libraryImageWidth = dimensions.width;
        imageData.libraryImageHeight = dimensions.height;
        imageData.libraryImage = libraryImage;
      } catch (error) {}

      try {
        const dimensions = this.getImageSizeFromBase64String(pinAssignmentImage);

        imageData.pinAssignmentImageWidth = dimensions.width;
        imageData.pinAssignmentImageHeight = dimensions.height;
        imageData.pinAssignmentImage = pinAssignmentImage;
      } catch (error) {}

      const productionPlan: ProductionPlan = {
        matNumber: configuration?.matNumber,
        chainflexNumber: chainflexCable?.partNumber,
        chainflexOuterDiameter: this.convertOuterDiameterForExcel({ unit: diameterUnit, amount: diameterAmount }),
        chainflexCableStructure: chainflexCable?.cableStructure?.[locale],
        mat017ItemList: productionPlanExcelMat017ItemList,
        labelingLeft: configuration?.labelingLeft,
        labelingRight: configuration?.labelingRight,
        userName,
        creationDate: configuration?.creationDate,
        modificationDate: configuration?.modificationDate,
        ...imageData,
      };

      excelProductionPlans.productionPlans.push(productionPlan);
    }

    //
    // set variables and constants
    //

    const zip = new AdmZip();
    const baseFile = __dirname + '/assets/Vorlage-Configuration-ICALC-770.xlsx';
    // general configuration info coordinates
    const matNumberStartCoord = 'A1';
    const chainflexNumberStartCoord = 'B5';
    const chainflexOuterDiameterStartCoord = 'C5';
    const chainflexCableStructureStartCoord = 'D5';
    const modificationDateStartCoord = 'E46';
    const creationDateStartCoord = 'E49';
    const userNameStartCoord = 'F49';
    const labelingLeftStartCoord = 'B140';
    const labelingRightStartCoord = 'B141';

    // mat item insert information
    const firstMat017ItemColumn = 'A';
    const secondMat017ItemColumn = 'B';
    const thirdMat017ItemColumn = 'C';
    const fourthtMat017ItemColumn = 'D';
    const fifthMat017ItemColumn = 'E';
    const sixthMat017ItemColumn = 'F';
    const matListEndString = 'MATende';

    // image coordinates
    const libraryImageFrameStartCoordColumn = 0;
    const libraryImageFrameStartCoordRow = 102;
    const pinAssignmentImageFrameStartCoordColumn = 0;
    const pinAssignmentImageFrameStartCoordRow = 52;

    // print area
    const printAreaCoord = 'A1:J150';

    for await (const productionPlan of ArrayUtils.fallBackToEmptyArray(excelProductionPlans?.productionPlans)) {
      // create workbook and get exceltab for each config
      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.readFile(baseFile);
      const finalViewSheet = workbook.getWorksheet(1);

      // set config and chainflex values
      finalViewSheet.getCell(matNumberStartCoord).value = productionPlan?.matNumber;
      finalViewSheet.getCell(chainflexNumberStartCoord).value = productionPlan?.chainflexNumber;
      finalViewSheet.getCell(chainflexOuterDiameterStartCoord).value = productionPlan?.chainflexOuterDiameter;
      finalViewSheet.getCell(chainflexCableStructureStartCoord).value = productionPlan?.chainflexCableStructure;
      finalViewSheet.getCell(modificationDateStartCoord).value = new Date(productionPlan?.modificationDate);
      finalViewSheet.getCell(creationDateStartCoord).value = new Date(productionPlan?.creationDate);
      finalViewSheet.getCell(userNameStartCoord).value = productionPlan?.userName;
      finalViewSheet.getCell(labelingLeftStartCoord).value = productionPlan?.labelingLeft;
      finalViewSheet.getCell(labelingRightStartCoord).value = productionPlan?.labelingRight;

      // insert the list of Mat017Items (traverse an array of array)
      const startingRowIndex = 7;

      ArrayUtils.fallBackToEmptyArray(productionPlan?.mat017ItemList)
        .filter((mat017Item) => ArrayUtils.fallBackToEmptyArray(mat017Item).length === 6)
        .forEach((mat017Item, matIndex) => {
          finalViewSheet.getRow(startingRowIndex + matIndex).getCell(firstMat017ItemColumn).value = mat017Item[0];
          finalViewSheet.getRow(startingRowIndex + matIndex).getCell(secondMat017ItemColumn).value = mat017Item[1];
          finalViewSheet.getRow(startingRowIndex + matIndex).getCell(thirdMat017ItemColumn).value = mat017Item[2];
          finalViewSheet.getRow(startingRowIndex + matIndex).getCell(fourthtMat017ItemColumn).value = mat017Item[3];
          finalViewSheet.getRow(startingRowIndex + matIndex).getCell(fifthMat017ItemColumn).value = mat017Item[4];
          finalViewSheet.getRow(startingRowIndex + matIndex).getCell(sixthMat017ItemColumn).value = mat017Item[5];
        });

      const lastRowMat017ItemsFinalView = productionPlan?.mat017ItemList?.length + 7;

      finalViewSheet.getCell(`A${lastRowMat017ItemsFinalView}`).value = matListEndString;

      // insert library image
      if (productionPlan?.libraryImage) {
        const libraryImageId = workbook.addImage({
          base64: productionPlan?.libraryImage,
          extension: 'png',
        });
        const libraryImageSize = this.calculateImageSize(
          productionPlan?.libraryImageWidth,
          productionPlan?.libraryImageHeight,
          'library'
        );

        finalViewSheet.addImage(libraryImageId, {
          tl: { col: libraryImageFrameStartCoordColumn, row: libraryImageFrameStartCoordRow },
          ext: { width: libraryImageSize.reducedWidth, height: libraryImageSize.reducedHeight },
          editAs: 'absolute',
        });
      }

      // insert production plan image
      if (productionPlan?.pinAssignmentImage) {
        const pinAssignmentImageId = workbook.addImage({
          base64: productionPlan?.pinAssignmentImage,
          extension: 'png',
        });

        const pinAssignmentImageSize = this.calculateImageSize(
          productionPlan?.pinAssignmentImageWidth,
          productionPlan?.pinAssignmentImageHeight,
          'pinAssignment'
        );

        finalViewSheet.addImage(pinAssignmentImageId, {
          tl: { col: pinAssignmentImageFrameStartCoordColumn, row: pinAssignmentImageFrameStartCoordRow },
          ext: { width: pinAssignmentImageSize.reducedWidth, height: pinAssignmentImageSize.reducedHeight },
          editAs: 'absolute',
        });
      }

      // set print area
      finalViewSheet.pageSetup.printArea = printAreaCoord;
      finalViewSheet.getRow(50).addPageBreak();
      finalViewSheet.getRow(100).addPageBreak();

      // add excel to zip
      const xlsxFileBuffer: ArrayBuffer = await workbook.xlsx.writeBuffer();
      let fileBuffer: ArrayBuffer;
      let fileName = productionPlan.matNumber;

      if (fileDownloadOptions.format === FileFormatEnum.xls) {
        fileName = `${fileName}.xls`;
        const nodeBuffer = Buffer.from(new Uint8Array(xlsxFileBuffer));

        fileBuffer = await this.convertToXlsService.convertXlsxToXls(nodeBuffer);
      } else if (fileDownloadOptions.format === FileFormatEnum.xlsx) {
        fileName = `${fileName}.xlsx`;
        fileBuffer = xlsxFileBuffer;
      } else {
        throw new InternalServerErrorException(
          `iCalc does not support ${fileDownloadOptions?.format} format currently`
        );
      }

      zip.addFile(fileName, fileBuffer, 'Production Plan info');
    }

    const zipBuffer = await zip.toBuffer();

    return zipBuffer;
  }

  public calculateImageSize(
    width: number,
    height: number,
    imageType: string
  ): { reducedWidth: number; reducedHeight: number } {
    let reducedWidth = 1030; // cut off for width that still fits inside the given excel frame
    const aspectRatio = width / height; // Part of the format = width / height = X:1
    let reducedHeight = reducedWidth / aspectRatio; // Reduced width divided by part of format (X)

    /**
     * cut off for height that still fits inside the given excel frame
     * 600 = pinAssignment
     * 510 = library
     */
    const heightCutOff = imageType === 'pinAssignment' ? 600 : 510;

    if (reducedHeight > heightCutOff) {
      reducedHeight = heightCutOff;
      reducedWidth = reducedHeight * aspectRatio;
    }

    return { reducedWidth, reducedHeight };
  }

  private convertOuterDiameterForExcel(outerDiameter: OuterDiameter): string {
    let outerDiameterString: string;

    if (outerDiameter?.unit === 'MILLIMETER') {
      outerDiameterString = `⌀ ${outerDiameter?.amount}mm`;
    } else {
      outerDiameterString = outerDiameter?.unit;
    }
    return outerDiameterString;
  }

  private getImageSizeFromBase64String(base64String: string): ISizeCalculationResult {
    const encodedImage = Buffer.from(base64String.split(';base64,').pop(), 'base64');

    return sizeOf(encodedImage);
  }
}
