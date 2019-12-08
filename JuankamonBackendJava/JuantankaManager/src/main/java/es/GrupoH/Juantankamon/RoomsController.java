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
	
	public static Map<Long, Room> rooms = new ConcurrentHashMap<>(); 
	AtomicLong nextId = new AtomicLong(0);
	
	@GetMapping
	public Collection<Room> rooms() {
		return rooms.values();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Room newRoom(@RequestBody Room newRoom) {

		long id = nextId.incrementAndGet();											//Se incrementa y guarda el identificador
		newRoom.setId(id);															//Se usa el nuevo id para la habitación creada
		rooms.put(id, newRoom);														//Se coloca la nueva habitación en la lista

		Player juan = PlayersController.players.get(newRoom.getJuantankamonId());	//Se usan las claves ajenas a los jugadores para
		Player guard = PlayersController.players.get(newRoom.getGuardId());			//obtener referencias a ellos
		if(juan != null) juan.setRoomId(newRoom.getId());							//Si existen, se asigna el id de la room a su roomId
		if(guard != null) guard.setRoomId(newRoom.getId());							//para tener en ellos una clave ajena a la room
		
		return newRoom;																//Se devuelve la room creada
	}

	@PutMapping("/{id}")
	public ResponseEntity<Room> updateRoom(@PathVariable long id, @RequestBody Room updatedRoom) {

		Room savedRoom = rooms.get(updatedRoom.getId());									//Se guarda una referencia a la room desactualizada
		if (savedRoom != null) {															//Si existe esa room, se puede actualizar
			
			rooms.put(id, updatedRoom);														//Se actualiza la room
			
			Player juan = PlayersController.players.get(updatedRoom.getJuantankamonId());	//Se obtienen referencias a los jugadores
			Player guard = PlayersController.players.get(updatedRoom.getGuardId());
			
			//Se actualizan los room id de los jugadores que estén en la room
			if(juan != null) {
				System.out.println("Assigning Juantankamon " + juan.getId() + " to room "+ savedRoom.getId());
				juan.setRoomId(savedRoom.getId());
			}
			if(guard != null) {
				System.out.println("Assigning Guard " + guard.getId() + " to room "+ savedRoom.getId());
				guard.setRoomId(savedRoom.getId());
			}
			
			return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
		}
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	

	@GetMapping("/{id}")
	public ResponseEntity<Room> getRoom(@PathVariable long id) {

		Room savedRoom = rooms.get(id);		//Se obtiene una referencia a la room con el id especificado para devolverla

		if (savedRoom != null) {
			return new ResponseEntity<>(savedRoom, HttpStatus.OK);
		}
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Room> deleteRoom(@PathVariable long id) {

		Room savedRoom = rooms.get(id);		//Se obtiene una referencia a la room con el id especificado para destruirla

		if (savedRoom != null) {
			rooms.remove(savedRoom.getId());
			return new ResponseEntity<>(savedRoom, HttpStatus.OK);
		}
		
		//En caso de haber jugadores, se les expulsa de la room
		Player juan = PlayersController.players.get(savedRoom.getJuantankamonId());
		Player guard = PlayersController.players.get(savedRoom.getGuardId());
		
		if(juan != null) juan.expelFromRoom();
		if(guard != null) guard.expelFromRoom();
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
}
