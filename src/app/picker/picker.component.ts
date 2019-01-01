import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as moment from 'moment';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PickerComponent),
    multi: true
};

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class PickerComponent implements ControlValueAccessor, OnInit {

  // inputs
  @Input() model: moment.Moment; // - the actual model we are going to update

  // variables
  startOfCurrentMonth = moment().startOf('month');
  endOfCurrentMonth = moment().endOf('month');
  currentMonth: moment.Moment[];

  // test that moment is working
  testMoment = moment();

  constructor() { }

  //The internal data model
  private innerValue: any = '';

  //Placeholders for the callbacks which are later provided
  //by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  //get accessor
  get value(): any {
      return this.innerValue;
  }

  //set accessor including call the onchange callback
  set value(v: any) {
      if (v !== this.innerValue) {
          this.innerValue = v;
          this.onChangeCallback(v);
      }
  }

  //Set touched on blur
  onBlur() {
      this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
      if (value !== this.innerValue) {
          this.innerValue = value;
      }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
      this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
      this.onTouchedCallback = fn;
  }

  ngOnInit() {
    // console.log('+++ Start of current month: ', this.startOfCurrentMonth, ' +++');
    // console.log('+++ End of current month: ', this.endOfCurrentMonth, ' +++');

    // now we need to go through and create the array of dates
    this.currentMonth = this.generateMonth(this.startOfCurrentMonth, this.endOfCurrentMonth);
  }


  /**
   * @description - generate a month given the start and end dates
   * @param startDate - moment date representing the start of the month
   * @param endDate - moment date representing the end of the month
   */
  generateMonth(startDate: moment.Moment, endDate: moment.Moment): moment.Moment[] {

    const month: moment.Moment[] = [startDate];

    // first of all calculate the no of days
    const difference = moment.duration(endDate.diff(startDate));
    const daysDifference = Math.floor(difference.asDays());

    // console.log('+++ Days Difference: ', daysDifference, ' +++');
    // console.log('+++ Difference: ', difference, ' +++');

    for (let i = 1; i <= daysDifference; i++) {
      month.push( startDate.clone().add(i, 'days') );
    }

    // console.log('+++ Final Month: ', month, ' +++');
    return month;
  }

  test() {
    console.log('test');
    this.innerValue = moment();
    this.writeValue(moment());
    this.registerOnChange(moment());
  }
}
