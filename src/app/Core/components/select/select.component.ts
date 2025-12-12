import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnChanges
  , SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers:[
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectComponent),
        multi: true
      }
  ]
})
export class SelectComponent implements ControlValueAccessor, OnInit, OnChanges {

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @Input() options: any[] = [];
  @Input() ngName: string = '';
  @Input() ngId : string='';
  @Input() label : string ='';
  @Input() placeholder : string ='Select an option';
  @Input() disabled : boolean = false;
  @Input() required: boolean = false;
  @Input() displayProp :string = 'name';
  @Input() valueProp:string='';
  @Input() searchable: boolean = false;
  @Input() searchPlaceholder: string = 'Search...';
  @Input() noResultsText : string = 'No results found';
  @Input() loading:boolean = false;
  @Input() clearable :boolean = true;
  @Input() virtualScroll :boolean = false;
  @Input() maxHeight : string = '240px';
  @Input() minCharsToSearch: number =1;

  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() opened: EventEmitter<void> = new EventEmitter<void>();
  @Output() closed : EventEmitter<void> = new EventEmitter<void>();

  selectedData:any={
  // selectedData Object Contains
    selectedValue: null,
    selectedOption:  null,
    isOpen: false,
    searchQuery: '',
    filteredOptions:  [],
    hasFocus:  false
   
  };


  private onChange =(value:any)=>{};
  private onTouched=() =>{};

  ngOnInit(): void {
      this.selectedData.filteredOptions =[...this.options];
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['options']){
        this.filterOptions();
      }
  }

  writeValue(obj: any): void {
      this.selectedData.selectedValue = obj;
      this.updateSelectedOption();
  }

registerOnChange(fn: any): void {
    this.onChange = fn;
}

registerOnTouched(fn: any): void {
    this.onChange=fn;
}

setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
}

toggleDropdown():void{
  if(this.disabled) return;

  if(!this.selectedData.isOpen){
    this.openDropdown();
  }else{
    this.closeDropdown();
  }
}

  openDropdown():void{
    this.selectedData.isOpen = true;
    this.selectedData.searchQuery ='';
    this.filterOptions();
    this.opened.emit();

    setTimeout(
      ()=>{
        if(this.searchable && this.searchInput){
          this.searchInput.nativeElement.focus();
        }
      }
      ,100
    );
  }

  closeDropdown():void{
    this.selectedData.isOpen = false;
    this.selectedData.searchQuery ='';
    this.filterOptions();
    this.closed.emit();
  }
  selectOption(option:any):void{
    const value = option[this.valueProp] || option;
    this.selectedData.selectedValue = value;
    this.selectedData.selectedOption = option;
    this.updateSelectedOption();
    this.onChange(value);
    this.onTouched();
    this.selectionChange.emit(option);
    this.closeDropdown();
  }


  clearSelection(event?:Event):void{
    if(event){
      event.stopPropagation();
    }

    this.selectedData.selectedValue = null;
    this.selectedData.selectedOption = null;
    this.onChange(null);
    this.onTouched();
    this.selectionChange.emit(null);

  }
  onSearchInput(event:Event):void{
    this.selectedData.searchQuery=(event.target as HTMLInputElement).value;
    this.filterOptions();
    this.searchChange.emit(this.selectedData.searchQuery);
  }

  clearSearch():void{
    this.selectedData.searchQuery ='';
    this.filterOptions();
    if(this.searchInput){
      this.searchInput.nativeElement.focus();
    }
  }

  filterOptions():void{
    if(!this.selectedData.searchQuery || this.selectedData.searchQuery.length < this.minCharsToSearch){
      this.selectedData.filteredOptions =[...this.options];
      return;
    }
}

  updateSelectedOption():void{
    if(!this.selectedData.selectedValue){
      this.selectedData.selectedOption = null;
      return;
    }

    this.selectedData.selectedOption = this.options.find(
      option=>option[this.valueProp]===this.selectedData.selectedValue
    )
  }


  getDisplayValue():string{
    if(!this.selectedData.selectedOption) return this.placeholder;
    return this.selectedData.selectedOption[this.displayProp] || this.selectedData.selectedOption;
  }

  isSelected(option:any):boolean{
    return option[this.valueProp]===this.selectedData.selectedValue;
  }

  onFocus():void{
    this.selectedData.hasFocus = true;
  }

  onBlur():void{
    this.selectedData.hasFocus = false;
    this.onTouched();
  }

  trackByFn(idx:number, opt:any):any{
    return opt[this.valueProp] || idx;
  }

  handleKeydown(event:KeyboardEvent):void{

    if(this.disabled) return;

    const key = event.key;

    switch(key){
      case 'Escape': this.closeDropdown(); break;
      case 'Enter': 
      if(!this.selectedData.isOpen){
        this.openDropdown();
      }
      break;
      case 'ArrowDown':
        if(!this.selectedData.isOpen){
          this.openDropdown();
        }
        event.preventDefault();
        break;
      case 'ArrowUp':
        event.preventDefault();
        break;

    }

  }

}
