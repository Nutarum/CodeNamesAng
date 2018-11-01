import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  remaining: number[] = [];

  language: number = 0;
  numberOfMasters: number = 0;

  spyMap: number[][] = [];
  revealedMap: number[][] = [];
  gameSeed: string = "0";

  tableSize: number = 5;
  deathWords: number = 1;
  numberOfWordsPerTeam = [9, 8, 8, 7, 7];
  numberOfTeams = 2;

  timer: number = 60;
  turn: number = 0;
  winner: number = -1;
  
  //esto hace referencia a la diferencia que existe entre la posicion de los equipos del array y los arrays de colores, es decir, el equipo azul (0) tiene el color 3
  startingTeamOffset: number = 3;

  constructor() {
    //para evitar errores en el html
    for (var i = 0; i < this.tableSize; i++) {
      this.spyMap[i] = [];
      this.revealedMap[i] = [];
      for (var j = 0; j < this.tableSize; j++) {
        this.spyMap[i][j] = 1;
        this.revealedMap[i][j] = 0;
      }
    }
  }


  setRemaining(t: number, n: number) {
    this.remaining[t] = n;
  }

  setLanguage(l: number) {
    this.language = l;
  }

  initializeSpyMap(rng) {



    for (var i = 0; i < this.tableSize; i++) {
      this.spyMap[i] = [];
      this.revealedMap[i] = [];
      for (var j = 0; j < this.tableSize; j++) {
        this.spyMap[i][j] = 1;
        this.revealedMap[i][j] = 0;
      }
    }


    for (var i = 0; i < this.deathWords; i++) {
      var randomN = Math.floor(rng() * this.tableSize);
      var randomN2 = Math.floor(rng() * this.tableSize);
      while (this.spyMap[randomN][randomN2] != 1) {
        var randomN = Math.floor(rng() * this.tableSize);
        var randomN2 = Math.floor(rng() * this.tableSize);
      }
      this.spyMap[randomN][randomN2] = 2;
    }


    for (var t = 0; t < this.numberOfTeams; t++) {

      for (var i = 0; i < this.remaining[t]; i++) {
        var randomN = Math.floor(rng() * this.tableSize);
        var randomN2 = Math.floor(rng() * this.tableSize);

        while (this.spyMap[randomN][randomN2] != 1) {
          var randomN = Math.floor(rng() * this.tableSize);
          var randomN2 = Math.floor(rng() * this.tableSize);
        }
        this.spyMap[randomN][randomN2] = t + 3;
      }

    }






  }



}
