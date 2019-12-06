var serverUrl = window.location.href; //Obtenemos la url del servidor al que hacer peticiones

//Los ids de los jugadores empiezan por el 1. Si valen 0 en una room es porque no está conectado ese personaje

/***************************PLAYERS******************************/
//Get players desde el server
function AJAX_getPlayers(callback = function(){}, failCallback = function(){}) {
    $.ajax({
        method: "GET",
        url: serverUrl + 'players'
    }).done(function (players) {
        console.log('Players loaded: ' + JSON.stringify(players));
        callback(players);
    }).fail(function() {
        console.log('Players loaded FAIL: ' + JSON.stringify(players));
        failCallback();
    })
}

//Get player concreto desde el server
function AJAX_getPlayer(playerId, callback = function(){}, failCallback = function(){}) {
    $.ajax({
        method: "GET",
        url: serverUrl + 'players/' + playerId
    }).done(function (player) {
        console.log('Player loaded: ' + JSON.stringify(player));
        callback(player);
    }).fail(function() {
        console.log('Player loaded FAIL: ' + JSON.stringify(player));
        failCallback();
    })
}

//Post player al servidor
function AJAX_createPlayer(player, callback = function(){}, failCallback = function(){}) {
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
        console.log("Player created FAIL: " + JSON.stringify(player));
        failCallback();
    })
}

//Update player en el servidor
function AJAX_updatePlayer(player, callback = function(){}, failCallback = function(){}) {
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
        console.log("Updated player FAIL: " + JSON.stringify(player));
        failCallback();
    })
}

//Delete player del servidor
function AJAX_deletePlayer(playerId, callback = function(){}, failCallback = function(){}) {
    $.ajax({
        method: 'DELETE',
        url: serverUrl + 'players/' + playerId
    }).done(function (player) {
        console.log("Deleted player: " + playerId)
        callback(player);
    }).fail(function() {
      console.log("Deleted player FAIL: " + playerId)
      failCallback();
    })
}

/***************************ROOMS*****************************/
//Get rooms desde el server
function AJAX_getRooms(callback = function(){}, failCallback = function(){}) {
    $.ajax({
        method: "GET",
        url: serverUrl + 'rooms'
    }).done(function (rooms) {
        console.log('Rooms loaded: ' + JSON.stringify(rooms));
        callback(rooms);
    }).fail(function() {
        console.log('Rooms loaded FAIL: ' + JSON.stringify(rooms));
        failCallback();
    })
}

//Get room concreta desde el server
function AJAX_getRoom(roomId, callback = function(){}, failCallback = function(){}) {
    $.ajax({
        method: "GET",
        url: serverUrl + 'rooms/' + roomId
    }).done(function (room) {
        console.log('Room loaded: ' + JSON.stringify(room));
        callback(room);
    }).fail(function() {
        console.log('Rooms loaded FAIL: ' + JSON.stringify(rooms));
        failCallback();
    })
}

//Post room al servidor
function AJAX_createRoom(room, callback = function(){}, failCallback = function(){}) {
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
        console.log("Room created FAIL: " + JSON.stringify(room));
        failCallback();
    })
}

//Update room en el servidor
function AJAX_updateRoom(room, callback = function(){}, failCallback = function(){}) {
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
        console.log("Updated room FAIL: " + JSON.stringify(room));
        failCallback();
    })
}

//Delete room del servidor
function AJAX_deleteRoom(roomId, callback = function(){}, failCallback = function(){}) {
    $.ajax({
        method: 'DELETE',
        url: serverUrl + 'rooms/' + roomId
    }).done(function (player) {
        console.log("Deleted room: " + roomId)
    }).fail(function() {
        console.log("Deleted room FAIL: " + roomId)
        failCallback();
    })
}
