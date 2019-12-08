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
@RequestMapping("/rooms")
public class RoomsController {
	/*
	 * hay que hacer que si un jugador está inactivo mucho tiempo lo elimine, y no solo eso, sino que si está en una partida, 
	 * su id en la partida se ponga a 0. Además hay que comprobar si las partidas tienen ambos id de jugadores a 0, en tal
	 * caso ambos jugadores han abandonado la partida por el motivo que sea y por tanto debe ser eliminada.
	 * HAY QUE VER COMO GESTIONAR TODO ESTO EN BUCLE DESDE EL SERVIDOR
	 * 
	 */
	
	public static Map<Long, Room> rooms = new ConcurrentHashMap<>(); 
	AtomicLong nextId = new AtomicLong(0);
	
	@GetMapping
	public Collection<Room> rooms() {
		return rooms.values();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Room newRoom(@RequestBody Room newRoom) {

		long id = nextId.incrementAndGet();
		newRoom.setId(id);
		rooms.put(id, newRoom);

		Player juan = PlayersController.players.get(newRoom.getJuantankamonId());
		Player guard = PlayersController.players.get(newRoom.getGuardId());
		if(juan != null) juan.setRoomId(newRoom.getId());
		if(guard != null) guard.setRoomId(newRoom.getId());
		
		return newRoom;
	}

	@PutMapping("/{id}")
	public ResponseEntity<Room> updateRoom(@PathVariable long id, @RequestBody Room updatedRoom) {

		Room savedRoom = rooms.get(updatedRoom.getId());
		if (savedRoom != null) {
			
			rooms.put(id, updatedRoom);
			
			Player juan = PlayersController.players.get(updatedRoom.getJuantankamonId());
			Player guard = PlayersController.players.get(updatedRoom.getGuardId());
			if(juan != null) {
				System.out.println("Poniendo room id al guardia " + juan.getId() + " en la room: "+ savedRoom.getId());
				juan.setRoomId(savedRoom.getId());
			}
			if(guard != null) {
				System.out.println("Poniendo room id al guardia " + guard.getId() + " en la room: "+ savedRoom.getId());
				guard.setRoomId(savedRoom.getId());
			}
			
			return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
		}
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	

	@GetMapping("/{id}")
	public ResponseEntity<Room> getRoom(@PathVariable long id) {

		Room savedRoom = rooms.get(id);

		if (savedRoom != null) {
			return new ResponseEntity<>(savedRoom, HttpStatus.OK);
		}
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Room> deleteRoom(@PathVariable long id) {

		Room savedRoom = rooms.get(id);

		if (savedRoom != null) {
			rooms.remove(savedRoom.getId());
			return new ResponseEntity<>(savedRoom, HttpStatus.OK);
		}
		
		Player juan = PlayersController.players.get(savedRoom.getJuantankamonId());
		Player guard = PlayersController.players.get(savedRoom.getGuardId());
		
		if(juan != null) juan.expelFromRoom();
		if(guard != null) guard.expelFromRoom();
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
}
