var $ = jQuery.noConflict();

$(document).ready(function(){

    // Make a 23x13 grid of empty rooms
    var grid = [];
    for (var i = 0; i < 23; i++) {
        grid[i] = [];
        grid[i][12] = undefined;
    }

});
