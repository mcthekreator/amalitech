import { NO_ERRORS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { ChainflexStateFacadeService } from '@icalc/frontend/app/modules/core/state/chainflex-state/chainflex-state-facade.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import { LibraryStateFacadeService } from '@icalc/frontend/app/modules/core/state/library-state/library-state-facade.service';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import type { Observable } from 'rxjs';

import { LibraryComponent } from './library.component';
import { RouterModule } from '@angular/router';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [LibraryComponent],
      schemas: [NO_ERRORS_SCHEMA],
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
            mat017ItemLoadingStatus$: of(null),
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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
