import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {FieldType} from '@ngx-formly/core';
import {Subscription} from "rxjs";
import {pluck} from "rxjs/operators";

@Component({
  selector: 'zorrly-select',
  template: `
    <nz-select nzShowSearch nzAllowClear [formControl]="$any(formControl)" [nzMode]="to.mode ? to.mode : 'default'">
      <nz-option *ngFor="let o of $any(this.to.options)" [nzValue]="o.value" [nzLabel]="o.label"></nz-option>
    </nz-select>
  `,
})
export class ZorrlySelect extends FieldType implements OnInit, OnDestroy {

  optionSub = new Subscription();

  constructor(private injector: Injector) {
    super();
  }

  async ngOnInit() {
    if (!!this.to.options$) {
      const parts = this.to.options$.split(':');
      let option$ = this.injector.get(parts[0]);
      if (parts.length > 1) {
        option$ = option$.pipe(pluck(parts.slice(1, parts.length)))
      }
      this.optionSub.add(option$.subscribe((val: any) => this.to.options = val))
    }
  }

  ngOnDestroy(): void {
    this.optionSub.unsubscribe();
  }
}
