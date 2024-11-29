import type { HttpErrorResponse } from '@angular/common/http';
import type { CreateMat017ItemManuallyResponseDto, ConnectorSide, Mat017ItemCreationData } from '@igus/icalc-domain';

interface CreateMat017ItemsSucceededPayload {
  response: CreateMat017ItemManuallyResponseDto;
  which: ConnectorSide;
  mat017ItemsToCreate: Mat017ItemCreationData[];
}

export class Succeeded {
  public static readonly type = '[API] CreatingNewMat017Item Succeeded';
  constructor(public payload: CreateMat017ItemsSucceededPayload) {}
}

export class Failed {
  public static readonly type = '[API] CreatingNewMat017Item Failed';
  constructor(public payload: HttpErrorResponse) {}
}
