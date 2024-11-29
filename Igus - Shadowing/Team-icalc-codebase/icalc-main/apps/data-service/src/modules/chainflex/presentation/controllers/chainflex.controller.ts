import type { IcalcListInformation, IcalcListResult, CableStructureInformation } from '@igus/icalc-domain';
import { ChainflexCable, normalizeListInformation } from '@igus/icalc-domain';
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { DeleteResult } from 'typeorm';

import { ChainflexService } from '../../application/services/chainflex.service';

@ApiTags('chainflex')
@Controller('chainflex')
export class ChainflexController {
  constructor(private readonly chainflexService: ChainflexService) {}

  @Get('')
  public searchWithList(
    @Query() listInformation: Partial<IcalcListInformation>
  ): Promise<IcalcListResult<ChainflexCable>> {
    return this.chainflexService.searchChainflexItem(normalizeListInformation(listInformation));
  }

  @Post()
  public create(@Body() chainflex: ChainflexCable): Promise<ChainflexCable> {
    return this.chainflexService.createChainflex(chainflex);
  }

  @Delete(':partNumber')
  public remove(@Param('partNumber') partNumber: string): Promise<DeleteResult> {
    return this.chainflexService.deleteChainflexByPartNumber(partNumber);
  }

  @Get('structure/:partNumber')
  public getCableStructureInformation(
    @Param('partNumber') partNumber: string
  ): Promise<CableStructureInformation | undefined> {
    return this.chainflexService.getCableStructureInformationByPartNumber(partNumber);
  }
}
