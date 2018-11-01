import { Component, OnInit } from '@angular/core';

//COMUNICACION BD
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs'

//LIBRERIAS EXTERNAS
import * as SeedRandom from 'seedrandom';
import { NgxSpinnerService } from 'ngx-spinner';

//IMPORTACIONES PERSONALES
import { words } from '../../models/words';
import { GameService } from '../../services/game/game.service';
import { ComponentComunicationService } from '../../services/componentComunication/component-comunication.service';


@Component({
  selector: 'app-words-table',
  templateUrl: './words-table.component.html',
  styleUrls: ['./words-table.component.css']
})
export class WordsTableComponent implements OnInit {
  //el array se autoredimensionara segun se le añadan palabras
  words: string[][] = [["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]];

  //variable para modificar el estilo con ngStyle, en gamestart cambia su valor a 100/table_size
  tableWidth = "20%";

  confirmWords: boolean = false;

  gameStateArray: boolean[];
  gameState: Observable<any[]>;

  isFirstLoadForLoadedGame: boolean = false;

  db: AngularFirestore;
  constructor(private spinner: NgxSpinnerService, db: AngularFirestore, private gameService: GameService, private componentComunicationService: ComponentComunicationService) {
    this.db = db;
  }

  ngOnInit() {
    //detectamos si se esta utilizando la app en un movil
    this.confirmWords = /Android|iPhone/i.test(window.navigator.userAgent);
    //triggers para recibir los eventos de click en botones de otros componentes
    this.componentComunicationService.btnRevealMasterClicked.subscribe(nothing => {
      this.revealMaster();
    });
    this.componentComunicationService.btnNewGameClicked.subscribe(nothing => {
      this.startNewGame();
    });
    this.componentComunicationService.btnNewSeededGameClicked.subscribe(seed => {
      this.startNewGame(seed);
    });
    this.componentComunicationService.btnEndTurnClicked.subscribe(nothing => {
      this.endTurn();
    });

    //arrancamos el timer
    this.timerLoop()
  }
  
  endTurn(){
    var nextTurn = this.gameService.turn +1;
    if(nextTurn > this.gameService.numberOfTeams-1){
      nextTurn = 0;
    }
    
    var updatedTimer: Object = JSON.parse('{"CHANGE_TURN": ' + nextTurn + '}');
    
    this.db.collection('Games').doc(this.gameService.gameSeed).update(updatedTimer);
  }

  timerLoop(){
    setTimeout(() => {
      this.gameService.timer -= 1;
      this.timerLoop();
    }, 1000);
  }

  startNewGame(gameSeed?: string) {
    this.isFirstLoadForLoadedGame = true;

    let sum = 0;
    for (var i = 0; i < this.gameService.numberOfTeams; i++) {
      sum += this.gameService.numberOfWordsPerTeam[i];
    }
    if (sum > (this.gameService.tableSize * this.gameService.tableSize) - this.gameService.deathWords) {
      alert("Table size too small for the number of words per team.")
      return;
    }

    this.tableWidth = 100/this.gameService.tableSize + "%";

    if (!gameSeed) {
      //si no recibimos la semilla (generamos una aleatoria. entre 0 y 999999)
      gameSeed = "" + Math.floor(Math.random() * (999999 + 1));
    }
    this.gameService.gameSeed = gameSeed;
    this.linkGameState();    
    var rng = SeedRandom(gameSeed);
    this.words=[]
    var tempWordList = Object.assign([], new words().wordsList[this.gameService.language]);;
    for (var i = 0; i < this.gameService.tableSize; i++) {
      this.words[i] = [];
      for (var j = 0; j < this.gameService.tableSize; j++) {
        var index = Math.floor(rng() * (tempWordList.length));  //a este random no le sumamos el 1, length-1 es el ultimo elemento  
        this.words[i][j] = tempWordList[index].toUpperCase();
        tempWordList.splice(index, 1);
      }
    }
    this.gameService.remaining = [];
    for (var i = 0; i < this.gameService.numberOfTeams; i++) {
      var rand = Math.floor(rng() * (this.gameService.numberOfTeams));
      //mientras exista y sea distinto de 0, es que ya esta establecido asi que buscamos otro
      while (this.gameService.remaining[rand] && this.gameService.remaining[rand] != 0) {
        var rand = Math.floor(rng() * (this.gameService.numberOfTeams));
      }
      this.gameService.remaining[rand] = this.gameService.numberOfWordsPerTeam[i];
    }

    //establecemos quien va a ser el primer jugador
    this.gameService.turn = Math.max.apply(null,this.gameService.remaining); //el apply sirve para pasar un array como parametro, el primer parametro (null) es necesario
    this.gameService.turn = this.gameService.remaining.indexOf(this.gameService.turn);

    //otras inicializaciones    
    this.gameService.winner = -1;
    this.gameService.initializeSpyMap(rng);
    this.gameService.timer = 60;
  }

  linkGameState() {
    this.spinner.show();
    
    this.gameState = this.db.collection('Games', ref => ref.where('id', '==', this.gameService.gameSeed)).valueChanges();
    this.gameState.subscribe(data => {
      if (!data[0]) { //Si la partida no esta en la base de datos la generamos  
        //aunque no existiese, el subscribe va a saltar automaticamente en cuanto pase a existir por lo que se ejecutara el else
        var newGame: Object = { id: this.gameService.gameSeed, mastersNumber: 0 };
        this.db.collection('Games').doc(this.gameService.gameSeed).set(newGame);
      } else {
        this.updateState(data[0]);
        this.gameService.numberOfMasters = data[0]['mastersNumber'];
      }
    });
  }
  //aqui se revelan visualmente las casillas cuando se recibe un cambio de la BD
  updateState(data: JSON) {
    var dataArr = Object.keys(data);

    if (dataArr.includes("CHANGE_TURN")){
      var turnoBD = Object.values(data)[dataArr.indexOf("CHANGE_TURN")];
      if(this.gameService.turn != turnoBD){
        this.gameService.turn = turnoBD;
        this.gameService.timer = 60;
      }
    }

    //utilizamos este update para tener todo el revelar casillas en el then, evitamos que se puedan ver las soluciones "tirando del cable"
    this.db.collection('Utils').doc("confirmConnection").update({ conf: "conf" }).then(nothing => {


      for (var i = 0; i < this.gameService.tableSize; i++) {
        for (var j = 0; j < this.gameService.tableSize; j++) {
          if (dataArr.includes(this.words[i][j])) {
            var revealedWordTeam = this.gameService.spyMap[i][j] - this.gameService.startingTeamOffset;
            //si aun no se ha descubierto, o esta en modo descubierta por master
            if (this.gameService.revealedMap[i][j] == 0 || this.gameService.revealedMap[i][j] > 100) {
              this.gameService.revealedMap[i][j] = this.gameService.spyMap[i][j];
              this.gameService.setRemaining(revealedWordTeam, this.gameService.remaining[revealedWordTeam] - 1);

              //comprobamos si un equipo ha ganado
              if(this.gameService.remaining[revealedWordTeam]==0){
                  this.gameService.winner = revealedWordTeam;        
              }
              //si se ha caido en la muerte
              else if(this.gameService.revealedMap[i][j]==2){
                //si estamos en una partida de 2 equipo
                  if(this.gameService.numberOfTeams==2){
                    if(this.gameService.turn == 0){
                      this.gameService.winner = 1;
                    }else{
                      this.gameService.winner = 0;
                    }       
                     //si estamos en una partida de mas de 2 equipo, vamos simplemente  a pasar turno y fuera
                     //total, nadie va a jugar con mas de 2 equipos no merece la pena el esfuerzo                           
                  }else{                   
                    if(!this.isFirstLoadForLoadedGame){
                      this.endTurn();
                    }                  
                  }                                  
              }             
               //si la palabra es un fallo, perdemos turno
               else if(this.gameService.turn!=revealedWordTeam){
                if(!this.isFirstLoadForLoadedGame){
                  this.endTurn();
                }   
              }            
            }
          }
        }
      }
      this.isFirstLoadForLoadedGame = false;
      this.spinner.hide();
    });
  }

  //cuando se hace click en una casilla, se pone en true en la BD
  reveal(w: string) {   
    if (this.confirmWords) {
      if (!confirm("Reveal: " + w)) {
        return;
      }
    }
    var updatedGame: Object = JSON.parse('{"' + w + '": true}');
    this.db.collection('Games').doc(this.gameService.gameSeed).update(updatedGame);
  }

  revealMaster() {
    if (!confirm("Reveal all words?")) {
      return;
    }
    this.gameService.numberOfMasters += 1;
    var updatedGame: Object = { id: this.gameService.gameSeed, mastersNumber: this.gameService.numberOfMasters };
    this.db.collection('Games').doc(this.gameService.gameSeed).update(updatedGame).then(nothing => {
      //al tener esto en el then, evitamos que se puedan ver las soluciones "tirando del cable"
      //recorremos todas las casillas
      for (var i = 0; i < this.gameService.tableSize; i++) {
        for (var j = 0; j < this.gameService.tableSize; j++) {
          if (this.gameService.revealedMap[i][j] == 0) {
            this.gameService.revealedMap[i][j] = this.gameService.spyMap[i][j] + 100;
          }
        }
      }
    });
  }
}