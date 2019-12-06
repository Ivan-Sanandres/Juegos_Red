var serverUrl = window.location.href;

//Get players desde el server
function getPlayers(callback) {
    $.ajax({
        method: "GET",
        url: serverUrl + 'players'
    }).done(function (players) {
        console.log('Players loaded: ' + JSON.stringify(players));
        //callback(players);
    })
}

//Post player al servidor
function createPlayer(player, callback) {
    $.ajax({
        method: "POST",
        url: serverUrl + 'players',
        data: JSON.stringify(item),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (player) {
        console.log("Player created: " + JSON.stringify(item));
        //callback(player);
    })
}

//Update player en el servidor
function updateItem(player, callback) {
    $.ajax({
        method: 'PUT',
        url: serverUrl + 'players/' + player.id,
        data: JSON.stringify(item),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (player) {
        console.log("Updated player: " + JSON.stringify(player))
        //callback(player);
    })
}

//Delete player del servidor
function deletePlayer(player, callback) {
    $.ajax({
        method: 'DELETE',
        url: serverUrl + 'players/' + player.id
    }).done(function (player) {
        console.log("Deleted player " + player.id)
        //callback(player);
    })
}

/*//Get rooms desde el server
function getRooms(callback) {
    $.ajax({
        methos: "GET",
        url: 'http://localhost:8080/players'
    }).done(function (players) {
        console.log('Players loaded: ' + JSON.stringify(players));
        //callback(players);
    })
}*/
