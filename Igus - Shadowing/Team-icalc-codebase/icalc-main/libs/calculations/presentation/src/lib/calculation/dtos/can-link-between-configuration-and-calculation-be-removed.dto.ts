import type { CanLinkBetweenConfigurationAndCalculationBeRemovedRequestDto } from '@igus/icalc-domain';
import { IsNotEmpty, IsString } from 'class-validator';

export class CanLinkBetweenConfigurationAndCalculationBeRemovedDto
  implements CanLinkBetweenConfigurationAndCalculationBeRemovedRequestDto
{
  @IsString()
  @IsNotEmpty()
  public singleCableCalculationId: string;
}
