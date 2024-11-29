import type { CableStructureItem } from '@igus/icalc-domain';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { TestBed } from '@angular/core/testing';
import { HasSubActionsValuePipe } from './has-sub-actions.pipe';

describe('HasSubActionsValuePipe', () => {
  let pipe: HasSubActionsValuePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HasSubActionsValuePipe],
    });

    pipe = TestBed.inject(HasSubActionsValuePipe);
  });

  const mockCableStructureItem = (
    options,
    leftActionSelectValue = null,
    rightActionSelectValue = null
  ): CableStructureItem => {
    return {
      forms: {
        left: {
          fields: [
            {
              key: 'actionSelect',
              props: {
                options,
              },
            },
          ],
          form: {
            valueChanges: new BehaviorSubject({
              actionSelect: leftActionSelectValue,
            }),
          },
        },
        right: {
          form: {
            valueChanges: new BehaviorSubject({
              actionSelect: rightActionSelectValue,
            }),
          },
        },
      },
    } as unknown as CableStructureItem;
  };

  it('should return true when sub-actions exist in left form', (done) => {
    const options = [
      { value: 'action1', children: ['subAction1'] },
      { value: 'action2', children: [] },
    ];

    const item = mockCableStructureItem(options, 'action1', null);

    pipe
      .transform(item)
      .pipe(take(1))
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });
  });

  it('should return false when no sub-actions exist in left and right forms', (done) => {
    const options = [
      { value: 'action1', children: [] },
      { value: 'action2', children: [] },
    ];

    const item = mockCableStructureItem(options, 'action2', 'action1');

    pipe
      .transform(item)
      .pipe(take(1))
      .subscribe((result) => {
        expect(result).toBeFalsy();
        done();
      });
  });

  it('should return true when sub-actions exist in right form', (done) => {
    const options = [
      { value: 'action1', children: [] },
      { value: 'action2', children: ['subAction1'] },
    ];

    const item = mockCableStructureItem(options, null, 'action2');

    pipe
      .transform(item)
      .pipe(take(2))
      .subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });
  });

  it('should update the result when the left form value changes', (done) => {
    const options = [
      { value: 'action1', children: ['subAction1'] },
      { value: 'action2', children: [] },
    ];

    const item = mockCableStructureItem(options, 'action2', null);

    const leftFormValueChanges = item.forms.left.form.valueChanges as BehaviorSubject<any>;

    pipe
      .transform(item)
      .pipe(
        take(1),
        switchMap((result) => {
          expect(result).toBeFalsy();

          // Simulate a form value change
          leftFormValueChanges.next({ actionSelect: 'action1' });

          return pipe.transform(item).pipe(
            take(1),
            tap((newResult) => {
              expect(newResult).toBeTruthy();
              done();
            })
          );
        })
      )
      .subscribe();
  });
});
