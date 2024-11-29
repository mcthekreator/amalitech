import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { ObjectUtils, StringUtils } from '@igus/icalc-utils';
import { FieldArrayType, FormlyFieldConfig } from '@ngx-formly/core';
import { Mat017ItemCreationData } from '@igus/icalc-domain';
import { buildNewRows } from './build-new-rows';
import { CreateMat017ItemsService } from './create-mat017-items-service';

@Component({
  selector: 'icalc-formly-create-mat017-items-table',
  templateUrl: './formly-create-mat017-items-table.type.html',
  styleUrls: ['./formly-create-mat017-items-table.type.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyCreateMat017ItemsTableComponent extends FieldArrayType implements OnInit {
  public fieldArray?: FormlyFieldConfig;

  private initialModelData = {
    matNumber: null,
    itemDescription1: null,
    itemDescription2: null,
    mat017ItemGroup: null,
    supplierItemNumber: null,
    amount: null,
    priceUnit: null,
    addToBomOnCreate: false,
  } as Mat017ItemCreationData;

  constructor(private readonly createMat017ItemsService: CreateMat017ItemsService) {
    super();
  }

  private get rows(): Mat017ItemCreationData[] {
    return this.field.parent.model[this.field.key as string];
  }

  @HostListener('paste', ['$event'])
  private onPaste(event: ClipboardEvent): void {
    event?.preventDefault();
    const text = event.clipboardData.getData('text/plain');

    if (!text) return;
    this.onPasteIntoInput(text);
  }

  public trackByFn(_index, field: FormlyFieldConfig): string {
    return field.key as string;
  }

  public ngOnInit(): void {
    // The FieldConfig type allows the key field to be a string, number, or array.
    // To ensure consistency, this component restricts the key to being a string,
    // making it easier to look up the model by key.
    this.ensureFieldKeyIsString();

    this.setFieldArray();
    this.exposeButtonsHandlersInFormState();
  }

  public onRemove(index?: number): void {
    // clear data in first row and not remove it if single line in table
    if (index === 0 && this.rows.length === 1) {
      this.resetModel(buildNewRows(this.rows, index, [{ ...this.initialModelData }]));
      return;
    }

    this.resetModel(buildNewRows(this.rows, index));
  }

  public async onPasteButtonClick(): Promise<void> {
    const pastedText = await this.createMat017ItemsService.pasteFromClipBoard();
    const fromIndex = this.rows.length;

    this.paste(pastedText, fromIndex);
  }

  public onPasteIntoInput(content: string): void {
    const currentIndex = this.field.options.formState.currentIndex;

    if (currentIndex === undefined) {
      return;
    }

    this.paste(content, currentIndex);
  }

  private paste(content: string, fromIndex: number): void {
    const parsedData = this.createMat017ItemsService.parsePastedData(
      content,
      Object.keys(this.initialModelData) as (keyof Mat017ItemCreationData)[]
    );

    if (!Array.isArray(parsedData)) {
      return;
    }

    const newRows = buildNewRows(this.rows, fromIndex, parsedData);

    this.insertRows(newRows);
  }

  private insertRows(newRows: Mat017ItemCreationData[]): void {
    this.resetModel(newRows);
    this.forceReload();
  }

  private forceReload(): void {
    // This workaround addresses the issue where validation messages for unique matNumbers
    // are not displayed immediately when multiple rows are pasted. Although the field is
    // marked as invalid, the messages only appear upon the next update of the form values.
    // For more information, see ICALC-657.
    setTimeout(() => {
      this.reloadData();
    });
  }

  private reloadData(): void {
    this.resetModel(this.rows);
  }

  private resetModel(rows: Mat017ItemCreationData[]): void {
    this.field.parent.options.resetModel({
      rows,
    });
  }

  private ensureFieldKeyIsString(): void {
    if (!StringUtils.isOfTypeString(this.field.key)) {
      throw new Error('Key for the array model should be a string.');
    }
  }

  // It allows to interact with this component from outside of the form
  private exposeButtonsHandlersInFormState(): void {
    this.field.parent.options.formState.onPasteButtonClick = this.onPasteButtonClick.bind(this);
    this.field.parent.options.formState.add = this.add.bind(this);
  }

  private setFieldArray(): void {
    if (ObjectUtils.isFunction(this.field.fieldArray)) {
      this.fieldArray = (this.field.fieldArray as (field: FormlyFieldConfig) => FormlyFieldConfig)(this.field);
    } else {
      this.fieldArray = this.field.fieldArray as FormlyFieldConfig;
    }
  }
}
