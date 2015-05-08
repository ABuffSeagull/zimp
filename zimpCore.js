/* Global vars */
var Room = function(name, exits) {
    this.exists = true;
    this.name = name;
    this.doors = [false, false, false, false];
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
    };
    this.rotate = function(rot) {
        var temp = false;
        for (var i = 0; i < rot; ++i) {
            temp = this.doors.pop();
            this.doors.unshift(temp);
        }
    };
};

var insidePile = [new Room('Bathroom', 'N'), new Room('Kitchen', 'NEW'), new Room('Storage', 'N'), new Room('Evil Temple', 'EW'), new Room('Family Room', 'NES'), new Room('Dining Room', 'NESW'), new Room('Bedroom', 'NW')];
// var outsidePile = ['Garden', 'Sitting Area', 'Yard1', 'Graveyard', 'Garage', 'Yard2', 'Yard3'];

var shuffle = function(pile) {
    var i = pile.length,
        temp, randi;
    while (0 !== i) {
        randi = Math.floor(Math.random() * i--);
        temp = pile[i];
        pile[i] = pile[randi];
        pile[randi] = temp;
    }
};

var player = {
    x: 0,
    y: 0
};

var map = {
    /* Grid consits of an array in an array, the first being columns (player's x-position)
        and the second is rows (player's y-position) */
    grid: [
        [new Room("Foyer", "N")]
    ],
    move: function(dir) {
        switch (dir) {

            /* Moving Right */
            case "doors1":
                if ((player.x + 1) <= (this.grid.length - 1)) {
                    try {
                        this.grid[++player.x][player.y].exists; // same as below
                    } catch (e) {
                        this.grid[player.x][player.y] = insidePile.pop();
                    }
                } else {
                    this.grid.push([]);
                    this.grid[++player.x][player.y] = insidePile.pop(); // And again
                }
                break;

                /* Moving Left */
            case "doors3":
                if (player.x === 0) {
                    this.grid.unshift([]);
                    this.grid[0][player.y] = insidePile.pop();
                } else {
                    try {
                        this.grid[--player.x][player.y].exists; // decrements x-pos during here, so no need to do it wherever else
                    } catch (e) {
                        this.grid[player.x][player.y] = insidePile.pop();
                    }
                }
                break;

                /* Moving Up */
            case "doors0":
                if (player.y === 0) {
                    for (var i = 0; i < this.grid.length; i++) {
                        this.grid[i].unshift(undefined);
                    }
                    this.grid[player.x][0] = insidePile.pop();
                } else {
                    try {
                        this.grid[player.x][--player.y].exists; // decrements y-pos during here, so no need to do it wherever else
                    } catch (e) {
                        this.grid[player.x][player.y] = insidePile.pop();
                    }
                }
                break;

                /* Moving Down */
            case "doors2":
                try {
                    this.grid[player.x][++player.y].exists; // same as above
                } catch (e) {
                    this.grid[player.x].push(insidePile.pop());
                }
                break;
        }
    }
};
var $ = jQuery.noConflict();

/* Run the game! */
$(document).ready(function() {
    for (var i = 1; i < 4; i++) { // Hide the exits the foyer can't have
        $('#doors'+i).hide();
    }
    shuffle(insidePile);

    $('#curRoom').text(map.grid[player.x][player.y].name);
    $(".exits").click(function() {
        map.move($(this).attr('id'));
        var curRoom = map.grid[player.x][player.y];
        $('#curRoom').text(curRoom.name);
        for (var i = 0; i < 4; i++) {
            if (curRoom.doors[i]) {
                $('#doors'+i).show();
            } else {
                $('#doors'+i).hide();
            }
        }

        $('#map').empty();
        for (var j = map.grid.length; j > 0; j--) {
            $('#map').prepend("<tr id='col"+j+"'></tr>");
            for (var k = map.grid[j-1].length; k > 0; k--) {
                if (map.grid[j-1][k-1] !== undefined) {
                    $('#col'+j).prepend('<td>'+map.grid[j-1][k-1].name+'</td>');
                }
            }
        }

    });
    $("#rotateButton").click(function() {
        var curRoom = map.grid[player.x][player.y];
        curRoom.rotate(1);
        $('#curRoom').text(curRoom.name);
        for (var i = 0; i < 4; i++) {
            if (curRoom.doors[i]) {
                $('#doors'+i).show();
            } else {
                $('#doors'+i).hide();
            }
        }
    });
});
