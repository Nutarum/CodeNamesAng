import { Component, OnInit } from '@angular/core';

import { GameService } from '../../services/game/game.service';
import { ComponentComunicationService } from '../../services/componentComunication/component-comunication.service';

@Component({
  selector: 'app-superior-ui',
  templateUrl: './superior-ui.component.html',
  styleUrls: ['./superior-ui.component.css']
})
export class SuperiorUIComponent implements OnInit {

  constructor(public gameService: GameService, private componentComunicationService : ComponentComunicationService) { }

  ngOnInit() {
  }

  endTurn(){
    this.componentComunicationService.endTurnClicked();  
 }
  
}
