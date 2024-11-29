import type { AfterViewInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

enum ResizeStatus {
  off = 'off',
  resize = 'resize',
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-sketch-element',
  templateUrl: './sketch-element.component.html',
  styleUrls: ['./sketch-element.component.scss'],
})
export class SketchElementComponent implements AfterViewInit {
  @Input()
  public showFontButtons = false;

  @Input()
  public isFlipped = false;

  @Input()
  public rotationDegree: number;

  @Input()
  public selectedId: string = null;

  @Input()
  public elementId: string = null;

  @Input()
  public minFontSize = 12;

  @Input()
  public maxFontSize = 24;

  @Input()
  public width!: number;

  @Input()
  public height!: number;

  @Input()
  public fontSize = 12;

  @Output()
  public readonly flipped = new EventEmitter<boolean>();

  @Output()
  public readonly rotated = new EventEmitter<number>();

  @Output()
  public readonly deleted = new EventEmitter<boolean>();

  @Output()
  public readonly decreasedFontSize = new EventEmitter<boolean>();

  @Output()
  public readonly increasedFontSize = new EventEmitter<boolean>();

  @Output()
  public readonly resized = new EventEmitter<{ width: number; height: number }>();

  @ViewChild('BOX')
  public box: ElementRef;

  public readonly resizeStatus = ResizeStatus;
  public mouse: { x: number; y: number };
  public status: ResizeStatus = ResizeStatus.off;
  public position: { x: number; y: number } = { x: 60, y: 60 };
  private boxPosition: { left: number; top: number };

  @HostListener('window:mousemove', ['$event'])
  private onMouseMove(event: MouseEvent): void {
    this.mouse = { x: event.clientX, y: event.clientY };
    if (this.status === ResizeStatus.resize) this.resize();
  }

  public ngAfterViewInit(): void {
    this.loadBox();
  }

  public setStatus(event: MouseEvent, status: ResizeStatus): void {
    if (status === ResizeStatus.resize) event.stopPropagation();
    else this.loadBox();
    this.status = status;
    if (status === ResizeStatus.off) {
      this.resized.emit({ width: this.width, height: this.height });
    }
  }

  public rotate(): void {
    this.rotated.next(this.rotationDegree);
  }

  public flip(): void {
    this.flipped.next(this.isFlipped);
  }

  public delete(): void {
    this.deleted.next(true);
  }

  public decreaseFontSize(): void {
    this.decreasedFontSize.next(true);
  }

  public increaseFontSize(): void {
    this.increasedFontSize.next(true);
  }

  private loadBox(): void {
    const { left, top } = this.box.nativeElement.getBoundingClientRect();

    this.boxPosition = { left, top };
  }

  private resize(): void {
    this.loadBox();
    this.width = Number(this.mouse.x > this.boxPosition.left) ? this.mouse.x - this.boxPosition.left : 0;
    this.height = Number(this.mouse.y > this.boxPosition.top) ? this.mouse.y - this.boxPosition.top : 0;
  }
}
