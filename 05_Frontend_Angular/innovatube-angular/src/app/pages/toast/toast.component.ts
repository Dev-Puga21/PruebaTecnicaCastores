import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  standalone: true,
  styleUrls: ['./toast.component.css'] // opcional si tienes estilos aparte
})
export class ToastComponent implements OnDestroy {
  @Input() duration = 3000;
  @Output() onClose = new EventEmitter<void>();

  message: string = '';
  visible: boolean = false;
  private timer: any;

  show(message: string): void {
    this.message = message;
    this.visible = true;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.visible = false;
      this.onClose.emit();
    }, this.duration);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
