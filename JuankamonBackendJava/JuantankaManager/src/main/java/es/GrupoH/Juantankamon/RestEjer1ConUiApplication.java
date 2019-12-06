package es.GrupoH.Juantankamon;

import java.util.Timer;
import java.util.TimerTask;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RestEjer1ConUiApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestEjer1ConUiApplication.class, args);
		int frequency = 3; //cada x segundos se ejecuta checkingLoop
		checkingLoop(frequency * 1000);
	}
	
	public static void checkingLoop(int frequency) {
		Timer timer = new Timer();
		TimerTask checkAllTask = new TimerTask() {
			@Override
		    public void run () {
		        //code
				//System.out.println("looping");
				loopBody();
		    }
		};
		timer.schedule(checkAllTask, 0, frequency);
	}
	
	public static void loopBody() {
		for(Long id : PlayersController.players.keySet()) {
			Player p = PlayersController.players.get(id);
			System.out.println(p.toString());
			if(p.checkInactive()) {
				p.expelFromRoom();
				PlayersController.players.remove(id);
				System.out.println("Deleting player " + id + " for inactivity");
			}
		}
		
		for(Long id : RoomsController.rooms.keySet()) {
			Room r = RoomsController.rooms.get(id);
			if(r.checkMustDelete()) {
				System.out.println("La partida " + id + " será eliminada");
				RoomsController.rooms.remove(id);
			}
		}
	}
}