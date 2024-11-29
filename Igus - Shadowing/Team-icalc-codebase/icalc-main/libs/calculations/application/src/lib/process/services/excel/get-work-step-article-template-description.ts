import { WorkStepName } from '@igus/icalc-domain';
import type * as ExcelJS from 'exceljs';
import { defaultFont, translationArticleFont } from './static-cell-styles';

export default (workStepName: WorkStepName): ExcelJS.CellValue => {
  let column;

  switch (workStepName) {
    case WorkStepName.projektierung:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Projektierung (1/2 Kalk. / 1/2 MAT-Plan)',
          },
        ],
      };
      break;

    case WorkStepName.assembly:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Anschluß / Montage',
          },
          {
            font: translationArticleFont,
            text: '/ connection assembly',
          },
        ],
      };
      break;

    case WorkStepName.auftragsmanagement:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Auftragsmanagement (1/3 Angebot / 1/3 Auftragserfass. / 1/3 PZ prüfen)',
          },
        ],
      };
      break;

    case WorkStepName.einkaufDispo:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Einkauf / Disposition',
          },
        ],
      };
      break;

    case WorkStepName.transportStock:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Interner Transport / Lagerung',
          },
          {
            font: translationArticleFont,
            text: '/ transport and stock',
          },
        ],
      };
      break;

    case WorkStepName.consignment:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Kommissionierung',
          },
          {
            font: translationArticleFont,
            text: '/ consignment',
          },
        ],
      };
      break;

    case WorkStepName.strip:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Abmanteln',
          },
          {
            font: translationArticleFont,
            text: ' / strip',
          },
        ],
      };
      break;

    case WorkStepName.shieldHandling:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Schirmbehandlung',
          },
          {
            font: translationArticleFont,
            text: ' / shield handling',
          },
        ],
      };
      break;

    case WorkStepName.stripShieldHandling:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Abmanteln / Schirmbehandlung',
          },
          {
            font: translationArticleFont,
            text: '/ strip / shield handling',
          },
        ],
      };
      break;

    case WorkStepName.stripOuterJacket:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Abmanteln Außenmantel',
          },
          {
            font: translationArticleFont,
            text: ' / strip outer jacket',
          },
        ],
      };
      break;

    case WorkStepName.stripInnerJacket:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Abmanteln Innenmantel',
          },
          {
            font: translationArticleFont,
            text: ' / strip inner jacket',
          },
        ],
      };
      break;

    case WorkStepName.shieldHandlingInnerShield:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Schirmbehandlung Innenschirm',
          },
          {
            font: translationArticleFont,
            text: ' / shield handling inner shield',
          },
        ],
      };
      break;

    case WorkStepName.shieldHandlingOuterShield:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Schirmbehandlung Außenschirm',
          },
          {
            font: translationArticleFont,
            text: ' / shield handling outer shield',
          },
        ],
      };
      break;

    case WorkStepName.skinning:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Abisolieren',
          },
          {
            font: translationArticleFont,
            text: ' / skinning',
          },
        ],
      };
      break;

    case WorkStepName.crimp:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Anschluß Crimp',
          },
          {
            font: translationArticleFont,
            text: ' / crimp',
          },
        ],
      };
      break;

    case WorkStepName.labeling:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Beschriftung',
          },
          {
            font: translationArticleFont,
            text: ' / labeling',
          },
        ],
      };
      break;

    case WorkStepName.drillingSealInsert:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Bohren Dichteinsatz',
          },
          {
            font: translationArticleFont,
            text: ' / drilling seal insert',
          },
        ],
      };
      break;

    case WorkStepName.test:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Funktionsprüfung',
          },
          {
            font: translationArticleFont,
            text: ' / test',
          },
        ],
      };
      break;

    case WorkStepName.sendTestReport:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Prüfprotokolle mitverschicken',
          },
          {
            font: translationArticleFont,
            text: ' / send the test report',
          },
        ],
      };
      break;

    case WorkStepName.cutUnder20MM:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Schnittkosten',
          },
          {
            font: translationArticleFont,
            text: ' / cut cost',
          },
        ],
      };
      break;

    case WorkStepName.cutOver20MM:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Schnittkosten',
          },
          {
            font: translationArticleFont,
            text: ' / cut cost',
          },
        ],
      };
      break;

    case WorkStepName.testFieldPrep:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Prüffeld-Vorbereitung',
          },
          {
            font: translationArticleFont,
            text: ' / test field preparation',
          },
        ],
      };
      break;

    case WorkStepName.package:
      column = {
        richText: [
          {
            font: defaultFont,
            text: 'Verpackung',
          },
          {
            font: translationArticleFont,
            text: ' / package',
          },
        ],
      };
      break;
    default:
      break;
  }
  return column;
};
