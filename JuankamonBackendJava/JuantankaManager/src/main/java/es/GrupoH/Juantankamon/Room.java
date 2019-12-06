package es.GrupoH.Juantankamon;

public class Room {
	private long id;
	private long juantankamonId; 	//Si el índice de uno de los jugadores es 0, significa que no hay un jugador asignado a ellos
	private long guardId;			//y, por tanto, la partida no estaría completa
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
	
	public boolean isEmpty() {
		if(juantankamonId == 0 && guardId == 0) return true;
		return false;
	}
	
	public boolean isFull() {
		if(juantankamonId != 0 && guardId != 0) return true;
		return false;
	}
	
	public boolean isOpen() {
		if(juantankamonId == 0 ^ guardId == 0) return true; //XOR
		return false;
	}
	
	public boolean checkMustDelete() {
		if(running) {
			if(isOpen() || isEmpty()) return true;
			return false;
		}
		
		if(isEmpty()) return true;
		return false;
	}
	
	@Override
	public String toString() {
		return "Item [id=" + id + ", Juantankamon=" + juantankamonId + ", Guardia=" + guardId + "]";
	}
}
