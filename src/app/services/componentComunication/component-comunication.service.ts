import { Injectable,EventEmitter,Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentComunicationService {


  constructor() { }

  //comunication from the inferior UI to the word table, indicating the reveal button has been pressed
  @Output() btnRevealMasterClicked: EventEmitter<null> = new EventEmitter();
  revealMasterClicked(){
    this.btnRevealMasterClicked.emit();
  }

  //comunication from the inferior UI to the word table, indicating the new game button has been pressed
  @Output() btnNewGameClicked: EventEmitter<null> = new EventEmitter();
  newGameClicked(){
    this.btnNewGameClicked.emit();
  }

  //comunication from the inferior UI to the word table, indicating the new seeded game button has been pressed
  @Output() btnNewSeededGameClicked: EventEmitter<string> = new EventEmitter();
  newSeededGameClicked(seed: string){
    this.btnNewSeededGameClicked.emit(seed);
  }

   //comunication from the superior UI to the word table, indicating the pass turn button has been pressed
   @Output() btnEndTurnClicked: EventEmitter<null> = new EventEmitter();
   endTurnClicked(){
     this.btnEndTurnClicked.emit();
   }
}
