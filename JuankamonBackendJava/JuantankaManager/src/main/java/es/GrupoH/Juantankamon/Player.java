package es.GrupoH.Juantankamon;

import java.time.*;
import java.time.temporal.TemporalUnit;

import org.springframework.web.socket.WebSocketSession;

public class Player {
	//STATICS
	public static double maxInactivityTime = 60; //máximo tiempo de inactividad permitido
	
	//VARIABLES
	private long id;
	private long roomId;						//clave ajena a la room en la que está el jugador
	private String name;
	private LocalDateTime logInDate;
	private LocalDateTime lastInteractionDate;	//última vez que el usuario actualizó sus datos
	
	//CONSTRUCTORS
	public Player() {}
	
	//METHODS
	public void setUp(long id) {
		this.setId(id);
		logInDate = LocalDateTime.now();
		lastInteractionDate = logInDate;
	}
	
	public long getId() { return id; }
	public void setId(long newId) { id = newId; }
	
	public long getRoomId() { return roomId; }
	public void setRoomId(long newRoomId) { roomId = newRoomId; }
	
	public String getName() { return this.name; }
	public void setName(String newName) { name = newName; }
	
	public LocalDateTime getLogInDate () { return logInDate; }
	public void setLogInDate(LocalDateTime newTime) { logInDate = newTime; }
	
	public LocalDateTime getLastInteractionDate() { return lastInteractionDate; }
	public void updateLastInteractionDate() {lastInteractionDate = LocalDateTime.now(); }
	
	public double getInactiveTime() {
		//se devuelve la diferencia en segundos entre el momento actual y la última vez que el jugador interactuó con el servidor
		Duration diff = Duration.between(LocalDateTime.now(), lastInteractionDate);
		double inactiveTime = (double)diff.abs().getSeconds();
		return inactiveTime;
	}
	
	public boolean checkInactive() {
		//Si lleva más tiempo inactivo del máximo especificado, se considera inactivo
		if(getInactiveTime() > maxInactivityTime) return true;
		return false;
	}
	
	public void expelFromRoom() {
		
		Room r = RoomsController.rooms.get(roomId); //Se obtiene una referencia por clave ajena a la room en la que se encuentra el jugador
		System.out.println("Expelling player "+id + " from room " + roomId);
		if(r != null) {														//si la room existe, pone el id del jugador en la room a 0
			if(r.getJuantankamonId() == id) r.setJuantankamonId(0);			//dependiendo del rol que tenga en la room
			if(r.getGuardId() == id) r.setGuardId(0);
		}
		roomId = 0;
		
		//Además se elimina la sesión de websocket del mapa de sesiones
		WebSocketSession session = WebsocketEchoHandler.sessions.get(id);
		if(session != null) WebsocketEchoHandler.sessions.remove(id);
	}

	@Override
	public String toString() {
		return "Player [id= " + id + ", name= " + name + ", roomId: " + roomId +", Inactive time:" + getInactiveTime() + "]";
	}
}