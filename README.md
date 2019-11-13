# Juegos_Red

------------------------------------------------------------------------------------------------------------------

Game desing document
Juantankamón Redux
Versión 2.0

Autores
Adrián Vaquero Portillo   (a.vaquero.2017@alumnos.urjc.es   | Git: https://github.com/adrvapor)
Iván Sanandrés Gutiérrez  (i.sanandres.2017@alumnos.urjc.es | Git: https://github.com/Ivan-Sanandres)
Martín Ariza García       (m.ariza.2017@alumnos.urjc.es     | Git: https://github.com/Daoab)
Pedro Casas Martínez      (p.casas.2017@alumnos.urjc.es     | Git: https://github.com/thePeter876)

El enlace a Trello es el siguiente: https://trello.com/b/K7lkKa6A/juegos-en-red
El enlace al repositorio de GitHub es el siguiente: https://github.com/Ivan-Sanandres/Juegos_Red

Índice 
Historial de versiones
Objetivos del juego
Sinopsis de la historia
Controles
Requisitos técnicos
Cámara
Mecánicas
Niveles de juego
Apartado gráfico
 

Historial de versiones <br/>
Versión 1.0: Creación del documento de diseño del juego. Hemos añadido los siguientes apartados: <br/>
•	Historial de versiones. <br/>
•	Objetivos del juego. <br/>
•	Sinopsis de la historia. <br/>
•	Controles. <br/>
•	Requisitos técnicos. <br/>
•	Cámara. <br/>
•	Mecánicas. <br/>
•	Niveles del juego. <br/>
•	Apartado gráfico. <br/>

Versión 2.0: Hemos desarrollado la versión local del juego. Hemos modificado los siguientes apartados: <br/>
•	Objetivos del juego. <br/>
•	Controles. <br/>
•	Requisitos técnicos. <br/>
•	Mecánicas. <br/>
•	Niveles del juego. <br/>

Objetivos del juego
Crear un juego en red que emplee el modelo cliente-servidor de forma que dos clientes puedan jugar en la misma partida mediante el servidor.
Ofrecer una experiencia multijugador asimétrica que sea divertida y satisfactoria para ambas partes.

Sinopsis de la historia
Juantankamón es una momia de un museo que cobra vida repentinamente y tiene como objetivo escapar antes de que abra el museo por la mañana.
Sin embargo, no será tarea fácil, ya que deberá esquivar al guardia de seguridad que patrulla el museo por la noche.

Controles Juantankamón <br/>
•	W - Movimiento hacia arriba. <br/>
•	A - Movimiento hacia la izquierda. <br/>
•	S - Movimiento hacia abajo. <br/>
•	D - Movimiento hacia la derecha. <br/>

Controles Guardia <br/>
•	W - Movimiento hacia arriba. <br/>
•	A - Movimiento hacia la izquierda. <br/>
•	S - Movimiento hacia abajo. <br/>
•	D - Movimiento hacia la derecha. <br/>
•	Movimiento de ratón - Girar la cámara <br/>

Requisitos técnicos
Para jugar al videojuego se necesitan dos ordenadores, uno por cada jugador, con navegadores instalados que soporten Phaser 3 y una conexión a internet. También es posible jugar dos jugadores en una sola pantalla en el modo local.

Cámara
Cámara cenital que sigue a cada uno de los personajes mostrando una porción del mapa a cada uno.

Mecánicas <br/>
•	Juantankamón podrá recoger llaves para abrir las distintas puertas del museo. <br/>
•	Juantankamón, gracias a sus poderes, es capaz de ver en la oscuridad (el jugador podrá ver todas casi todas las tiles que muestre la cámara). <br/>
•	Juantankamón deberá llegar a la entrada del museo para escapar y ganar la partida. <br/>
•	El guardia contará con una linterna para poder ver en la oscuridad (el jugador sólo podrá ver las tiles que estén dentro del alcance de la luz de la linterna). <br/>
•	El guardia deberá capturar a Juantankamón alcanzándolo. (El guardia tiene una mayor velocidad de movimiento que Juantankamón). <br/>

Niveles de juego
Hay un único nivel del juego, desarrollado en el museo de donde tendrá que escapar Juantankamón mientras el guardia le da caza. Hay también otro nivel que se usa exclusivamente para el menú principal, en el que también se pueden ver créditos e instrucciones.

Apartado gráfico
Se utilizará un estilo 1-bit mediante los assets con licencia CCO 1.0 Universal del artista Kenney. (https://kenney.nl/assets/bit-pack)
Para la iluminación hemos desarrollado un shader de iluminación y sombreado.

Pantallas del juego
![](Imágenes/captura.png)
Esta es la pantalla del menú principal del juego, en la que se pueden ver los nombres de los desarrolladores, el título del juego, y las teclas que se pueden utilizar para pasar a otras pantallas.

![](Imágenes/captura2.png)
Esta pantalla muestra las instrucciones del juego. Esto incluye las teclas de movimiento de los personajes, así como cuáles son los objetivos de cada uno. También se indican las teclas usadas para pasar a otras pantallas.

![](Imágenes/captura3.png)
Esta es la pantalla de juego. Al estar jugando localmente ambos jugadores en esta fase, se ha optado por utilizar una pantalla partida, mostrando la de la izquierda a Juantankamón, y la de la derecha al guardia.

Finalmente, aquí se puede ver el diagrama de navegación de las distintas pantallas.
![](Imágenes/diagrama.png)

------------------------------------------------------------------------------------------------------------------

Juego desarrollado hasta ahora:
En esta fase del desarrollo hemos creado un juego en navegador para dos jugadores en pantalla partida. Está programado en JavaScript, utilizando el framework para videojuegos Phaser 3. Está dividido en dos escenas de Phaser: Menu, que ofrece información sobre cómo jugar, y LocalGame, que incluye todo lo relacionado con el modo de juego local.

Detalles clave de la implementación:
SHADER:
Se ha desarrollado un shader de postproceso para la cámara que permite la iluminación dinámica del juego, generando también sombras.
El shader usa trazado de rayos para calcular las sombras proyectadas por los objetos, se usa el canal R de color de las texturas para saber qué objetos son traslúcidos y cuáles no.
Permite incluir el número que deseemos de luces, aunque está limitado a 19 como máximo en el shader (pero es algo que se puede aumentar si es necesario).
Además se han creado dos funciones (Light_focal, LightingManager) que permiten gestionar la creación y renderizado de luces para las distintas cámaras del juego, siendo posible que cada cámara tenga unas luces particulares.

Programas usados: <br/>
• Atom, VS Code: IDEs para programación <br/>
• Sourcetree, GitHub Desktop: Gestión del repositorio. <br/>
• Piskel, Photoshop: Creación y edición de sprites. <br/>
• Tiled: Creación del mapa, colisiones, spawn points... <br/>
• Trello: Gestión del proyecto (TO DO, DOING, DONE). <br/>

Assets usados: <br/>
• Fuente texto: https://www.dafont.com/es/minecraftia.font?text=JUANTANKAM%D3N&back=bitmap <br/>
• Tilesheet 1-bit:https://www.kenney.nl/assets/bit-pack <br/>
• Música menú: https://opengameart.org/content/perpetual-tension <br/>
• Música juego: https://opengameart.org/content/kokopellis-graveyard-theme <br/>

Assets creados: <br/>
• Mapa (no las tiles, sino su disposición y diseño de habitaciones) <br/>
• Fondo del menú <br/>
• Iconos de las teclas <br/>

Bibliografía: <br/> 
• https://www.dynetisgames.com/2018/12/09/shaders-phaser-3/ <br/>
• https://stackabuse.com/phaser-3-and-tiled-building-a-platformer/ <br/>
• https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6 <br/>
• https://www.youtube.com/watch?v=2_x1dOvgF1E <br/>
• https://www.youtube.com/watch?v=uznkhVMbVr8 <br/>

Aspectos desarrollados en esta fase <br/>
• Movimiento de los personajes <br/>
• Eventos de colisión <br/>
• Sistema de iluminación y sombreado <br/>
• Sistema de escenas <br/>
• Diseño e implementación del nivel <br/>
• Implementación de sonido <br/>

ASSETS/PROGRAMAS USADOS <br/>
• Tiled <br/>

FISICAS/CÓDIGO NUESTRO

