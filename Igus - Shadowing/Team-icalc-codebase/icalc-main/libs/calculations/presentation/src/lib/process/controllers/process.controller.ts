import { Body, Controller, Header, Param, Post, Res, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import type { ProcessManyResult, IcalcValidationResult } from '@igus/icalc-domain';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import {
  ProcessService,
  ExcelService,
  SingleCableCalculationService,
  CalculationService,
} from '@igus/icalc-calculations-application';
import { ProcessCalculationDto } from '../dtos/process-calculation.dto';
import { Readable } from 'stream';
import { UuidPipe } from '@igus/icalc-common';
import { CreateExcelProductionPlanFileDto } from '../dtos/create-excel-production-plan-file.dto';
import { CreateExcelCalculationFileDto } from '../dtos/create-excel-calculation-file.dto';
import { CalculationsPresentationMapperService } from '../../common';

@ApiTags('process')
@Controller('process')
export class ProcessController {
  constructor(
    private readonly processService: ProcessService,
    private readonly singleCableCalculationService: SingleCableCalculationService,
    private readonly calculationsPresentationMapperService: CalculationsPresentationMapperService,
    private readonly excelService: ExcelService,
    private readonly calculationService: CalculationService
  ) {}

  @Post('validatePinAssignment/:calculationId/:configurationId')
  public async validatePinAssignment(
    @Param('calculationId', UuidPipe) calculationId: string,
    @Param('configurationId', UuidPipe) configurationId: string
  ): Promise<IcalcValidationResult> {
    return this.processService.validatePinAssignment(calculationId, configurationId);
  }

  @Post()
  public async process(@Body() processCalculation: ProcessCalculationDto): Promise<ProcessManyResult> {
    const { calculationId, singleCableCalculationIds } = processCalculation;

    return this.processService.processCalculationWithManyConfigurations(calculationId, singleCableCalculationIds);
  }

  @Post('createExcelProductionPlanFile')
  @Header('Content-Type', 'application/zip, application/octet-stream')
  public async createProductionPlans(
    @Res({ passthrough: true }) res: Response,
    @Body() { singleCableCalculationIds, locale, fileDownloadOptions }: CreateExcelProductionPlanFileDto
  ): Promise<StreamableFile> {
    try {
      const singleCableCalculations = await this.singleCableCalculationService.getMany(singleCableCalculationIds);
      const singleCableCalculationsPresentation =
        await this.calculationsPresentationMapperService.mapManyToSingleCableCalculationPresentation(
          singleCableCalculations
        );

      const productionPlanResult = await this.excelService.generateExcelProductionPlanFile(
        singleCableCalculationsPresentation,
        locale,
        fileDownloadOptions
      );
      const readable = Readable.from(productionPlanResult);

      return new StreamableFile(readable);
    } catch (error) {
      this.handleFileStreamError(error, res);
    }
  }

  @Post('createExcelCalculationFile')
  @Header('Content-Type', 'text/xlsx')
  public async createExcelCalculation(
    @Res({ passthrough: true }) res: Response,
    @Body()
    {
      calculationId,
      singleCableCalculationIds,
      customerType,
      customerTypeEnum,
      processResults,
      locale,
    }: CreateExcelCalculationFileDto
  ): Promise<StreamableFile> {
    try {
      const calculation = await this.calculationService.getOne(calculationId);
      const singleCableCalculations = await this.singleCableCalculationService.getMany(singleCableCalculationIds);
      const singleCableCalculationsPresentation =
        await this.calculationsPresentationMapperService.mapManyToSingleCableCalculationPresentation(
          singleCableCalculations
        );

      const excelCalculationResult = await this.excelService.generateExcelCalculationFile(
        calculation,
        singleCableCalculationsPresentation,
        customerType,
        customerTypeEnum,
        processResults,
        locale
      );
      const file = createReadStream(`${excelCalculationResult}`);

      return new StreamableFile(file);
    } catch (error) {
      this.handleFileStreamError(error, res);
    }
  }

  private handleFileStreamError(error: object, response: Response): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    response.set({ 'Content-Type': 'application/json' });
    throw error;
  }
}
