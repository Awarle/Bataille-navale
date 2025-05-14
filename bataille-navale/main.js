"use strict";
/// <reference types="node" />
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var fs = require("fs");
var Board_1 = require("./Board");
// Définition de la classe Player pour éviter les importations circulaires
var Player = /** @class */ (function () {
    function Player() {
        this.board = new Board_1.Board();
    }
    return Player;
}());
// Fonction utilitaire : génération de nombres aléatoires
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var args = process.argv.slice(2);
var config = { mode: '' };
if (args.includes('--mode')) {
    var idx = args.indexOf('--mode');
    config.mode = args[idx + 1];
}
else {
    console.error("Missing '--mode' argument.");
    process.exit(1);
}
if (config.mode === 'simple') {
    if (args.includes('--number')) {
        var idx = args.indexOf('--number');
        var num = parseInt(args[idx + 1], 10);
        if (Number.isNaN(num) || num < 1 || num > 64) {
            console.error("'--number' must be an integer between 1 and 64.");
            process.exit(1);
        }
        config.numberOfBoats = num;
    }
    else {
        console.error("Missing '--number' argument in simple mode.");
        process.exit(1);
    }
}
else if (config.mode === 'normal') {
    if (args.includes('--data')) {
        var idx = args.indexOf('--data');
        config.dataFile = args[idx + 1];
        if (!fs.existsSync(config.dataFile)) {
            console.error("Data file ".concat(config.dataFile, " not found."));
            process.exit(1);
        }
    }
    else {
        console.error("Missing '--data' argument in normal mode.");
        process.exit(1);
    }
}
else {
    console.error("Invalid mode. Use 'simple' or 'normal'.");
    process.exit(1);
}
// Création des joueurs
var player1 = new Player();
var player2 = new Player();
// Déclaration des fonctions de placement en dehors des blocs conditionnels
var placeBoatsSimple = function (player, nb) {
    var placed = 0;
    while (placed < nb) {
        var row = getRandomNumber(0, 7);
        var col = getRandomNumber(0, 7);
        if (player.board.placeBoat(row, col)) {
            placed += 1;
        }
    }
};
var placeShipsNormal = function (player, ships) {
    for (var _i = 0, ships_1 = ships; _i < ships_1.length; _i++) {
        var ship = ships_1[_i];
        for (var i = 0; i < ship.quantity; i += 1) {
            var placed = false;
            var attempts = 0;
            while (!placed && attempts < 100) {
                var orientation_1 = Math.random() < 0.5 ? 'H' : 'V';
                var row = void 0;
                var col = void 0;
                if (orientation_1 === 'H') {
                    row = getRandomNumber(0, 7);
                    col = getRandomNumber(0, 8 - ship.length);
                }
                else {
                    row = getRandomNumber(0, 8 - ship.length);
                    col = getRandomNumber(0, 7);
                }
                placed = player.board.placeShip(row, col, ship.length, orientation_1);
                attempts += 1;
            }
            if (!placed) {
                console.error("Could not place ship: ".concat(ship.name));
            }
        }
    }
};
// Placement des bateaux selon le mode
if (config.mode === 'simple') {
    placeBoatsSimple(player1, config.numberOfBoats);
    placeBoatsSimple(player2, config.numberOfBoats);
}
else if (config.mode === 'normal') {
    try {
        var rawData = fs.readFileSync(config.dataFile, 'utf8');
        var data = JSON.parse(rawData);
        var shipsData = data.ships; // tableau des définitions de bateaux
        placeShipsNormal(player1, shipsData);
        placeShipsNormal(player2, shipsData);
    }
    catch (error) {
        console.error('Error reading or processing data file:', error.message);
        process.exit(1);
    }
}
// Interface utilisateur et boucle de jeu (attaques)
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
var currentPlayer = 1;
function askPosition(callback) {
    rl.question('Enter attack position (e.g., A5): ', function (input) {
        input = input.trim().toUpperCase();
        if (input.length < 2
            || !/[A-H]/.test(input.charAt(0))
            || !/[1-8]/.test(input.charAt(1))) {
            console.log('Invalid format. Use, for instance, A5.');
            askPosition(callback);
        }
        else {
            var col = input.charCodeAt(0) - 'A'.charCodeAt(0);
            var row = parseInt(input.charAt(1), 10) - 1;
            callback(row, col);
        }
    });
}
function takeTurn() {
    console.log("\n== Player ".concat(currentPlayer, "'s Turn =="));
    if (currentPlayer === 1) {
        console.log('Player 2 Board:');
        player2.board.printBoard(true);
    }
    else {
        console.log('Player 1 Board:');
        player1.board.printBoard(true);
    }
    askPosition(function (row, col) {
        var defender = currentPlayer === 1 ? player2 : player1;
        var hit = defender.board.attack(row, col);
        var posStr = "".concat(String.fromCharCode(col + 65)).concat(row + 1);
        console.log("Player ".concat(currentPlayer, " attacks ").concat(posStr, ": ").concat(hit ? 'Hit!' : 'Miss!'));
        if (defender.board.allBoatsSunk()) {
            console.log("Player ".concat(currentPlayer, " wins! All enemy ships have been sunk."));
            rl.close();
            return;
        }
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        takeTurn();
    });
}
// Démarre la boucle de jeu
takeTurn();
