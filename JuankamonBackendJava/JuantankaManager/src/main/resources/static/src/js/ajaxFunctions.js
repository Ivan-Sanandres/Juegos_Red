var serverUrl = window.location.href; //Obtenemos la url del servidor al que hacer peticiones

//Los ids de los jugadores empiezan por el 1. Si valen 0 en una room es porque no está conectado ese personaje

/***************************PLAYERS******************************/
//Get players desde el server
function getPlayers(callback, failCallback) {
    $.ajax({
        method: "GET",
        url: serverUrl + 'players'
    }).done(function (players) {
        console.log('Players loaded: ' + JSON.stringify(players));
        callback(players);
    }).fail(function() {
      failCallback();
    })
}

//Get player concreto desde el server
function getPlayer(playerId, callback, failCallback) {
    $.ajax({
        method: "GET",
        url: serverUrl + 'players/' + playerId
    }).done(function (player) {
        console.log('Player loaded: ' + JSON.stringify(player));
        callback(player);
    }).fail(function() {
      failCallback();
    })
}

//Post player al servidor
function createPlayer(player, callback, failCallback) {
    $.ajax({
        method: "POST",
        url: serverUrl + 'players',
        data: JSON.stringify(player),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (player) {
        console.log("Player created: " + JSON.stringify(player));
        callback(player);
    }).fail(function() {
      failCallback();
    })
}

//Update player en el servidor
function updatePlayer(player, callback, failCallback) {
    $.ajax({
        method: 'PUT',
        url: serverUrl + 'players/' + player.id,
        data: JSON.stringify(player),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (player) {
        console.log("Updated player: " + JSON.stringify(player));
        callback(player);
    }).fail(function() {
      failCallback();
    })
}

//Delete player del servidor
function deletePlayer(playerId, callback, failCallback) {
    $.ajax({
        method: 'DELETE',
        url: serverUrl + 'players/' + playerId
    }).done(function (player) {
        console.log("Deleted player " + playerId)
        callback(player);
    }).fail(function() {
      failCallback();
    })
}

/***************************ROOMS*****************************/
//Get rooms desde el server
function getRooms(callback, failCallback) {
    $.ajax({
        method: "GET",
        url: serverUrl + 'rooms'
    }).done(function (rooms) {
        console.log('Rooms loaded: ' + JSON.stringify(rooms));
        callback(rooms);
    }).fail(function() {
      failCallback();
    })
}

//Get room concreta desde el server
function getRoom(roomId, callback, failCallback) {
    $.ajax({
        method: "GET",
        url: serverUrl + 'rooms/' + roomId
    }).done(function (room) {
        console.log('Room loaded: ' + JSON.stringify(room));
        callback(room);
    }).fail(function() {
      failCallback();
    })
}

//Post room al servidor
function createRoom(room, callback, failCallback) {
    $.ajax({
        method: "POST",
        url: serverUrl + 'rooms',
        data: JSON.stringify(room),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (room) {
        console.log("Room created: " + JSON.stringify(room));
        callback(room);
    }).fail(function() {
      failCallback();
    })
}

//Update room en el servidor
function updateRoom(room, callback, failCallback) {
    $.ajax({
        method: 'PUT',
        url: serverUrl + 'rooms/' + room.id,
        data: JSON.stringify(room),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (room) {
        console.log("Updated room: " + JSON.stringify(room));
        callback(room);
    }).fail(function() {
      failCallback();
    })
}

//Delete room del servidor
function deleteRoom(roomId, callback, failCallback) {
    $.ajax({
        method: 'DELETE',
        url: serverUrl + 'rooms/' + roomId
    }).done(function (player) {
        console.log("Deleted room: " + roomId)
    }).fail(function() {
      failCallback();
    })
}
