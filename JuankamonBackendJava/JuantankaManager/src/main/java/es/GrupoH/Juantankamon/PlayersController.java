package es.GrupoH.Juantankamon;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/players")
public class PlayersController {
	
	public static Map<Long, Player> players = new ConcurrentHashMap<>();
	AtomicLong nextId = new AtomicLong(0);
	
	@GetMapping
	public Collection<Player> players() {
		return players.values();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Player newPlayer(@RequestBody Player newPlayer) {

		long id = nextId.incrementAndGet();							//Se incrementa y guarda el identificador
		newPlayer.setUp(id);										//Se usa el nuevo id para el jugador creado
		players.put(id, newPlayer);									//Se incluye el nuevo jugador en la lista

		return newPlayer;											//Se devuelve el jugador creado
	}

	@PutMapping("/{id}")
	public ResponseEntity<Player> updatePlayer(@PathVariable long id, @RequestBody Player updatedPlayer) {

		Player savedPlayer = players.get(updatedPlayer.getId());
		if (savedPlayer != null) {
			
			updatedPlayer.updateLastInteractionDate();				//Se actualiza la última interacción del jugador
			updatedPlayer.setLogInDate(savedPlayer.getLogInDate());	//Se mantiene la fecha de logIn original
			
			players.put(id, updatedPlayer);							//se actualizan los datos del jugador

			return new ResponseEntity<>(updatedPlayer, HttpStatus.OK);
		}
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	

	@GetMapping("/{id}")
	public ResponseEntity<Player> getPlayer(@PathVariable long id) {

		Player savedPlayer = players.get(id);							//Se obtiene una referencia al jugador especificado en la id

		if (savedPlayer != null) {
			return new ResponseEntity<>(savedPlayer, HttpStatus.OK);	//Si existe se devuelve
		}
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Player> deletePlayer(@PathVariable long id) {

		Player savedPlayer = players.get(id);							//Se obtiene una referencia al jugador especificado en la id
		
		if (savedPlayer != null) {										//si existe
			savedPlayer.expelFromRoom();								//se le expulsa de la room
			players.remove(savedPlayer.getId());
			return new ResponseEntity<>(savedPlayer, HttpStatus.OK);
		}
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
}