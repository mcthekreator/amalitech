import type { RemoveLinkBetweenConfigurationAndCalculationRequestDto } from '@igus/icalc-domain';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveLinkBetweenConfigurationAndCalculationDto
  implements RemoveLinkBetweenConfigurationAndCalculationRequestDto
{
  @IsString()
  @IsNotEmpty()
  public calculationId: string;

  @IsString()
  @IsNotEmpty()
  public configurationId: string;

  @IsString()
  @IsNotEmpty()
  public singleCableCalculationId: string;
}
