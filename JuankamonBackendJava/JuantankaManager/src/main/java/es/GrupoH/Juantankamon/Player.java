package es.GrupoH.Juantankamon;

import java.time.*;
import java.time.temporal.TemporalUnit;

public class Player {
	//STATICS
	public static double maxInactivityTime = 60; //in seconds
	
	//VARIABLES
	private long id;
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

	public String getName() { return this.name; }
	//public void setName(String newName) { name = newName; }
	
	public LocalDateTime getLogInDate () { return logInDate; }
	public void setLogInDate(LocalDateTime newTime) { logInDate = newTime; }
	
	public LocalDateTime getLastInteractionDate() { return lastInteractionDate; }
	public void updateLastInteractionDate() {lastInteractionDate = LocalDateTime.now(); }
	
	//POR ALGÚN MOTIVO PILLA INACTIVE COMO PARÁMETRO
	public boolean isInactive() {
		Duration diff = Duration.between(LocalDateTime.now(), lastInteractionDate);
		double inactiveTime = (double)diff.abs().getSeconds();
		if(inactiveTime > maxInactivityTime) return true;
		return false;
	}

	@Override
	public String toString() {
		return "Player [id=" + id + ", name=" + name + ", Log in date" + logInDate.toString() + "]";
	}
}