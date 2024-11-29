import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CdkPortalComponent } from './components/cdk-portal/cdk-portal.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderMenuComponent } from './components/header-menu/header-menu.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TableSortIconComponent } from './components/table-sort-icon/table-sort-icon.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DecimalDigitInputDirective } from './directives/decimal-digit-input.directive';
import { DynamicListDirective, DynamicListItemDirective } from './directives/dynamic-list.directive';
import { addonsExtension } from './formly/extensions/formly-addons.extension';
import { formlyApplyAutocompleteExtension } from './formly/extensions/formly-autocomplete.extension';
import { registerTranslateExtension } from './formly/extensions/formly-translation.extension';
import { FormlyActionButtonComponent } from './formly/custom-types/formly-action-button.type';
import { FormlyIconAddonsComponent } from './formly/wrappers/icon-addon.component/formly-icon-addons.component';
import { KoplaAppModule } from './kopla-app.module';
import { MaterialModule } from './material.module';
import { FormatLengthWithFallBackPipe } from './pipes/format-length-with-fallback';
import {
  ConvertDecimalToDeStringPipe,
  ConvertPricePipe,
  ConvertToThreeDigitsPipe,
} from './pipes/convert-decimal-to-de-string.pipe';
import { DisplayColumnWithFallBackPipe } from './pipes/display-column-with-fallback.pipe';
import { IsArrayPipe } from './pipes/is-array.pipe';
import { FormatTooltipPipe, LockedFormatTooltipPipe } from './pipes/format-tooltip.pipe';
import { RevokeConfigurationApprovalComponent } from './components/revoke-configuration-approval/revoke-configuration-approval.component';
import { ItemListLimitReachedComponent } from './components/itemlist-limit-reached/itemlist-limit-reached.component';
import { MatDialogRef } from '@angular/material/dialog';
import { AssignConfigurationSearchDialogComponent } from './components/copy-or-assign-configuration/assign-configuration-search-dialog/assign-configuration-search-dialog.component';
import { AssignConfigurationDialogComponent } from './components/copy-or-assign-configuration/assign-configuration-dialog/assign-configuration-dialog.component';
import { RemoveLinkBetweenConfigurationAndCalculationDialogComponent } from './components/remove-link-between-configuration-and-calculation-dialog/remove-link-between-configuration-and-calculation-dialog.component';
import { ConfigurationSearchComponent } from './components/configuration-search/configuration-search.component';
import { GetConfigPropFromSccPipe } from './pipes/get-config-prop-from-scc.pipe';
import { HasKeysPipe } from './pipes/has-keys.pipe';
import { ConfirmTechnicalWorkStepOverridesResetDialogComponent } from '@icalc/frontend/app/modules/shared/components/confirm-technical-work-step-overrides-reset-dialog/confirm-technical-work-step-overrides-reset-dialog.component';
import { DisableMat017ItemSelectionPipe } from './pipes/disable-mat017-selection.pipe';
import { AssignExistingConfigurationOrCopyDialogComponent } from './components/copy-or-assign-configuration/assign-existing-configuration-or-copy-dialog';
import { CopyConfigurationOptionsDialogComponent } from './components/copy-or-assign-configuration/copy-configuration-options-dialog';
import { CopyConfigurationToExistingCalculationDialogComponent } from './components/copy-or-assign-configuration/copy-configuration-to-existing-calculation-dialog';
import { CopyConfigurationWithUpdatedOverridesDialogComponent } from './components/copy-or-assign-configuration/copy-configuration-with-updated-overrides-dialog';
import { CopyConfigurationToNewCalculationDialogComponent } from './components/copy-or-assign-configuration/copy-configuration-to-new-calculation-dialog';
import { ConnectorItemPriceMismatchModalComponent } from './components/connector-items-price-mismatch-dialog/connector-item-price-mismatch-modal';
import { DisplayWithFallbackPipe } from './pipes/display-fallback-text.pipe';
import { WarningDialogComponent } from './components/warning-dialog/warning-dialog.component';
import { Mat017ItemsLatestModificationDateComponent } from './components/mat017-items-latest-modification-date/mat017-items-latest-modification-date.component';
import { CreateMat017ItemsDialogComponent } from './components/create-mat017-items/create-mat017-items-dialog/create-mat017-items-dialog.component';
import { FormlyCreateMat017ItemsTableComponent } from './components/create-mat017-items/create-mat017-items-dialog';
import { FormlyMat017ItemPickerComponent, Mat017ItemPickerDialogComponent } from './components/mat017-item-picker';
import { MatButtonModule } from '@angular/material/button';
import { FormlyMultiLevelDropdownComponent } from './components/multi-level-dropdown';
import { TranslateGermanPipe } from './pipes/translate-to-german.pipe';

const components = [
  HeaderMenuComponent,
  ToolbarComponent,
  FooterComponent,
  CdkPortalComponent,
  PageNotFoundComponent,
  FormlyActionButtonComponent,
  FormlyIconAddonsComponent,
  TableSortIconComponent,
  RevokeConfigurationApprovalComponent,
  ItemListLimitReachedComponent,
  AssignConfigurationSearchDialogComponent,
  AssignExistingConfigurationOrCopyDialogComponent,
  AssignConfigurationDialogComponent,
  ConfirmTechnicalWorkStepOverridesResetDialogComponent,
  RemoveLinkBetweenConfigurationAndCalculationDialogComponent,
  ConfigurationSearchComponent,
  CopyConfigurationOptionsDialogComponent,
  CopyConfigurationToNewCalculationDialogComponent,
  CopyConfigurationToExistingCalculationDialogComponent,
  CopyConfigurationWithUpdatedOverridesDialogComponent,
  AssignExistingConfigurationOrCopyDialogComponent,
  CopyConfigurationWithUpdatedOverridesDialogComponent,
  ConnectorItemPriceMismatchModalComponent,
  WarningDialogComponent,
  Mat017ItemsLatestModificationDateComponent,
  CreateMat017ItemsDialogComponent,
  FormlyCreateMat017ItemsTableComponent,
  FormlyMat017ItemPickerComponent,
  Mat017ItemPickerDialogComponent,
  FormlyMultiLevelDropdownComponent,
];

const directives = [DecimalDigitInputDirective, DynamicListDirective, DynamicListItemDirective];

const pipes = [
  FormatLengthWithFallBackPipe,
  ConvertDecimalToDeStringPipe,
  ConvertPricePipe,
  IsArrayPipe,
  DisplayColumnWithFallBackPipe,
  FormatTooltipPipe,
  LockedFormatTooltipPipe,
  GetConfigPropFromSccPipe,
  ConvertToThreeDigitsPipe,
  HasKeysPipe,
  DisableMat017ItemSelectionPipe,
  DisplayWithFallbackPipe,
  TranslateGermanPipe,
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    MaterialModule,
    KoplaAppModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      types: [
        { name: 'action-button', component: FormlyActionButtonComponent },
        { name: 'create-mat017-items-table', component: FormlyCreateMat017ItemsTableComponent },
        { name: 'mat017-item-picker', component: FormlyMat017ItemPickerComponent },
        { name: 'multi-level-dropdown', component: FormlyMultiLevelDropdownComponent },
      ],
      wrappers: [{ name: 'addons', component: FormlyIconAddonsComponent }],
      extensions: [
        {
          name: 'autocomplete',
          extension: { prePopulate: formlyApplyAutocompleteExtension },
        },
        { name: 'addons', extension: { onPopulate: addonsExtension } },
      ],
    }),
    FormlyMaterialModule,
    FormlyMatToggleModule,
  ],
  declarations: [...components, ...directives, ...pipes],
  exports: [
    ...components,
    ...directives,
    ...pipes,
    TranslateModule,
    MaterialModule,
    KoplaAppModule,
    ReactiveFormsModule,
    FormlyModule,
    FormsModule,
  ],
  providers: [
    FormatLengthWithFallBackPipe,
    GetConfigPropFromSccPipe,
    {
      provide: FORMLY_CONFIG,
      useFactory: registerTranslateExtension,
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
})
export class SharedModule {}
