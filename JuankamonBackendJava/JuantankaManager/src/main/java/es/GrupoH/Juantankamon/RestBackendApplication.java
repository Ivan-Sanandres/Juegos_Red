package es.GrupoH.Juantankamon;

import java.util.Timer;
import java.util.TimerTask;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RestBackendApplication {

	public static int frequency = 3;					//Frecuencia a la que el servidor hará las comprobaciones
	
	public static void main(String[] args) {
		SpringApplication.run(RestBackendApplication.class, args);
		
		checkingLoop(frequency * 1000);		//Llamada a la función que configura el timer
	}
	
	public static void checkingLoop(int frequency) {
		Timer timer = new Timer();
		TimerTask checkAllTask = new TimerTask() {		//Tarea que deberá realizar el timer
			@Override
		    public void run () {
		        //code
				System.out.println();					//Se deja una línea en blanco de separación
				loopBody();								//Se llama al cuerpo del body que hará las comprobaciones
		    }
		};
		timer.schedule(checkAllTask, 0, frequency);
	}
	
	public static void loopBody() {
		for(Long id : PlayersController.players.keySet()) {		//para cada jugador conectado
			Player p = PlayersController.players.get(id);
			System.out.println(p.toString());					//se muestra su información
			if(p.checkInactive()) {								//se comprueba si está inactivo
				p.expelFromRoom();								// si lo está, se le echa de la room en la que estuviera y se borra
				PlayersController.players.remove(id);
				System.out.println("Deleting player " + id + " for inactivity");
			}
		}
		
		for(Long id : RoomsController.rooms.keySet()) {			//para cada sala creada
			Room r = RoomsController.rooms.get(id);
			System.out.println(r.toString());					//se muestran sus datos
			if(r.checkMustDelete()) {							//si debe ser eliminada
				System.out.println("Deleting room " + id);		
				RoomsController.rooms.remove(id);				//se borra
			}
		}
	}
}