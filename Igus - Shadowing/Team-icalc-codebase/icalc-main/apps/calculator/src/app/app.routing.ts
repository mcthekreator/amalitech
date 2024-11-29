import type { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { IcalcRoutes } from './constants/route.constants';
import { TranslationResolver } from './modules/core/services/translation.resolver';
import { AuthGuard } from './modules/core/services/auth.guard';
import { PageNotFoundComponent } from './modules/shared/components/page-not-found/page-not-found.component';
import { RequiredDataGuard } from './modules/core/services/required-data.guard';
import { LoginGuard } from './modules/core/services/login.guard';

export const appRoutes: Routes = [
  {
    path: 'app',
    component: AppComponent,
    resolve: { translations: TranslationResolver },
    // TODO: possible location to adjust routing access for cypress to set begin test cases in custom states. e.g. To prevent the need to click through whole icalc to test a button in step 6
    canActivate: [AuthGuard],
    children: [
      {
        path: IcalcRoutes.metaData,
        loadChildren: () => import('./modules/features/meta-data/meta-data.module').then((m) => m.MetaDataModule),
      },
      {
        path: IcalcRoutes.chainFlex,
        loadChildren: () => import('./modules/features/chainflex/chainflex.module').then((m) => m.ChainflexModule),
        canActivate: [RequiredDataGuard],
        data: {
          requiredData: IcalcRoutes.metaData,
          redirectTo: IcalcRoutes.metaData,
        },
      },
      {
        path: IcalcRoutes.connector,
        loadChildren: () => import('./modules/features/connector/connector.module').then((m) => m.ConnectorModule),
      },
      {
        path: IcalcRoutes.library,
        loadChildren: () => import('./modules/features/library/library.module').then((m) => m.LibraryModule),
        canActivate: [RequiredDataGuard],
        data: {
          requiredData: IcalcRoutes.connectorRight,
          redirectTo: `${IcalcRoutes.connector}/${IcalcRoutes.right}`,
        },
      },
      {
        path: IcalcRoutes.pinAssignment,
        loadChildren: () =>
          import('./modules/features/pin-assignment/pin-assignment.module').then((m) => m.PinAssignmentModule),
        canActivate: [RequiredDataGuard],
        data: {
          requiredData: IcalcRoutes.library,
          redirectTo: IcalcRoutes.library,
        },
      },
      {
        path: IcalcRoutes.results,
        loadChildren: () => import('./modules/features/results/results.module').then((m) => m.ResultsModule),
        canActivate: [RequiredDataGuard],
        data: {
          requiredData: IcalcRoutes.chainFlex,
          redirectTo: IcalcRoutes.chainFlex,
        },
      },
      { path: '', redirectTo: IcalcRoutes.metaData, pathMatch: 'full' },
      { path: '**', redirectTo: IcalcRoutes.metaData },
    ],
  },
  {
    path: IcalcRoutes.admin,
    resolve: { translations: TranslationResolver },
    loadChildren: () => import('./modules/features/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: IcalcRoutes.auth,
    resolve: { translations: TranslationResolver },
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./modules/features/authentication/authentication.module').then((m) => m.AuthenticationModule),
  },
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, resolve: { translations: TranslationResolver } },
];
