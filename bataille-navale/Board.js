"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
/* Board.ts */
var Board = /** @class */ (function () {
    function Board() {
        this.grid = [];
        for (var i = 0; i < 8; i += 1) {
            var row = [];
            for (var j = 0; j < 8; j += 1) {
                row.push('.');
            }
            this.grid.push(row);
        }
    }
    // Pour le mode simple (bateau 1x1)
    Board.prototype.placeBoat = function (row, col) {
        if (this.grid[row][col] === '.') {
            this.grid[row][col] = 'B';
            return true;
        }
        return false;
    };
    // Pour le mode normal : place un bateau de longueur donnée en orientation 'H' (horizontal)
    // ou 'V' (vertical)
    Board.prototype.placeShip = function (row, col, length, orientation) {
        if (orientation === 'H') {
            if (col + length > 8)
                return false;
            for (var j = col; j < col + length; j += 1) {
                if (this.grid[row][j] !== '.')
                    return false;
            }
            for (var j = col; j < col + length; j += 1) {
                this.grid[row][j] = 'B';
            }
            return true;
        }
        // orientation 'V'
        if (row + length > 8)
            return false;
        for (var i = row; i < row + length; i += 1) {
            if (this.grid[i][col] !== '.')
                return false;
        }
        for (var i = row; i < row + length; i += 1) {
            this.grid[i][col] = 'B';
        }
        return true;
    };
    // Applique une attaque sur une case donnée
    Board.prototype.attack = function (row, col) {
        if (this.grid[row][col] === 'B') {
            this.grid[row][col] = 'X';
            return true;
        }
        if (this.grid[row][col] === '.') {
            this.grid[row][col] = 'O';
        }
        return false;
    };
    // Retourne true si aucune case ne contient encore un bateau
    Board.prototype.allBoatsSunk = function () {
        for (var _i = 0, _a = this.grid; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var cell = row_1[_b];
                if (cell === 'B')
                    return false;
            }
        }
        return true;
    };
    // Affiche la grille. Si hideBoats est true,
    // les cases contenant des bateaux non touchés sont affichées comme '.'
    Board.prototype.printBoard = function (hideBoats) {
        if (hideBoats === void 0) { hideBoats = false; }
        for (var _i = 0, _a = this.grid; _i < _a.length; _i++) {
            var row = _a[_i];
            var line = '';
            for (var _b = 0, row_2 = row; _b < row_2.length; _b++) {
                var cell = row_2[_b];
                if (hideBoats && cell === 'B') {
                    line += '. ';
                }
                else {
                    line += "".concat(cell, " ");
                }
            }
            console.log(line);
        }
    };
    return Board;
}());
exports.Board = Board;
