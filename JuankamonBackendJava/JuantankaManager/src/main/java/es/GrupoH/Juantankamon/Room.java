package es.GrupoH.Juantankamon;

public class Room {
	
	//la clase guarda el id de la habitación, un boolean para saber si está en pantalla de juego, y claves ajenas a los jugadores
	
	
	private long id;
	private long juantankamonId; 						//Si el índice de uno de los jugadores es 0, significa que no hay un jugador asignado a ellos
	private long guardId;								//y, por tanto, la partida no estaría completa
	private boolean running;

	public Room() {}

	public long getId() { return id; }
	public void setId(long id) { this.id = id; }
	
	public long getJuantankamonId() { return juantankamonId; }
	public long getGuardId() { return guardId; }
	public void setJuantankamonId(long newId) { juantankamonId = newId; }
	public void setGuardId(long newId) { guardId = newId; }
	
	public boolean getRunning() { return running; }
	public void setRunning(boolean newRunning) { running = newRunning; }
	
	public boolean isEmpty() {							//Se considera vacía si no hay ningún jugador
		if(juantankamonId == 0 && guardId == 0) return true;
		return false;
	}
	
	public boolean isFull() {							//se considera completa si están ambos jugadores
		if(juantankamonId != 0 && guardId != 0) return true;
		return false;
	}
	
	public boolean isOpen() {							//se considera abiera si solo hay un jugador dentro
		if(juantankamonId == 0 ^ guardId == 0) return true; //XOR
		return false;
	}
	
	public boolean checkMustDelete() {					//Devuelve si la habitación debe ser eliminada
		if(running) {									//Si se está jugando
			if(isOpen() || isEmpty()) return true;		//y no están ambos jugadores, debe eliminarse
			return false;
		}
		
		if(isEmpty()) return true;						//si no se está jugando, pero está vacía, debe eliminarse
		return false;
	}
	
	@Override
	public String toString() {
		return "Room [id=" + id + ", Juantankamon=" + juantankamonId + ", Guardia=" + guardId + "]";
	}
}
