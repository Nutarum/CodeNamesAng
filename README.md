# CodeNamesAng

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run 'ng serve' for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## >>> ToDo <<<
-El boton de "pass turn" como boton de "start game" para empezar el primer turno? (hasta que no le das no se muestran las palabras pero se puede preparar la partida y revelar master y todo)  
-¿Pasar turno automaticamente cuando el timer llege a 0?

## >>> BUGS <<<
-Al cargar una partida empezada, el tiempo de turno va a estar desincronizado (en la BD no se guarda el tiempo actual, por lo que no tiene solución simple/que no genere mucho tráfico)  
-¿Posibles problemas de sincronizacion al realizar acciones cuando un jugador esta cargando el juego? ¿o varios jugadores interactuan a la vez?


## >>> DEPLOY GUIDE <<<

ng build --prod

mover archivos dentro de la carpeta dist/codeNamesAng a la raiz de dist

firebase deploy

*Si es la primera vez que lo hacemos, tenemos que hacer "firebase init" y "firebase login"

## >>> ABOUT THE DATABASE <<<
<pre>
this project is using a firebase database whit 3 collections  
	- Games<br />
		*this collection will auto populate  
	- Snake<br />
		* 10 documents whit names from 1 to 10, containing:  
			. a number called id, value same as document names  
			. a string called name, value doesnt matter  
			. a number called score, value doesnt matter (preferably low numbers)  
	- Utils  
		* one document (confirmConnection) with a field -> conf: "conf"  
</pre>