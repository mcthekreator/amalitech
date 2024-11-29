import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Mat017ItemPickerModel } from '@igus/icalc-domain';

export interface Mat017ItemPickerDialogData {
  mat017Items: Mat017ItemPickerModel[];
}

@Component({
  selector: 'icalc-mat017-item-picker-dialog',
  templateUrl: './mat017-item-picker-dialog.component.html',
  styleUrl: './mat017-item-picker-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Mat017ItemPickerDialogComponent implements OnInit {
  public selectedMatNumber: string;
  public displayedColumns: string[] = [
    'action',
    'matNumber',
    'itemDescription1',
    'itemDescription2',
    'mat017ItemGroup',
    'supplierItemNumber',
  ];

  public dataSource: MatTableDataSource<Mat017ItemPickerModel>;

  constructor(
    private dialogRef: MatDialogRef<Mat017ItemPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Mat017ItemPickerDialogData
  ) {}

  @ViewChild(MatSort)
  public set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data.mat017Items);
    this.dataSource.sort = this.matSort;
  }

  public confirm(): void {
    this.dialogRef.close(this.selectedMatNumber);
  }

  public onChange(event: MatRadioChange): void {
    this.selectedMatNumber = event.value;
  }

  public onRowClicked(row: Mat017ItemPickerModel): void {
    this.selectedMatNumber = row.matNumber;
  }
}
