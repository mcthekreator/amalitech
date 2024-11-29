import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { SingleCableCalculationPresentation } from '@igus/icalc-domain';

@Pipe({ name: 'getConfigPropFromScc' })
export class GetConfigPropFromSccPipe implements PipeTransform {
  public transform(scc: SingleCableCalculationPresentation, propName: string): string {
    if (!scc) {
      return '';
    }

    const configurationData = scc.configuration || scc.snapshot.configurationData;

    return configurationData[propName];
  }
}
