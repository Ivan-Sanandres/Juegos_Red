package es.GrupoH.Juantankamon;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class WebsocketHandler extends TextWebSocketHandler {
	public static ObjectMapper mapper = new ObjectMapper();
	public static Map<Long, WebSocketSession> sessions = new ConcurrentHashMap<>();
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		//La funcionalidad que debe realizarse es que cuando un jugador mande su posición y dirección, esta sea reenviada al otro jugador que esté en la sala con él
		//message debe ser un objeto JSON que incluya:
		/* posX,
		 * posY,
		 * dirX,
		 * dirY,
		 * P1(id del jugador que envia),
		 * P2 (id del jugador al que se pretende mandar la información)
		 * gameState (false = sigue funcionando, true = el oponente ha ganado)
		*/
		String msg = message.getPayload();
		System.out.println("Message received: " + msg);
		
		//Se obtienen los ids de los jugadores
		JsonNode node = mapper.readTree(message.getPayload());
		Long P1 = node.get("P1").asLong();
		Long P2 = node.get("P2").asLong();
		
		//Se comprueba si hay que añadir la sesión al mapa de sesiones
		WebSocketSession srcSession = sessions.get(P1);
		if(srcSession == null) sessions.put(P1, session);
		
		//Si existe la sesión de destino, se le envía el mensaje
		WebSocketSession dstSession = sessions.get(P2);
		if(dstSession != null) dstSession.sendMessage(new TextMessage(msg));
	}
}