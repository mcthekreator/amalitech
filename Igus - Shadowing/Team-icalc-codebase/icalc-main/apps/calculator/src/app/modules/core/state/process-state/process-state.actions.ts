import type { FileDownloadOptions } from '@igus/icalc-result';

export class ExportExcelFile {
  public static readonly type = '[ExportExcelFile] prepares data & creates excel files, sets download flags.';
  constructor(
    public payload: {
      productionPlan?: boolean;
      calculation?: boolean;
      selectedDownloadOption?: FileDownloadOptions;
    }
  ) {}
}

export class ChangeSelectedTab {
  public static readonly type = '[ChangeSelectedTab] changes the selected tab on metadata page';
  constructor(public selectedTabIndex: number) {}
}
