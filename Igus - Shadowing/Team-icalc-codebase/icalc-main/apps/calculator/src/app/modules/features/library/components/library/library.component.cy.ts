import { TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library.component';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import { ChainflexStateFacadeService } from '@icalc/frontend/app/modules/core/state/chainflex-state/chainflex-state-facade.service';
import { LibraryStateFacadeService } from '@icalc/frontend/app/modules/core/state/library-state/library-state-facade.service';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe(LibraryComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: AppStateFacadeService,
          useValue: {
            metaData$: of({}),
            userData$: of({}),
            setCurrentStep: (): void => {},
            setMainCssClass: (): void => {},
            updateAppStateAndSaveCalculation: (): void => {},
            updateCurrentCalculation: (): void => {},
            nextStep$: of(null),
            previousStep$: of(null),
          },
        },
        {
          provide: ConnectorStateFacadeService,
          useValue: {
            leftItemList$: of(null),
            rightItemList$: of(null),
            addWidenImage: (): void => {},
          },
        },
        {
          provide: ChainflexStateFacadeService,
          useValue: {
            getChainflexCableLength: (): void => {},
          },
        },
        {
          provide: LibraryStateFacadeService,
          useValue: {
            setSketchDate: (): void => {},
            addToImageList: (): void => {},
            addToCommentList: (): void => {},
            setBase64Image: (): void => {},
            leftChainFlex$: of(null),
            rightChainFlex$: of(null),
            imageList$: of(null),
            commentList$: of(null),
            leftItemList$: of(null),
            updateSketchItemInfo: (): void => {},
            updateChainFlexInfo: (): void => {},
            removeFromImageOrCommentList: (): void => {},
            updateLibraryStateInCalculation: (): void => {},
            updateCurrentCalculation: (): void => {},
            getLibraryStateSnapshot: (): void => {},
            enteringLibraryPageStarted: (): void => {},
            leavingLibraryPageStarted: (): void => {},
          },
        },
        {
          provide: ProcessStateFacadeService,
          useValue: {
            selectedConfigurationItem$: (): Observable<object> => of({}),
            selectedConfigurationData$: of(null),
            isLocked$: of(false),
          },
        },
      ],
    });
  });

  it('renders', () => {
    cy.mount(LibraryComponent);
  });

  it('shows spinner and uploaded image for both tiles of an item that was added on both sides', () => {
    // TODO in ICALC-745
    cy.mount(LibraryComponent);
  });
});
