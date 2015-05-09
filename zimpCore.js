// Global vars //{{{
// Room Constructor//{{{
var Room = function(name, exits) {
	// Properties //{{{
	this.exists = true;
	this.name = name;
	this.doors = [false, false, false, false];
	this.locked = false;
	// Door Init//{{{
	for (var i = 0; i < exits.length; i++) {
		switch (exits[i]) {
			case 'N':
				this.doors[0] = true;
				break;
			case 'E':
				this.doors[1] = true;
				break;
			case 'S':
				this.doors[2] = true;
				break;
			case 'W':
				this.doors[3] = true;
				break;
		}
	}//}}}
	if (this.name === 'Dining Room') {
		this.doors[0] = 'special';
	}//}}}
	// Rotate Function//{{{
	this.rotate = function(rot) {
		var temp = false;
		for (var i = 0; i < rot; ++i) {
			temp = this.doors.pop();
			this.doors.unshift(temp);
		}
	};//}}}
};//}}}
// Init Piles//{{{
// Inside Pile//{{{
var insidePile = [new Room('Bathroom', 'N'),
                    new Room('Kitchen', 'NEW'),
                    new Room('Storage', 'N'),
                    new Room('Evil Temple', 'EW'),
                    new Room('Family Room', 'NES'),
                    new Room('Dining Room', 'NESW'),
                    new Room('Bedroom', 'NW')];//}}}
// Outside Pile//{{{
var outsidePile = [new Room('Garden', 'ESW'),
                    new Room('Sitting Area', 'ESW'),
                    new Room('Yard1', 'ESW'),
                    new Room('Graveyard', 'ES'),
                    new Room('Garage', 'SW'),
                    new Room('Yard2', 'ESW'),
                    new Room('Yard3', 'ESW')];//}}}//}}}
// Shuffle Function//{{{
var shuffle = function(pile) {
    var i = pile.length,
        temp, randi;
    while (0 !== i) {
        randi = Math.floor(Math.random() * i--);
        temp = pile[i];
        pile[i] = pile[randi];
        pile[randi] = temp;
    }
};//}}}
// Player Object//{{{
var player = {
    x: 0,
    y: 0
};//}}}
// Make a 23x13 grid of empty rooms//{{{
var grid = [];
for (var i = 0; i < 23; i++) {
	grid[i] = [];
	grid[i][12] = undefined;
}//}}}
// The Map //{{{
var map = {
    /* Grid consits of an array in an array, the first being rows (player's y-position)
        and the second is columns (player's x-position) */
    grid: 
        [new Room("Foyer", "N")]
    ],
    move: function(dir, p) {
        var pile = [insidePile, outsidePile];
        switch (dir) {

            // Moving Up//{{{
            case "doors3":
                if (player.y === 0) {
                    for (var i = 0; i < this.grid.length; i++) {
                        this.grid[i].unshift(undefined);
                    }
                    this.grid[player.x][0] = pile[p].pop();
                } else {
                    try {
                        this.grid[player.x][--player.y].exists; // decrements y-pos during here, so no need to do it wherever else
                    } catch (e) {
                        this.grid[player.x][player.y] = pile[p].pop();
                    }
                }
                break;//}}}

                // Moving Right //{{{
            case "doors2":
                if ((player.x + 1) <= (this.grid.length - 1)) {
                    try {
                        this.grid[++player.x][player.y].exists; // same as below
                    } catch (e) {
                        this.grid[player.x][player.y] = pile[p].pop();
                    }
                } else {
                    this.grid.push([]);
                    this.grid[++player.x][player.y] = pile[p].pop(); // And again
                }
                break;//}}}

                // Moving Down //{{{
            case "doors1":
                try {
                    this.grid[player.x][++player.y].exists; // same as above
                } catch (e) {
                    this.grid[player.x].push(pile[p].pop());
                }
                break;//}}}

                // Moving Left //{{{
            case "doors0":
                if (player.x === 0) {
                    this.grid.unshift([]);
                    this.grid[0][player.y] = pile[p].pop();
                } else {
                    try {
                        this.grid[--player.x][player.y].exists; // decrements x-pos during here, so no need to do it wherever else
                    } catch (e) {
                        this.grid[player.x][player.y] = pile[p].pop();
                    }
                }
                break;//}}}

        }
    }
};//}}}//}}}

// Run the game!//{{{
$(document).ready(function() {
    for (var i = 1; i < 4; i++) { // Hide the exits the foyer can't have
        $('#doors' + i).hide();
    }
    shuffle(insidePile);
    shuffle(outsidePile);
    outsidePile.push(new Room('Patio', 'NES'));
    $('#rotateButton').hide();
    $('#lockButton').hide();
    map.grid[player.x][player.y].locked = true;
    var side = 0;
    var lastDir = 0;

    $('#curRoom').text(map.grid[player.x][player.y].name);
    $(".exits").click(function() {
        if (map.grid[player.x][player.y].locked) {
            if ((map.grid[player.x][player.y].name === 'Dining Room') && map.grid[player.x][player.y].doors[$(this).attr('id')[5]] === "special") {
                side = 1;
            }
            map.move($(this).attr('id'), side);
            console.info('DEBUG: lastDir = ' + $(this).attr('id')[5]);
            lastDir = Number($(this).attr('id')[5]);
            var curRoom = map.grid[player.x][player.y];
            $('#curRoom').text(curRoom.name);
            for (var i = 0; i < 4; i++) {
                if (curRoom.doors[i] === 'special') {
                    $('#doors' + i).show();
                    $('#doors' + i).css('color', 'red');
                } else if (curRoom.doors[i]) {
                    $('#doors' + i).show();
                    $('#doors' + i).css('color', 'black');
                } else {
                    $('#doors' + i).hide();
                }
            }
            if (!curRoom.locked) {
                $('#lockButton').show();
                $('#rotateButton').show();
            }
        }

        $('#map').empty();
        for (var j = map.grid.length; j > 0; j--) {
            $('#map').prepend("<tr id='col" + j + "'></tr>");
            for (var k = map.grid[j - 1].length; k > 0; k--) {
                if (map.grid[j - 1][k - 1] !== undefined) {
                    var tableRoom = $('<td>' + map.grid[j - 1][k - 1].name + '</td>');
                    $('#col' + j).prepend(tableRoom);
                    if (map.grid[j - 1][k - 1].name === map.grid[player.x][player.y].name) {
                        tableRoom.css('background-color', 'green');
                    }
                } else {
                    $('#col' + j).prepend('<td class="emptyRoom"></td>');
                }
            }
        }

    });
    $("#rotateButton").click(function() {
        var curRoom = map.grid[player.x][player.y];
        curRoom.rotate(1);
        $('#curRoom').text(curRoom.name);
        for (var i = 0; i < 4; i++) {
            if (curRoom.doors[i] === 'special') {
                $('#doors' + i).show();
                $('#doors' + i).css('color', 'red');
            } else if (curRoom.doors[i]) {
                $('#doors' + i).show();
                $('#doors' + i).css('color', 'black');
            } else {
                $('#doors' + i).hide();
            }
        }
    });
    $("#lockButton").click(function() {
        console.log("DEBUG: lastDir =",lastDir, "Mod:", (lastDir + 2) % 4);
        if (map.grid[player.x][player.y].doors[(lastDir + 2) % 4]) { // Check if there is a door in the direction they just came from
            map.grid[player.x][player.y].locked = true;
            $("#rotateButton").hide();
            $("#lockButton").hide();
            $('#log').text('');
        } else {
            $('#log').text('Illegal Rotation');
        }
    });
});//}}}
