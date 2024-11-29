import { Pipe, PipeTransform } from '@angular/core';
import { CableStructureItem } from '@igus/icalc-domain';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Pipe({ name: 'hasSubActions' })
export class HasSubActionsValuePipe implements PipeTransform {
  public transform(item: CableStructureItem): Observable<boolean> {
    const options = item.forms.left.fields.find((field) => field.key === 'actionSelect')?.props.options;
    const optionsWithChildren = (options as unknown[]).filter(
      (option) => !!option['children'] && option['children'].length > 0 && option['value'] !== 'none'
    );

    return combineLatest([
      item.forms.left.form.valueChanges.pipe(startWith({})),
      item.forms.right.form.valueChanges.pipe(startWith({})),
    ]).pipe(
      map(([left, right]) => {
        const activeValueLeft = left.actionSelect;
        const activeValueRight = right.actionSelect;

        const hasSubActions = !!optionsWithChildren.find(
          (option) => option['value'] === activeValueLeft || option['value'] === activeValueRight
        );

        return hasSubActions;
      })
    );
  }
}
