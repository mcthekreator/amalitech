import type { AssignConfigurationToExistingCalculationRequestDto } from '@igus/icalc-domain';
import { SingleCableCalculationBaseData } from '@igus/icalc-domain';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignConfigurationToExistingCalculationDto implements AssignConfigurationToExistingCalculationRequestDto {
  @IsString()
  @IsNotEmpty()
  public calculationId: string;

  @IsString()
  @IsNotEmpty()
  public configurationId: string;

  @IsNotEmpty()
  public singleCableCalculationBaseData: SingleCableCalculationBaseData;
}
