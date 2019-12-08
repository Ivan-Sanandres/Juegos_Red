package es.GrupoH.Juantankamon;

import java.time.*;
import java.time.temporal.TemporalUnit;

public class Player {
	//STATICS
	public static double maxInactivityTime = 60; //in seconds
	
	//VARIABLES
	private long id;
	private long roomId; //si la partida no se borra pero el jugador ha salido esto no cambia automáticamente, debe hacerlo el cliente
	private String name;
	private LocalDateTime logInDate;
	private LocalDateTime lastInteractionDate;
	
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
	//public void setName(String newName) { name = newName; }
	
	public LocalDateTime getLogInDate () { return logInDate; }
	public void setLogInDate(LocalDateTime newTime) { logInDate = newTime; } //IGUAL ESTO DEBERÍA QUITARLO XD
	
	public LocalDateTime getLastInteractionDate() { return lastInteractionDate; }
	public void updateLastInteractionDate() {lastInteractionDate = LocalDateTime.now(); }
	
	public double getInactiveTime() {
		Duration diff = Duration.between(LocalDateTime.now(), lastInteractionDate);
		double inactiveTime = (double)diff.abs().getSeconds();
		return inactiveTime;
	}
	
	public boolean checkInactive() {
		
		if(getInactiveTime() > maxInactivityTime) return true;
		return false;
	}
	
	public void expelFromRoom() {
		
		Room r = RoomsController.rooms.get(roomId);
		System.out.println("Echando de la habitación" + roomId);
		if(r != null) {
			System.out.println("Habitación encontrada");
			if(r.getJuantankamonId() == id) r.setJuantankamonId(0);
			if(r.getGuardId() == id) r.setGuardId(0);
		}
		roomId = 0;
	}

	@Override
	public String toString() {
		return "Player [id= " + id + ", name= " + name + ", roomId: " + roomId +", Inactive time:" + getInactiveTime() + "]";
	}
}