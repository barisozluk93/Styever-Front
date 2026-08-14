import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ]
})
export class RichTextEditorComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('editor') editor?: ElementRef<HTMLDivElement>;
  @Input() minHeight = 240;

  disabled = false;
  private value = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.renderValue();
  }

  writeValue(value: string | null | undefined): void {
    this.value = value || '';
    this.renderValue();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(): void {
    if (!this.editor) {
      return;
    }

    this.value = this.editor.nativeElement.innerHTML;
    this.onChange(this.value);
  }

  handleBlur(): void {
    this.onTouched();
  }

  exec(command: string, value?: string): void {
    if (this.disabled) {
      return;
    }

    this.editor?.nativeElement.focus();
    document.execCommand(command, false, value);
    this.handleInput();
  }

  formatBlock(tag: 'p' | 'h2' | 'h3'): void {
    this.exec('formatBlock', tag);
  }

  createLink(): void {
    if (this.disabled) {
      return;
    }

    const url = window.prompt('URL');
    if (!url) {
      return;
    }

    this.exec('createLink', url);
  }

  clearFormatting(): void {
    this.exec('removeFormat');
  }

  private renderValue(): void {
    if (!this.editor) {
      return;
    }

    if (this.editor.nativeElement.innerHTML !== this.value) {
      this.editor.nativeElement.innerHTML = this.value;
    }
  }
}
