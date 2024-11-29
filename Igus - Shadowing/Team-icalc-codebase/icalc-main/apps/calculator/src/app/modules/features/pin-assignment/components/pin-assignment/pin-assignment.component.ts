/* eslint-disable @typescript-eslint/naming-convention */
import type { OnDestroy, OnInit, AfterViewChecked } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import type { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { IcalcRoutes } from '@icalc/frontend/app/constants/route.constants';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import type { IcalcStep } from '@icalc/frontend/app/modules/core/state/app-state/app-state.model';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { LibraryStateFacadeService } from '@icalc/frontend/app/modules/core/state/library-state/library-state-facade.service';
import { PinAssignmentStateFacadeService } from '@icalc/frontend/app/modules/core/state/pin-assignment-state/pin-assignment-state-facade.service';
import { HtmlToImageService } from '@icalc/frontend/app/modules/shared/services/html-to-image.service';
import type {
  CableStructureForm,
  CableStructureInformation,
  CableStructureItemList,
  CableStructureItemType,
  ConfigurationPinAssignmentState,
  ConfigurationStatus,
  Core,
  IcalcBridge,
  IcalcDot,
  IcalcImage,
  Litze,
  Mat017ItemWithWidenData,
  PinAssignmentValidationResult,
  Shield,
  Twisting,
  ActionModels,
  Mat017ItemPickerModel,
  LocalizedStrings,
  CableStructureItem,
  Bridges,
} from '@igus/icalc-domain';
import {
  bridgeContainsBridge,
  bridgeContainsDot,
  getNumberAndOrderOfSubactionsWithinTwist,
  getNumberOfSubactionsWithinShield,
  isDotOnSameVerticalLevel,
  isSameDot,
  removeUnusedNewLinesFromActionModels,
} from '@igus/icalc-domain';
import { ArrayUtils, ObjectUtils, StringUtils } from '@igus/icalc-utils';
import type { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import type { Observable } from 'rxjs';
import {
  take,
  withLatestFrom,
  from,
  tap,
  delay,
  filter,
  of,
  switchMap,
  BehaviorSubject,
  merge,
  Subscription,
} from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: FormControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

enum PinAssignmentAutomationActionOptions {
  setAllCoresOnContact = 'setAllCoresOnContact',
  connectAllShieldsOnHousing = 'connectAllShieldsOnHousing',
}

enum PinAssignmentAutomationSubValuesOptions {
  oneToOne = 'oneToOne',
}

export type PinAssignmentSide = 'left' | 'right';
export interface MappedPinAssignmentSubValue<T> {
  side: PinAssignmentSide;
  value: T;
  index: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-pin-assignment',
  templateUrl: './pin-assignment.component.html',
  styleUrls: ['./pin-assignment.component.scss'],
})
export class PinAssignmentComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('confirmCheckSelectionDialog')
  private confirmCheckSelectionDialogRef: TemplateRef<MatDialog>;

  @ViewChild('confirmResetPinAssignmentActionsDialog')
  private confirmResetPinAssignmentActionsDialogRef: TemplateRef<MatDialog>;

  @ViewChild('confirmResetPinAssignmentSubValuesDialog')
  private confirmResetPinAssignmentSubValuesDialogRef: TemplateRef<MatDialog>;

  public actionModels: ActionModels;

  public bridges: Bridges;
  public cableStructure: LocalizedStrings;
  public cableStructureInformation: CableStructureInformation;
  public calculationConfigurationStatus: ConfigurationStatus;
  public currentBridge: IcalcBridge = null;
  public currentBridgeSide: PinAssignmentSide = null;
  public hasSavedLatestChanges = false;
  public imageList$: Observable<IcalcImage[]>;
  public isEditingBridges = false;
  public isLocked: boolean;
  public isReady = false;
  public leftMat017ItemList: Mat017ItemWithWidenData[];
  public lineOrder = -1;
  public nextStep$: Observable<IcalcStep>;
  public nextStep: IcalcStep;
  public partNumber: string;
  public pinAssignmentAutomationActionOptions = PinAssignmentAutomationActionOptions;
  public pinAssignmentAutomationSubValuesOptions = PinAssignmentAutomationSubValuesOptions;
  public pinAssignmentErrorMessage: string;
  public pinAssignmentStructure: CableStructureItemList = [];
  public pinAssignmentValidationResult: PinAssignmentValidationResult;
  public pinAutomationForm: FormGroup;
  public previousStep$: Observable<IcalcStep>;
  public rightMat017ItemList: Mat017ItemWithWidenData[];
  public showForms = true;
  public showPinAutomationSubValueSelectLeftSub: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public showPinAutomationSubValueSelectRightSub: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public showPinAutomationSubValueSelectLeft$ = this.showPinAutomationSubValueSelectLeftSub.asObservable();
  public showPinAutomationSubValueSelectRight$ = this.showPinAutomationSubValueSelectRightSub.asObservable();
  public isLoadingUiSub: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public isLoadingUi$ = this.isLoadingUiSub.asObservable();
  public formValuesChanged$: Observable<Record<string, string>>;
  private formValueChangesSubject: BehaviorSubject<Observable<Record<string, string>>[]> = new BehaviorSubject([]);
  private initialActionModels: ActionModels;

  private subscription = new Subscription();

  constructor(
    private appStateFacadeService: AppStateFacadeService,
    private libraryStateFacadeService: LibraryStateFacadeService,
    private htmlToImageService: HtmlToImageService,
    private router: Router,
    private pinAssignmentStateFacadeService: PinAssignmentStateFacadeService,
    private processStateFacadeService: ProcessStateFacadeService,
    private changeDetectorRef: ChangeDetectorRef,
    private checkSelectionDialog: MatDialog,
    private resetPinAssignmentActionsDialog: MatDialog,
    private resetPinAssignmentSubValuesDialog: MatDialog
  ) {
    this.pinAssignmentStateFacadeService.enteringPinAssignmentPageStarted();
    this.formValuesChanged$ = this.formValueChangesSubject.pipe(
      switchMap((valueChangesObservables) => merge(...valueChangesObservables))
    );
  }

  public ngOnInit(): void {
    this.pinAutomationForm = new FormGroup<{
      leftPinAutomationActionSelection: FormControl<string>;
      leftPinAutomationSubValueSelection: FormControl<string>;
      rightPinAutomationActionSelection: FormControl<string>;
      rightPinAutomationSubValueSelection: FormControl<string>;
    }>({
      leftPinAutomationActionSelection: new FormControl(''),
      leftPinAutomationSubValueSelection: new FormControl(''),
      rightPinAutomationActionSelection: new FormControl(''),
      rightPinAutomationSubValueSelection: new FormControl(''),
    });

    this.nextStep$ = this.appStateFacadeService.nextStep$;
    this.previousStep$ = this.appStateFacadeService.previousStep$;

    this.imageList$ = this.libraryStateFacadeService.imageList$;

    this.subscription.add(
      this.processStateFacadeService.isLocked$.subscribe((value) => {
        this.isLocked = value;
        this.setDisabledStateOfForms(value);
      })
    );

    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationStart))
        .subscribe((event: NavigationStart) => {
          if (event.url !== IcalcRoutes.results) {
            this.pinAssignmentStateFacadeService.navigatingBackFromPinAssignmentPageStarted({
              pinAssignmentState: this.getCurrentPinAssignmentState(),
              hasSavedLatestChanges: this.hasSavedLatestChanges,
            });
          }
        })
    );

    this.subscription.add(
      this.processStateFacadeService.selectedConfigurationData$
        .pipe(take(1))
        .subscribe(({ state: { connectorState, chainFlexState, pinAssignmentState } }) => {
          this.leftMat017ItemList = ArrayUtils.fallBackToEmptyArray<Mat017ItemWithWidenData>(
            connectorState?.leftConnector?.mat017ItemListWithWidenData
          );
          this.rightMat017ItemList = ArrayUtils.fallBackToEmptyArray<Mat017ItemWithWidenData>(
            connectorState?.rightConnector?.mat017ItemListWithWidenData
          );

          this.cableStructureInformation = chainFlexState.chainflexCable?.cableStructureInformation;
          this.cableStructure = chainFlexState.chainflexCable?.cableStructure;
          this.partNumber = chainFlexState.chainflexCable?.partNumber;

          this.pinAssignmentStateFacadeService.enteringPinAssignmentPageEntered({
            chainflexCable: chainFlexState.chainflexCable,
            cableStructureInformation: chainFlexState.chainflexCable?.cableStructureInformation,
            pinAssignmentState,
          });
        })
    );

    this.subscription.add(this.nextStep$.subscribe((value) => (this.nextStep = value)));

    this.subscription.add(
      this.formValuesChanged$.subscribe(() => {
        this.hasSavedLatestChanges = false;
      })
    );

    this.subscription.add(
      this.pinAssignmentStateFacadeService.pinAssignmentStructure$
        .pipe(filter((value) => !!value))
        .subscribe((pinAssignmentStructure) => {
          const pinAssignmentStructureClone = ObjectUtils.cloneDeep<CableStructureItemList>(pinAssignmentStructure);

          this.lineOrder = this.pinAssignmentStateFacadeService.getLineOrderSnapshot();
          this.actionModels = this.pinAssignmentStateFacadeService.getActionModelsSnapshot();
          this.pinAssignmentStateFacadeService.getActionModelsSnapshot();
          this.bridges = this.pinAssignmentStateFacadeService.getBridgesSnapshot();
          this.pinAssignmentStructure = [
            ...pinAssignmentStructureClone.map((item) => ({
              ...item,
              forms: {
                left: this.generateLineForm('left', item.type),
                right: this.generateLineForm('right', item.type),
              },
            })),
          ];

          const valueChangesList = this.getPinAssignmentStructureWithoutTwisting(this.pinAssignmentStructure).map(
            (value) => [value.forms.left.form.valueChanges, value.forms.right.form.valueChanges]
          );

          this.addNewFormValueChanges(valueChangesList.flat());
          this.isReady = true;
        })
    );

    this.subscription.add(
      this.pinAssignmentStateFacadeService
        .configurationValidationResult$()
        .subscribe((validationResult: PinAssignmentValidationResult) => {
          this.pinAssignmentValidationResult = { ...validationResult };
          if (this.pinAssignmentValidationResult?.isValid) {
            this.onGoToResult(this.nextStep);
          } else if (!this.pinAssignmentValidationResult?.isValid) {
            this.isLoadingUiSub.next(false);
            this.pinAssignmentErrorMessage = `icalc.pin-assignment.${
              validationResult.validationErrors?.filter((error) => error.startsWith('PIN_ASSIGNMENT'))[0]
            }`;
            this.checkSelectionDialog.open(this.confirmCheckSelectionDialogRef, {
              id: 'confirmCheckSelectionDialog',
              minWidth: 650,
            });
          }
        })
    );
    this.initialActionModels = ObjectUtils.cloneDeep<ActionModels>(
      this.pinAssignmentStateFacadeService.getActionModelsSnapshot()
    );
  }

  public ngAfterViewChecked(): void {
    this.setShowSubValueAutomationSelect('left');
    this.setShowSubValueAutomationSelect('right');
    this.setDisabledStateOfForms(this.isLocked);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setAutomatedSubValuesSelect(event, side: PinAssignmentSide): void {
    const { coreFormConfigs } = this.getFormConfigsByStructureType(this.pinAssignmentStructure, side);
    // Might be useful later for Stories about SkinLengthAutomation
    // const mappedSkinLengthValues: MappedPinAssignmentSubValue<number>[] = coreFormConfigs.map((csf, i) => {
    //   return { side, value: csf.form?.get('skinLengthInput')?.value, index: i };
    // });
    let coreOnContactCount = 0;
    const mappedPinDescriptionValues: MappedPinAssignmentSubValue<string>[] = coreFormConfigs.map((csf) => {
      if (csf.form?.get('actionSelect').value === 'setOnContact') {
        const mPDV = { side, value: csf.form?.get('pinDescriptionInput')?.value, index: coreOnContactCount };

        coreOnContactCount++;
        return mPDV;
      }
    });

    switch (event.value) {
      case PinAssignmentAutomationSubValuesOptions.oneToOne:
        mappedPinDescriptionValues.forEach((mPDV, i) => {
          if (mPDV) {
            coreFormConfigs[i].form.patchValue({ pinDescriptionInput: `${mPDV.index + 1}` });
          }
        });

        break;
      default:
        break;
    }
    this.resetAutomationForm();
  }

  public handleFormlyChange(side: PinAssignmentSide): void {
    this.setShowSubValueAutomationSelect(side);
  }

  public handlePinAutomationSelection(event, side: PinAssignmentSide): void {
    const { coreFormConfigs, shieldFormConfigs } = this.getFormConfigsByStructureType(
      this.pinAssignmentStructure,
      side
    );

    this.setAutomatedActionSelect(event.value, coreFormConfigs, shieldFormConfigs);
  }

  public openResetActionsConfirmationModal(side: PinAssignmentSide): void {
    this.resetPinAssignmentActionsDialog.open(this.confirmResetPinAssignmentActionsDialogRef, {
      id: 'confirmResetPinAssignmentDialog',
      minWidth: 650,
      data: { side },
    });
  }

  public openResetSubValuesConfirmationModal(side: PinAssignmentSide): void {
    this.resetPinAssignmentSubValuesDialog.open(this.confirmResetPinAssignmentSubValuesDialogRef, {
      id: 'confirmResetPinAssignmentDialog',
      minWidth: 650,
      data: { side },
    });
  }

  public resetPinAutomationActions(side: PinAssignmentSide): void {
    const { coreFormConfigs, shieldFormConfigs, litzeFormConfigs } = this.getFormConfigsByStructureType(
      this.pinAssignmentStructure,
      side
    );

    shieldFormConfigs.forEach((coreFormConfig) => {
      coreFormConfig.form.patchValue({ actionSelect: 'none', subActionSelect: undefined });
    });

    coreFormConfigs.forEach((coreFormConfig) => {
      coreFormConfig.form.patchValue({ actionSelect: 'none', subActionSelect: undefined });
    });

    litzeFormConfigs.forEach((litzeFormConfig) => {
      litzeFormConfig.form.patchValue({ actionSelect: 'none', subActionSelect: undefined });
    });
  }

  public resetPinAutomationValues(side: PinAssignmentSide): void {
    const forms: CableStructureForm[] = this.pinAssignmentStructure.map((pas) => pas.forms[side]).filter(Boolean);

    forms.forEach((cSF) => {
      cSF.form?.patchValue({
        pinDescriptionInput: undefined,
        skinLengthInput: undefined,
        rollUpInput: undefined,
        mat017Item: undefined,
        cutOffLengthInput: undefined,
        partialDeductionInput: undefined,
        placeOnJacketInput: undefined,
        screenWindowInput: undefined,
        leaveItStandingInput: undefined,
        extendShieldInput: undefined,
        tinInput: undefined,
        twistInput: undefined,
      });
    });
  }

  public onSetLabel(litze: Litze, side: PinAssignmentSide, target): void {
    litze[`${side}Label`] = target.value ?? '';
  }

  public startSavingAndValidatingConfiguration(): void {
    if (this.isLocked) {
      this.router.navigate([this.nextStep?.route]);
      this.isLoadingUiSub.next(false);
      return;
    }

    this.isLoadingUiSub.next(true);

    this.pinAssignmentStateFacadeService.validatingPinAssignmentStarted({
      calculationId: this.processStateFacadeService.currentSelectedCalculationIdSnapshot(),
      configurationId: this.processStateFacadeService.currentSelectedConfigurationIdSnapshot(),
      pinAssignmentState: this.getCurrentPinAssignmentState(),
    });
  }

  public onGoToResult(nextStep: IcalcStep, approve?: boolean): void {
    this.isEditingBridges = false;
    this.showForms = false;

    this.changeDetectorRef.detectChanges();

    this.isLoadingUiSub.next(true);

    const createAndSetBase64Image$ = this.createPinAssignmentBase64Image().pipe(
      tap((imageValue) => {
        if (imageValue) {
          this.pinAssignmentStateFacadeService.setBase64Image(imageValue);
        }
      })
    );

    const createBase64ImageAndDispatchAction$ = createAndSetBase64Image$.pipe(
      withLatestFrom(this.pinAssignmentStateFacadeService.setBase64Completed$()), // move on only if base64 Image is set in state
      tap(([_, setBase64Completed]) => {
        if (setBase64Completed) {
          this.pinAssignmentStateFacadeService.navigatingToResultsPageStarted({
            pinAssignmentState: this.getCurrentPinAssignmentState(),
            approve,
          });
        }
      }),
      switchMap(() => this.pinAssignmentStateFacadeService.hasPinAssignmentDataBeenSaved$()) // move on if pin assignment state was saved in backend successfuly or it was not needed to save
    );

    this.subscription.add(
      createBase64ImageAndDispatchAction$.subscribe((hasBeenSaved) => {
        if (hasBeenSaved) {
          this.hasSavedLatestChanges = true;
          this.router.navigate([nextStep.route]);
          this.isLoadingUiSub.next(false);
        }
      })
    );
  }

  public asCore(item: Core | Shield | Twisting | Litze): Core {
    return item as Core;
  }

  public asShield(item: Core | Shield | Twisting | Litze): Shield {
    return item as Shield;
  }

  public asTwisting(item: Core | Shield | Twisting | Litze): Twisting {
    return item as Twisting;
  }

  public asLitze(item: Core | Shield | Twisting | Litze): Litze {
    return item as Litze;
  }

  public onStartBridge(dot: IcalcDot, side: PinAssignmentSide, dotCssClass: string): void {
    if (this.isEditingBridges === false) {
      return;
    }
    if (dotCssClass.includes('starting-dot')) {
      this.onDeleteBridge(dot, side);
      return;
    }
    if (
      this.currentBridge &&
      this.currentBridge.end === null &&
      this.currentBridge.start[0] === dot[0] &&
      this.currentBridge.start[1] === dot[1]
    ) {
      this.currentBridge = null;
      this.currentBridgeSide = null;
      return;
    }
    if (this.bridges[side].filter((bridge) => isDotOnSameVerticalLevel(bridge.start, dot))?.length >= 2) {
      return;
    }
    this.currentBridgeSide = side;
    this.currentBridge = { start: dot, end: null };
    this.bridges[side].push(ObjectUtils.cloneDeep<IcalcBridge>(this.currentBridge));
  }

  public toggleEditBridges(): void {
    this.isEditingBridges = !this.isEditingBridges;
    if (this.isEditingBridges === false) {
      this.currentBridge = null;
      this.currentBridgeSide = null;
      this.bridges = {
        left: this.bridges.left.filter((bridge) => bridge.end !== null),
        right: this.bridges.right.filter((bridge) => bridge.end !== null),
      };

      /*
       * Changes for bridges are currently not availabe as obervables and there is no easy way to react to these changes.
       * For simplicty at this point we reset the flag for tracking data changes after closing the edit mode.
       */
      this.hasSavedLatestChanges = false;
    }
  }

  public onEndBridge(dot: IcalcDot, side: PinAssignmentSide, endingDotClass: string): void {
    let currentBridges = ObjectUtils.cloneDeep<IcalcBridge[]>(this.bridges[side]);

    if (this.currentBridge && this.currentBridge.end === null && isSameDot(this.currentBridge.start, dot)) {
      currentBridges = currentBridges.filter((item) => isSameDot(item.start, dot) === false);
      this.bridges[side] = currentBridges;
      this.currentBridgeSide = null;
      this.currentBridge = null;
    } else if (endingDotClass.includes('ending-dot') && this.currentBridge?.[1] <= dot?.[1]) {
      currentBridges = currentBridges.filter((bridge) => !bridgeContainsDot(bridge, dot));
    }

    currentBridges = currentBridges.map((item) => {
      if (item.end === null) {
        if (item.start[1] > dot[1]) {
          //reverse the bridge:
          return { start: dot, end: item.start };
        }
        return { ...item, end: dot };
      }
      return { ...item };
    });

    this.bridges[side] = currentBridges;
    this.currentBridgeSide = null;
    this.currentBridge = null;
    this.removeDuplicateOrContainingBridges(side);
  }

  public onCreateNewLitzeLine(side: PinAssignmentSide, xValue): void {
    const currentBridges = ObjectUtils.cloneDeep<IcalcBridge[]>(this.bridges[side]);

    if (this.currentBridge === null || side !== this.currentBridgeSide) {
      return;
    }
    this.lineOrder = this.lineOrder + 1;
    this.actionModels = {
      ...this.actionModels,
      [`${this.lineOrder}`]: { type: 'litze', left: { actionSelect: 'none' }, right: { actionSelect: 'none' } },
    };

    const litze = {
      type: 'litze',
      leftLabel: '',
      rightLabel: '',
      lineOrder: this.lineOrder,
    } as Litze;

    const newLeftForm = this.generateLineForm('left', litze.type);
    const newRightForm = this.generateLineForm('right', litze.type);

    this.pinAssignmentStructure = [
      ...this.pinAssignmentStructure,
      {
        ...litze,
        forms: { left: newLeftForm, right: newRightForm },
      },
    ];

    // add newly created forms to subscription
    this.addNewFormValueChanges([newLeftForm.form.valueChanges, newRightForm.form.valueChanges]);

    this.bridges = {
      ...this.bridges,
      [side]: [
        ...currentBridges.map((bridge) => ({
          ...bridge,
          end: bridge.end === null ? [xValue, this.lineOrder] : bridge.end,
        })),
      ],
    };
    this.currentBridgeSide = null;
    this.currentBridge = null;

    this.removeDuplicateOrContainingBridges(side);
    this.eliminateUnusedLitzeLines();
  }

  public getShieldHeightAndOrderClasses(item: CableStructureItem, actionModels: ActionModels): string[] {
    const shield = item as Shield;

    const numOfSubActions = getNumberOfSubactionsWithinShield(item, actionModels);

    const height = shield.shieldedItemCount + numOfSubActions;

    return ['height-' + height, 'order-' + shield.horizontalOrder];
  }

  public getTwistingAmountAndOrderClasses(item: Twisting, index: number, structure: CableStructureItemList): string[] {
    const { numOfSubActions, positions } = getNumberAndOrderOfSubactionsWithinTwist(item, index, structure);

    const subActionsPositionClasses = positions.map((pos) => `sub-action-pos-${pos}`);

    const amount = item.twistedCoreCount;

    return [
      'core-amount-' + amount,
      'order-' + item.horizontalOrder,
      ...subActionsPositionClasses,
      'sub-actions-count-' + numOfSubActions,
    ];
  }

  private createPinAssignmentBase64Image(): Observable<string> {
    return of(null).pipe(
      delay(0), // use minimal delay to execute the long running task on next change detection cycle and allow current one to finish
      switchMap(() => {
        return from(this.htmlToImageService.getImageFromId('container-wrapper'));
      })
    );
  }

  private getFormConfigsByStructureType(
    pinAssignmentStructure: CableStructureItemList = [],
    side: PinAssignmentSide
  ): {
    coreFormConfigs: CableStructureForm[];
    shieldFormConfigs: CableStructureForm[];
    litzeFormConfigs: CableStructureForm[];
  } {
    const coreFormConfigs: CableStructureForm[] = pinAssignmentStructure
      .filter((pas) => pas.type === 'core')
      .map((pas) => pas.forms[side]);

    const shieldFormConfigs: CableStructureForm[] = pinAssignmentStructure
      .filter((pas) => pas.type === 'shield')
      .map((pas) => pas.forms[side]);

    const litzeFormConfigs: CableStructureForm[] = pinAssignmentStructure
      .filter((pas) => pas.type === 'litze')
      .map((pas) => pas.forms[side]);

    return { coreFormConfigs, shieldFormConfigs, litzeFormConfigs };
  }

  private resetAutomationForm(): void {
    this.pinAutomationForm.reset({
      rightPinAutomationSubValueSelection: '',
      leftPinAutomationSubValueSelection: '',
      leftPinAutomationActionSelection: '',
      rightPinAutomationActionSelection: '',
    });
  }

  private setAutomatedActionSelect(
    assignmentOption: PinAssignmentAutomationActionOptions,
    coreFormConfigs: CableStructureForm[],
    shieldFormConfigs: CableStructureForm[]
  ): void {
    switch (assignmentOption) {
      case this.pinAssignmentAutomationActionOptions.setAllCoresOnContact:
        coreFormConfigs.forEach((coreFormConfig) => {
          coreFormConfig.form.patchValue({ actionSelect: 'setOnContact' });
        });
        break;
      case this.pinAssignmentAutomationActionOptions.connectAllShieldsOnHousing:
        shieldFormConfigs.forEach((shieldFormConfig) => {
          shieldFormConfig.form.patchValue({ actionSelect: 'placeOnJacket' });
        });
        break;
      default:
        break;
    }
    this.resetAutomationForm();
  }

  private eliminateUnusedLitzeLines(): void {
    const isThereAnyLitze = this.pinAssignmentStructure.find((item) => item.type === 'litze');

    if (!isThereAnyLitze) {
      return;
    }
    const result = removeUnusedNewLinesFromActionModels(this.bridges, this.actionModels, this.pinAssignmentStructure);

    this.actionModels = result.actionModels;
    this.pinAssignmentStructure = result.pinAssignmentStructure;

    const lastActionModelKey = Object.keys(this.actionModels).pop();

    this.lineOrder = Number(lastActionModelKey);
  }

  private removeDuplicateOrContainingBridges(side: PinAssignmentSide): void {
    let currentBridges = ObjectUtils.cloneDeep<IcalcBridge[]>(this.bridges[side]);
    const indexValues = [];

    // remove duplicate bridges
    currentBridges = currentBridges.filter(
      (bridge, index, self) =>
        index ===
        self.findIndex(
          (tempBridge) => isSameDot(bridge.start, tempBridge.start) && isSameDot(bridge.end, tempBridge.end)
        )
    );

    // remove duplicate bridges
    currentBridges.forEach((item, index, self) => {
      if (self.findIndex((bridge) => bridgeContainsBridge(bridge, item)) > -1) {
        indexValues.push(index);
      }
    });

    currentBridges = currentBridges.filter((item, index) => !indexValues.includes(index));
    this.bridges[side] = currentBridges;
  }

  private generateLineForm(
    side: string,
    type: CableStructureItemType
  ): {
    form: FormGroup;
    options: FormlyFormOptions;
    fields: object[];
  } {
    if (type === 'shield') {
      return this.generateShieldForm(side);
    }
    if (type === 'core') {
      return this.generateCoreForm(side);
    }
    if (type === 'litze') {
      return this.generateCoreForm(side);
    }
  }

  private generateCoreForm(side: string): {
    form: FormGroup;
    options: FormlyFormOptions;
    fields: object[];
  } {
    const Mat017Items = ArrayUtils.fallBackToEmptyArray<Mat017ItemWithWidenData>(
      side === 'left' ? this.leftMat017ItemList : this.rightMat017ItemList
    ).map<Mat017ItemPickerModel>((item) => ({
      matNumber: item.matNumber,
      itemDescription1: item.itemDescription1,
      itemDescription2: item.itemDescription2,
      mat017ItemGroup: item.mat017ItemGroup,
      supplierItemNumber: item.supplierItemNumber,
    }));

    return {
      form: new FormGroup({}),
      options: {} as FormlyFormOptions,
      fields: [
        {
          // set on contact (an Pin legen) - pin/contact description input
          key: 'pinDescriptionInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.PIN_INPUT_PLACEHOLDER',
            floatLabel: 'never',
            disabled: this.isLocked,
            addonRight: {
              text: 'icalc.pin-assignment.CONTACT',
            },
            attributes: {
              dataCy: 'core-form-pin-input',
            },
          },
          parsers: [StringUtils.coerceAlphanumeric],
          expressions: {
            'props.required': `model.actionSelect === 'setOnContact'`,
          },
          hideExpression: `model.actionSelect !== 'setOnContact'`,
        },
        {
          // SKIN (abisolieren) - mm input
          key: 'skinLengthInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.SKIN_PLACEHOLDER',
            floatLabel: 'never',
            type: 'number',
            disabled: this.isLocked,
            addonRight: {
              text: 'icalc.pin-assignment.SKIN_SUFFIX',
            },
          },
          parsers: [StringUtils.coerceNumeric],
          expressions: {
            'props.required': `model.actionSelect === 'skin'`,
          },
          hideExpression: `model.actionSelect !== 'skin'`,
        },
        {
          // CUT OFF (Abschneiden) - mm input
          key: 'cutOffLengthInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.SKIN_PLACEHOLDER',
            floatLabel: 'never',
            type: 'text',
            disabled: this.isLocked,
            addonRight: {
              text: 'icalc.pin-assignment.SKIN_SUFFIX',
            },
          },
          expressions: {
            'props.required': `model.actionSelect === 'cutOff'`,
          },
          parsers: [StringUtils.coerceNumeric],
          hideExpression: `model.actionSelect !== 'cutOff'`,
        },
        // MAT017 Item selection
        {
          key: 'mat017Item',
          type: 'mat017-item-picker',
          className: 'floating-dependant-control',
          props: {
            translate: true,
            required: true,
            items: Mat017Items,
            disabled: this.isLocked,
            attributes: { dataCy: 'mat017-item-selection' },
          },
          expressions: {
            'props.required': `model.actionSelect === 'mat017Item'`,
          },
          hideExpression: `model.actionSelect !== 'mat017Item'`,
        },
        {
          // Partial Deduction (Teilabzug) - mm input
          key: 'partialDeductionInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER',
            floatLabel: 'never',
            type: 'text',
            disabled: this.isLocked,
            addonRight: {
              text: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER-SUFFIX',
            },
          },
          parsers: [StringUtils.coerceNumeric],
          expressions: {
            'props.required': `model.actionSelect === 'partialDeduction'`,
          },
          hideExpression: `model.actionSelect !== 'partialDeduction'`,
        },
        {
          // connect to housing (ans Gehäuse) - description input
          key: 'placeOnJacketInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.PIN_INPUT_PLACEHOLDER',
            floatLabel: 'never',
            disabled: this.isLocked,
            attributes: {
              dataCy: 'core-form-pin-input',
            },
          },
          parsers: [StringUtils.coerceAlphanumeric],
          expressions: {
            'props.required': `model.actionSelect === 'placeOnJacket'`,
          },
          hideExpression: `model.actionSelect !== 'placeOnJacket'`,
        },
        {
          key: 'actionSelect',
          type: 'multi-level-dropdown',
          props: {
            translate: true,
            required: true,
            disabled: this.isLocked,
            options: [
              { value: 'none', label: 'icalc.pin-assignment.NONE' },
              { value: 'setOnContact', label: 'icalc.pin-assignment.SET_ON_CONTACT' },
              { value: 'mat017Item', label: 'icalc.pin-assignment.MAT017_ITEM' },
              { value: 'isolate', label: 'icalc.pin-assignment.ISOLATE' },
              {
                value: 'cutOff',
                label: 'icalc.pin-assignment.CUT_OFF',
                children: [
                  {
                    value: 'insulate',
                    label: 'icalc.pin-assignment.INSULATE',
                  },
                  {
                    value: 'noInsulate',
                    label: 'icalc.pin-assignment.NO-INSULATE',
                  },
                ],
              },
              {
                value: 'skin',
                label: 'icalc.pin-assignment.SKIN',
                children: [
                  {
                    value: 'none',
                    label: 'icalc.pin-assignment.NO-SUB-ACTION',
                  },
                  {
                    value: 'twist',
                    label: 'icalc.pin-assignment.AND-TWIST',
                  },
                  {
                    value: 'tin',
                    label: 'icalc.pin-assignment.AND-TIN',
                  },
                ],
              },
              {
                value: 'partialDeduction',
                label: 'icalc.pin-assignment.PARTIAL-DEDUCTION',
              },
              {
                value: 'placeOnJacket',
                label: 'icalc.pin-assignment.PLACE_ON_JACKET',
              },
            ],
            attributes: {
              dataCy: 'core-form-select',
            },
          },
          expressions: {
            className: `model.actionSelect === 'none' ? 'greyed-out' : ''`,
          },
        },
        {
          key: 'subActionSelect', // placeholder for selected subAction if any
        },
      ] as FormlyFieldConfig[],
    };
  }

  private generateShieldForm(side: string): {
    form: FormGroup;
    options: FormlyFormOptions;
    fields: object[];
  } {
    const Mat017Items = ArrayUtils.fallBackToEmptyArray<Mat017ItemWithWidenData>(
      side === 'left' ? this.leftMat017ItemList : this.rightMat017ItemList
    ).map<Mat017ItemPickerModel>((item) => ({
      matNumber: item.matNumber,
      itemDescription1: item.itemDescription1,
      itemDescription2: item.itemDescription2,
      mat017ItemGroup: item.mat017ItemGroup,
      supplierItemNumber: item.supplierItemNumber,
    }));

    return {
      form: new FormGroup({}),
      options: {} as FormlyFormOptions,
      fields: [
        {
          key: 'actionSelect',
          type: 'multi-level-dropdown',
          props: {
            translate: true,
            required: true,
            disabled: this.isLocked,
            options: [
              { value: 'none', label: 'icalc.pin-assignment.NONE' },
              { value: 'placeOnJacket', label: 'icalc.pin-assignment.PLACE_ON_JACKET' },
              {
                value: 'rollUp',
                label: 'icalc.pin-assignment.ROLL_UP',
                children: [
                  {
                    value: 'withCopperBand',
                    label: 'icalc.pin-assignment.COPPER-BAND',
                  },
                  {
                    value: 'withHeatShrinkWithoutGlue',
                    label: 'icalc.pin-assignment.WITH-HEAT-SHRINK-WITHOUT-GLUE',
                  },
                  {
                    value: 'fixWithInsulatingTape',
                    label: 'icalc.pin-assignment.FIX-WITH-INSULATING-TAPE',
                  },
                  {
                    value: 'noFix',
                    label: 'icalc.pin-assignment.NO-FIX',
                  },
                ],
              },
              {
                value: 'screenWindow',
                label: 'icalc.pin-assignment.SCREEN-WINDOW',
                children: [
                  {
                    value: 'withCopperBand',
                    label: 'icalc.pin-assignment.WITH-COPPER-BAND',
                  },
                  {
                    value: 'withoutCopperBand',
                    label: 'icalc.pin-assignment.WITHOUT-COPPER-BAND',
                  },
                ],
              },
              {
                value: 'cutOff',
                label: 'icalc.pin-assignment.CUT_OFF',
                children: [
                  {
                    value: 'insulate',
                    label: 'icalc.pin-assignment.INSULATE',
                  },
                  {
                    value: 'noInsulate',
                    label: 'icalc.pin-assignment.NO-INSULATE',
                  },
                ],
              },
              { value: 'extendShield', label: 'icalc.pin-assignment.EXTEND-SHIELD' },
              { value: 'mat017Item', label: 'icalc.pin-assignment.MAT017_ITEM' },
              {
                value: 'leaveItStanding',
                label: 'icalc.pin-assignment.LEAVE-IT-STANDING',
                children: [
                  {
                    value: 'withCopperBand',
                    label: 'icalc.pin-assignment.WITH-COPPER-BAND',
                  },
                  {
                    value: 'withoutCopperBand',
                    label: 'icalc.pin-assignment.WITHOUT-COPPER-BAND',
                  },
                  {
                    value: 'withHeatShrink',
                    label: 'icalc.pin-assignment.WITH-HEAT-SHRINK',
                  },
                  {
                    value: 'withoutHeatShrink',
                    label: 'icalc.pin-assignment.WITHOUT-HEAT-SHRINK',
                  },
                ],
              },
              { value: 'setOnContact', label: 'icalc.pin-assignment.SET_ON_CONTACT' },
              { value: 'tin', label: 'icalc.pin-assignment.TIN' },
              { value: 'twist', label: 'icalc.pin-assignment.TWIST' },
            ],
            attributes: {
              dataCy: 'shield-form-select',
            },
          },
          expressions: {
            className: `model.actionSelect === 'none' ? 'greyed-out' : ''`,
          },
        },
        {
          // RollUp (Zurückschlagen) input
          key: 'rollUpInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.ROLL_UP_PLACEHOLDER',
            floatLabel: 'never',
            type: 'number',
            addonRight: {
              text: 'icalc.pin-assignment.ROLL_UP_SUFFIX',
            },
          },
          expressions: {
            'props.required': `model.actionSelect === 'rollUp'`,
          },
          hideExpression: `model.actionSelect !== 'rollUp'`,
        },
        {
          // set on contact (an Pin legen) - pin/contact description input
          key: 'pinDescriptionInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.PIN_INPUT_PLACEHOLDER',
            floatLabel: 'never',
            addonRight: {
              text: 'icalc.pin-assignment.CONTACT',
            },
          },
          expressions: {
            'props.required': `model.actionSelect === 'setOnContact'`,
          },
          hideExpression: `model.actionSelect !== 'setOnContact'`,
        },
        {
          // screen window (Schirmfenster) input
          key: 'screenWindowInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            type: 'text',
            placeholder: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER',
            floatLabel: 'never',
            addonRight: {
              text: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER-SUFFIX',
            },
          },
          parsers: [StringUtils.coerceNumeric],
          expressions: {
            'props.required': `model.actionSelect === 'screenWindow'`,
          },
          hideExpression: `model.actionSelect !== 'screenWindow'`,
        },
        {
          // CUT OFF (Abschneiden) - mm input
          key: 'cutOffLengthInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER',
            floatLabel: 'never',
            type: 'text',
            disabled: this.isLocked,
            addonRight: {
              text: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER-SUFFIX',
            },
          },
          expressions: {
            'props.required': `model.actionSelect === 'cutOff'`,
          },
          parsers: [StringUtils.coerceNumeric],
          hideExpression: `model.actionSelect !== 'cutOff'`,
        },
        {
          // leave it standing (Stehen lassen) - mm input
          key: 'leaveItStandingInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER',
            floatLabel: 'never',
            type: 'text',
            disabled: this.isLocked,
            addonRight: {
              text: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER-SUFFIX',
            },
          },
          expressions: {
            'props.required': `model.actionSelect === 'leaveItStanding'`,
          },
          parsers: [StringUtils.coerceNumeric],
          hideExpression: `model.actionSelect !== 'leaveItStanding'`,
        },
        {
          // extend shield (Schirm verlängern) - mm input
          key: 'extendShieldInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER',
            floatLabel: 'never',
            type: 'text',
            disabled: this.isLocked,
            addonRight: {
              text: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER-SUFFIX',
            },
          },
          expressions: {
            'props.required': `model.actionSelect === 'extendShield'`,
          },
          parsers: [StringUtils.coerceNumeric],
          hideExpression: `model.actionSelect !== 'extendShield'`,
        },
        {
          // connect to housing (ans Gehäuse) - description input
          key: 'placeOnJacketInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.PIN_INPUT_PLACEHOLDER',
            floatLabel: 'never',
            disabled: this.isLocked,
            attributes: {
              dataCy: 'core-form-pin-input',
            },
          },
          parsers: [StringUtils.coerceAlphanumeric],
          expressions: {
            'props.required': `model.actionSelect === 'placeOnJacket'`,
          },
          hideExpression: `model.actionSelect !== 'placeOnJacket'`,
        },
        {
          // extend shield (Schirm verlängern) - mm input
          key: 'extendShieldInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER',
            floatLabel: 'never',
            type: 'text',
            disabled: this.isLocked,
            addonRight: {
              text: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER-SUFFIX',
            },
          },
          expressions: {
            'props.required': `model.actionSelect === 'extendShield'`,
          },
          parsers: [StringUtils.coerceNumeric],
          hideExpression: `model.actionSelect !== 'extendShield'`,
        },
        // MAT017 Item selection
        {
          key: 'mat017Item',
          type: 'mat017-item-picker',
          className: 'floating-dependant-control',
          props: {
            translate: true,
            required: true,
            items: Mat017Items,
            disabled: this.isLocked,
            attributes: { dataCy: 'mat017-item-selection' },
          },
          expressions: {
            'props.required': `model.actionSelect === 'mat017Item'`,
          },
          hideExpression: `model.actionSelect !== 'mat017Item'`,
        },
        {
          // tin (Verzinnen) - mm input
          key: 'tinInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER',
            floatLabel: 'never',
            type: 'text',
            disabled: this.isLocked,
            addonRight: {
              text: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER-SUFFIX',
            },
          },
          expressions: {
            'props.required': `model.actionSelect === 'tin'`,
          },
          parsers: [StringUtils.coerceNumeric],
          hideExpression: `model.actionSelect !== 'tin'`,
        },
        {
          // twist (Verdrillen) - mm input
          key: 'twistInput',
          type: 'input',
          className: 'floating-dependant-control right-aligned-input',
          props: {
            translate: true,
            required: true,
            placeholder: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER',
            floatLabel: 'never',
            type: 'text',
            disabled: this.isLocked,
            addonRight: {
              text: 'icalc.pin-assignment.NUMERIC-PLACEHOLDER-SUFFIX',
            },
          },
          expressions: {
            'props.required': `model.actionSelect === 'twist'`,
          },
          parsers: [StringUtils.coerceNumeric],
          hideExpression: `model.actionSelect !== 'twist'`,
        },
        {
          key: 'subActionSelect', // placeholder for selected subAction if any
        },
      ] as FormlyFieldConfig[],
    };
  }

  private onDeleteBridge(dot: IcalcDot, side: PinAssignmentSide): void {
    if (this.isEditingBridges === false) {
      return;
    }
    const currentBridges = ObjectUtils.cloneDeep<IcalcBridge[]>(this.bridges[side]);

    this.bridges = { ...this.bridges, [side]: currentBridges.filter((bridge) => !isSameDot(bridge.start, dot)) };
    this.currentBridge = null;
    this.currentBridgeSide = null;
    this.eliminateUnusedLitzeLines();
  }

  private addNewFormValueChanges(valueChangesList: Observable<Record<string, string>>[]): void {
    this.formValueChangesSubject.next([...this.formValueChangesSubject.getValue(), ...valueChangesList]);
  }

  private buildLitzen(): Litze[] {
    return this.pinAssignmentStructure
      .filter((item) => item.type === 'litze')
      .map((item: Litze) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { forms, ...data } = item;

        return data;
      });
  }

  private getCurrentPinAssignmentState(): ConfigurationPinAssignmentState {
    const litze = this.buildLitzen();

    return {
      bridges: this.bridges,
      actionModels: this.actionModels,
      chainFlexNumber: this.partNumber,
      litze,
      base64Image: this.pinAssignmentStateFacadeService.getBase64ImageSnapshot(),
    };
  }

  private getPinAssignmentStructureWithoutTwisting(
    pinAssignmentStructure: CableStructureItemList
  ): CableStructureItemList {
    return pinAssignmentStructure.filter((cS) => cS.type !== 'twisting');
  }

  private setDisabledStateOfForms(isLocked: boolean): void {
    if (isLocked) {
      this.pinAutomationForm.get('leftPinAutomationActionSelection').disable();
      this.pinAutomationForm.get('leftPinAutomationSubValueSelection').disable();
      this.pinAutomationForm.get('rightPinAutomationActionSelection').disable();
      this.pinAutomationForm.get('rightPinAutomationSubValueSelection').disable();
    }
  }

  private setShowSubValueAutomationSelect(side: PinAssignmentSide): void {
    const pinAssignmentStructureWithoutTwisting = this.getPinAssignmentStructureWithoutTwisting(
      this.pinAssignmentStructure
    );
    const structureForms = pinAssignmentStructureWithoutTwisting.map((cS) => cS.forms[side].form);

    const actionSelectValues = structureForms.map((csf) => csf?.get('actionSelect')?.value);

    const hasAtLeastOneFieldThatOffersSubValues: boolean = actionSelectValues.some((aSV) => {
      return aSV === 'skin' || aSV === 'setOnContact' || aSV === 'rollUp';
    });

    if (side === 'left') {
      this.showPinAutomationSubValueSelectLeftSub.next(hasAtLeastOneFieldThatOffersSubValues);
    } else {
      this.showPinAutomationSubValueSelectRightSub.next(hasAtLeastOneFieldThatOffersSubValues);
    }
  }
}
