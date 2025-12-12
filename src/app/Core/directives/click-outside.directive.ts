import { Directive, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({
    selector:'[clickOutside]'
})

export class clickOutsideDirective {
     
 @Output() clickOutSide = new EventEmitter<void>();

    constructor(private elemRef:ElementRef){}
        
    @HostListener('document:click', ['$event.target'])
    onClick(target:any):void{
        const clickedInside = this.elemRef.nativeElement.Contains(target);
        if(!clickedInside){
            this.clickOutSide.emit();
        }
    }

    
    @HostListener('document:keydown.escape')
    onEscKey():void{
        this.clickOutSide.emit();
    }
    
    
    
}