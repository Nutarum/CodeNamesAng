import { Component, OnInit } from '@angular/core';

import { HostListener } from '@angular/core';


//COMUNICACION BD
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs'

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit {
  public funcionKeydownInterna: Function;
  public funcionClickInterna: Function;

  db: AngularFirestore;

  snakeRecords: Observable<any[]>;
  snakeRecordsLocal: any[];

  constructor(db: AngularFirestore) {
    this.db = db;


    //Cargar la lista de records
    this.snakeRecords = this.db.collection('Snake').valueChanges();
    this.snakeRecords.subscribe(data => {      
      this.snakeRecordsLocal = data;   
      this.snakeRecordsLocal.sort((a,b)=>{
        if(a.score > b.score){
          return -1;
        }else{
          return 1;
        }
      })       
    });
  }

  @HostListener('window:mousedown', ['$event'])
  onMousedown(event) {
    this.funcionClickInterna(event);
  }

  @HostListener("window:keydown", ['$event'])
  onKeyDown(event:KeyboardEvent) {
    this.funcionKeydownInterna(event);
  }

  ngOnInit() {
        var self = this;
//region GLOBALES
        var NUMERO_CEREZAS_ESPECIALES = 8;
        var TIPO_CEREZA = 1;
        var TIPO_CEREZA_VERDE = 2;
        var TIPO_CEREZA_UN_USO = 3;
        var TIPO_CEREZA_AZUL = 4;
        var TIPO_CEREZA_MORADA = 5;
        var TIPO_CEREZA_DORADA = 6;
        var TIPO_CEREZA_INVERSORA = 7;
        var TIPO_CEREZA_WORMHOLE = 8;
        var TIPO_CEREZA_VERDE_ESPECIAL = 9;
        var TIPO_CEREZA_TEMPORAL = 10;

        var c: any = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        var tileSize = 10;


        var mapWidth = 30;
        var mapHeight = 30;

        var score = 4;
        var frameTime = 50;
        var vx = 1;
        var vy = 0;
        var x = 14;
        var y = 14;
        var crecer = 0;

        var serpiente = [];
        var objetos = [];

        var cerezaTemporal = 0;
        var pasoTemporal = true;
        var cdAparicion = 0;

        var lastVX = vx;
        var lastVY = vy;
//endregion

      	
        function initGame() {
            cerezaTemporal = 0;
            pasoTemporal = false;
            crecer = 0;
            frameTime = 50;
            cdAparicion = 0;

            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, 300, 300);

            objetos = [];
            serpiente = [];

            drawObjeto(11, 14, 0)
            serpiente.push([11, 14]);
            drawObjeto(12, 14, 0)
            serpiente.push([12, 14]);
            drawObjeto(13, 14, 0)
            serpiente.push([13, 14]);
            drawObjeto(14, 14, 0)
            serpiente.push([14, 14]);

            score = 4;

            document.getElementById("SCORETXT").innerHTML = "SCORE: " + score;
            vx = 1;
            vy = 0;
            lastVX = vx;
            lastVY = vy;
            x = 14;
            y = 14;

            generarObjeto(TIPO_CEREZA);
            generarObjeto(TIPO_CEREZA);
            generarObjeto(TIPO_CEREZA);

        }

        var functionInterval = function () { //BUCLE PRINCIPAL

            setTimeout(functionInterval, frameTime);

            if (!pasoTemporal) {
                return;
            }


            if (frameTime > 50) {
                frameTime -= 2;

            }
            if (frameTime < 50) {
                frameTime += 0.5;
            }
            if (frameTime > 400 && frameTime < 501) {
                frameTime = 100;
            }

            cdAparicion += 0.0001;
            if (Math.random() < 0.003 + cdAparicion) {
                generarCerezaEspecial();
            }


            for (var i = 0; i < objetos.length; i++) {
                if (objetos[i][2] > TIPO_CEREZA) {

                    if (Math.random() < 0.005) {

                        eliminarObjeto(objetos[i])
                        break;


                    }
                }
            }


            moverSerpiente()

            if (cerezaTemporal > 0) {
                cerezaTemporal--;
                pasoTemporal = false;
                if (cerezaTemporal == 0) {
                    drawObjeto(x, y, TIPO_CEREZA_TEMPORAL)
                }
            }

        }
	
	 initGame(); //inicializacion de variables
        setTimeout(functionInterval, frameTime); //arrancamos bucle principal
       
        
        function scriptKeyDown(event) {
            if (pasoTemporal == false) {
                pasoTemporal = true;
                if (cerezaTemporal == 0) {
                    eraseBody(x, y)
                    drawObjeto(x, y, 0)
                }
            }


            if (event.key == 'w' || event.key == 'ArrowUp') {
                if (lastVY != 1) {
                    vx = 0;
                    vy = -1;
                }
            } else if (event.key == 'd' || event.key == 'ArrowRight') {
                if (lastVX != -1) {
                    vx = 1;
                    vy = 0;
                }
            } else if (event.key == 's' || event.key == 'ArrowDown') {
                if (lastVY != -1) {
                    vx = 0;
                    vy = 1;
                }
            } else if (event.key == 'a' || event.key == 'ArrowLeft') {
                if (lastVX != 1) {
                    vx = -1;
                    vy = 0;
                }
            } else if (event.key == 'q' || event.key == '1') {
                if (lastVY==-1) {
                    vx = -1;
                    vy = 0;
                }else if(lastVY==1){
                    vx = 1;
                    vy = 0;
                }else if(lastVX==1){
                    vx = 0;
                    vy = -1;
                }else{
                    vx = 0;
                    vy = 1;
                }
            } else if (event.key == 'e' || event.key == '2') {
                if (lastVY==-1) {
                    vx = 1;
                    vy = 0;
                }else if(lastVY==1){
                    vx = -1;
                    vy = 0;
                }else if(lastVX==1){
                    vx = 0;
                    vy = 1;
                }else{
                    vx = 0;
                    vy = -1;
                }
            }
        }

        function scriptClick(event) {
            if (pasoTemporal == false) {
                pasoTemporal = true;
                if (cerezaTemporal == 0) {
                    eraseBody(x, y)
                    drawObjeto(x, y, 0)
                }
            }

            if(event.clientX < 100){
                if (lastVY==-1) {
                    vx = -1;
                    vy = 0;
                }else if(lastVY==1){
                    vx = 1;
                    vy = 0;
                }else if(lastVX==1){
                    vx = 0;
                    vy = -1;
                }else{
                    vx = 0;
                    vy = 1;
                }
            }else if(event.clientX < 220){

            }else{
                if (lastVY==-1) {
                    vx = 1;
                    vy = 0;
                }else if(lastVY==1){
                    vx = -1;
                    vy = 0;
                }else if(lastVX==1){
                    vx = 0;
                    vy = 1;
                }else{
                    vx = 0;
                    vy = -1;
                }
            }    
        }
        this.funcionKeydownInterna = scriptKeyDown;
        this.funcionClickInterna = scriptClick;


        function moverSerpiente() {

            lastVX = vx;
            lastVY = vy;

            x += vx;
            y += vy;



            for (var i = 0; i < objetos.length; i++) {

                if (objetos[i][2] == TIPO_CEREZA_WORMHOLE) {
                    if (objetos[i][0] == x && objetos[i][1] == y) {

                        serpiente.push([x, y]);
                        score += 1;
                        crecer += 2;
                        x = objetos[i][3];
                        y = objetos[i][4];

                        frameTime = 500;

                        objetos.splice(i, 1)
                        break;
                    } else if (objetos[i][3] == x && objetos[i][4] == y) {

                        serpiente.push([x, y]);
                        score += 1;
                        crecer += 2;
                        x = objetos[i][0];
                        y = objetos[i][1];

                        frameTime = 500;

                        objetos.splice(i, 1)
                        break;

                    }



                } else if (objetos[i][0] == x && objetos[i][1] == y) {
                    if (objetos[i][2] == TIPO_CEREZA) {
                        crecer++;
                        generarObjeto(TIPO_CEREZA);
                    } else if (objetos[i][2] == TIPO_CEREZA_VERDE) {

                        generarObjeto(TIPO_CEREZA_UN_USO);
                        generarObjeto(TIPO_CEREZA_UN_USO);
                        generarObjeto(TIPO_CEREZA_UN_USO);
                        generarObjeto(TIPO_CEREZA_UN_USO);
                        generarObjeto(TIPO_CEREZA_UN_USO);
                        generarObjeto(TIPO_CEREZA_UN_USO);
                        generarObjeto(TIPO_CEREZA_UN_USO);
                    } if (objetos[i][2] == TIPO_CEREZA_UN_USO) {
                        crecer++;
                    } if (objetos[i][2] == TIPO_CEREZA_AZUL) {
                        crecer++;
                        frameTime = 150;
                    } if (objetos[i][2] == TIPO_CEREZA_MORADA) {
                        frameTime = 25;
                        score++;
                        crecer++;
                        document.getElementById("SCORETXT").innerHTML = "SCORE: " + score;
                       
                    } if (objetos[i][2] == TIPO_CEREZA_DORADA) {
                        crecer += 4;
                    } if (objetos[i][2] == TIPO_CEREZA_INVERSORA) {

                        frameTime = 500;


                        crecer += 3;//con esta mierda en realidad creces 2 (pero te va a dara 3ptos weiiiii)

                        eraseBody(x, y);
                        x = serpiente[0][0];
                        y = serpiente[0][1];

                        vx = serpiente[0][0] - serpiente[1][0];
                        vy = serpiente[0][1] - serpiente[1][1];

                        serpiente.splice(0, 1);
                        serpiente.reverse();


                    } if (objetos[i][2] == TIPO_CEREZA_VERDE_ESPECIAL) {
                        crecer++;
                        generarCerezaEspecial();
                        generarCerezaEspecial();
                    } if (objetos[i][2] == TIPO_CEREZA_TEMPORAL) {

                        cerezaTemporal = 10;
                        pasoTemporal = false;

                        crecer++;
                    }

                    eraseBody(x, y)
                    objetos.splice(i, 1)
                    break;

                }
            }


            if (crecer == 0) {
                eraseBody(serpiente[0][0], serpiente[0][1])
                serpiente.splice(0, 1)
            } else {
                crecer--;
                score++;
                document.getElementById("SCORETXT").innerHTML = "SCORE: " + score;
            }



            for (var i = 0; i < serpiente.length; i++) {
                if (serpiente[i][0] == x && serpiente[i][1] == y) {
                    endGame();
                    
                }
            }



            serpiente.push([x, y]);
            drawObjeto(x, y, 0)



            if (x < 0 || y < 0 || x > mapWidth - 1 || y > mapHeight - 1) {
                endGame();
            }


        }

        function endGame(){
                   
          if(self.snakeRecordsLocal[9].score && score>self.snakeRecordsLocal[9].score){                
                var nombre = prompt("New record! Name: ");
                if (!nombre || nombre == "") {                            
              
                }else{
                    if(nombre.length>20){
                        nombre = nombre.substring(0,19);
                    }
                    if(self.snakeRecordsLocal[9].score && score>self.snakeRecordsLocal[9].score){ 
                        var newScore: Object = { name: nombre, score: score, id: self.snakeRecordsLocal[9].id};
                        self.db.collection('Snake').doc(self.snakeRecordsLocal[9].id+"").update(newScore); 
                    }  
                }
                                         
          }
         

            initGame();
        }


        function buscarHuecoVacio() {
            var malcolocada = true;
            while (malcolocada) {
                malcolocada = false;
                var posX = Math.floor(Math.random() * (mapWidth - 1) + 1);
                var posY = Math.floor(Math.random() * (mapWidth - 1) + 1);

                for (var i = 0; i < objetos.length; i++) {
                    if (objetos[i][0] == posX && objetos[i][1] == posY) {
                        malcolocada = true;
                    }
                    if (objetos[i][2] == TIPO_CEREZA_WORMHOLE) {
                        if (objetos[i][3] == posX && objetos[i][4] == posY) {
                            malcolocada = true;
                        }
                    }
                }

                for (var i = 0; i < serpiente.length; i++) {
                    if (serpiente[i][0] == posX && serpiente[i][1] == posY) {
                        malcolocada = true;
                    }
                }
                if (x == posX && y == posY) { //para evitar que aparezca en la casilla en la que esta la cabeza(que puede no existir aun como serpiente)
                    malcolocada = true;
                }
            }

            return [posX, posY];

        }



//region GENERACION Y ELIMINAZION DE OBJETOS
        function generarCerezaEspecial() {
            var rand = Math.floor(Math.random() * (NUMERO_CEREZAS_ESPECIALES) + 3); //+3 porque la 1 y la (3) no son especiales
            if (rand == 3) { //la 3 no es especial pero la 2 si
                rand = 2;
            }
            generarObjeto(rand);

            cdAparicion = 0;
        }


      
        function eliminarObjeto(objeto) {
            setTimeout(() => { borrarObjeto(objeto) }, 250);
            setTimeout(() => { redibujarObjeto(objeto) }, 500);
            setTimeout(() => { borrarObjeto(objeto) }, 750);
            setTimeout(() => { redibujarObjeto(objeto) }, 1000);
            setTimeout(() => { borrarObjeto(objeto) }, 1250);
            setTimeout(() => { redibujarObjeto(objeto) }, 1500);
            setTimeout(() => {
                var i = objetos.findIndex(ob => ob == objeto);
                if (i > -1) {
                    if (objeto[2] == TIPO_CEREZA_WORMHOLE) {
                        eraseBody(objeto[3], objeto[4]);
                    }
                    eraseBody(objeto[0], objeto[1])
                    objetos.splice(i, 1)
                }
            }, 1750);
        }
        

        
        function generarObjeto(tipo) {
            var posicion = buscarHuecoVacio();

            if (tipo == TIPO_CEREZA_WORMHOLE) {
                var posicion2 = buscarHuecoVacio();
                objetos.push([posicion[0], posicion[1], tipo, posicion2[0], posicion2[1]]);
                drawObjeto(posicion[0], posicion[1], tipo);
                drawObjeto(posicion2[0], posicion2[1], tipo);
            } else {
                objetos.push([posicion[0], posicion[1], tipo]);
                drawObjeto(posicion[0], posicion[1], tipo);
            }


        }

      
//endregion


//region DIBUJADOR Y BORRADO DE OBJETOS

        function borrarObjeto(objeto) {
            var i = objetos.findIndex(ob => ob == objeto);
            if (i > -1) {
                if (objeto[2] == TIPO_CEREZA_WORMHOLE) {
                    eraseBody(objeto[3], objeto[4]);
                }
                eraseBody(objeto[0], objeto[1]);
            }
        }
        function redibujarObjeto(objeto) {
            var i = objetos.findIndex(ob => ob == objeto);
            if (i > -1) {
                if (objeto[2] == TIPO_CEREZA_WORMHOLE) {
                    drawObjeto(objeto[3], objeto[4], objeto[2]);
                }
                drawObjeto(objeto[0], objeto[1], objeto[2]);
            }
        }

          function drawObjeto(cx, cy, tipoD) {
            ctx.beginPath();
            ctx.arc(tileSize / 2 + cx * tileSize, tileSize / 2 + cy * tileSize, (tileSize / 2) - 1, 0, 2 * Math.PI);

            if (tipoD == 0) {
                ctx.strokeStyle = "#000000";
            } else if (tipoD == TIPO_CEREZA || tipoD == TIPO_CEREZA_UN_USO) {
                ctx.strokeStyle = "#FF0000";
            } else if (tipoD == TIPO_CEREZA_VERDE) {
                ctx.strokeStyle = "#00FF00";
            } else if (tipoD == TIPO_CEREZA_AZUL) {
                ctx.strokeStyle = "#0000FF";
            } else if (tipoD == TIPO_CEREZA_MORADA) {
                ctx.strokeStyle = "#FF00FF";
            } else if (tipoD == TIPO_CEREZA_DORADA) {
                ctx.strokeStyle = "#999900";
            } else if (tipoD == TIPO_CEREZA_INVERSORA) {
                ctx.strokeStyle = "#00FFFF";
            } else if (tipoD == TIPO_CEREZA_WORMHOLE) {
                ctx.fillStyle = "#FF00FF";
                ctx.strokeStyle = "#FF00FF";
                ctx.fill();
            } else if (tipoD == TIPO_CEREZA_VERDE_ESPECIAL) {
                ctx.fillStyle = "#00FF00";
                ctx.strokeStyle = "#00FF00";
                ctx.fill();
            } else if (tipoD == TIPO_CEREZA_TEMPORAL) {
                ctx.fillStyle = "#999900";
                ctx.strokeStyle = "#999900";
                ctx.fill();
            }

            ctx.stroke();
        }
        
        function eraseBody(x, y) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }        
//endregion










  }

}
