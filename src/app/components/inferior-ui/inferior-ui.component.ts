import { Component, OnInit} from '@angular/core';

import { GameService } from '../../services/game/game.service';
import { ComponentComunicationService } from '../../services/componentComunication/component-comunication.service';

@Component({
  selector: 'app-inferior-ui',
  templateUrl: './inferior-ui.component.html',
  styleUrls: ['./inferior-ui.component.css']
})
export class InferiorUIComponent implements OnInit {
  inputSeed:string;

  inputSize:number = 5;
  inputTeams:number = 2;


  checkboxShow:boolean = false;
  
  languages: string[] = ["Español","English"];

  constructor(public gameService:GameService, private componentComunicationService : ComponentComunicationService) { }

  ngOnInit() {
  }

  languageChange(l:string){    
    this.gameService.setLanguage(this.languages.indexOf(l))
 }

 revealMaster(){
    this.componentComunicationService.revealMasterClicked();  
 }

 startNewGame(){
  this.componentComunicationService.newGameClicked();  
 }

 startSeededGame(){
  this.componentComunicationService.newSeededGameClicked(this.inputSeed);  
 }

 
}
