/// <reference types="node" />

import * as readline from 'readline';
import * as fs from 'fs';
import { Board } from './Board';

// Définition de la classe Player pour éviter les importations circulaires
class Player {
  board: Board;

  constructor() {
    this.board = new Board();
  }
}

// Fonction utilitaire : génération de nombres aléatoires
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Interface de configuration du jeu et lecture des arguments
interface GameConfig {
  mode: string;
  numberOfBoats?: number;
  dataFile?: string;
}

const args = process.argv.slice(2);
const config: GameConfig = { mode: '' };

if (args.includes('--mode')) {
  const idx = args.indexOf('--mode');
  config.mode = args[idx + 1];
} else {
  console.error("Missing '--mode' argument.");
  process.exit(1);
}

if (config.mode === 'simple') {
  if (args.includes('--number')) {
    const idx = args.indexOf('--number');
    const num = parseInt(args[idx + 1], 10);
    if (Number.isNaN(num) || num < 1 || num > 64) {
      console.error("'--number' must be an integer between 1 and 64.");
      process.exit(1);
    }
    config.numberOfBoats = num;
  } else {
    console.error("Missing '--number' argument in simple mode.");
    process.exit(1);
  }
} else if (config.mode === 'normal') {
  if (args.includes('--data')) {
    const idx = args.indexOf('--data');
    config.dataFile = args[idx + 1];
    if (!fs.existsSync(config.dataFile)) {
      console.error(`Data file ${config.dataFile} not found.`);
      process.exit(1);
    }
  } else {
    console.error("Missing '--data' argument in normal mode.");
    process.exit(1);
  }
} else {
  console.error("Invalid mode. Use 'simple' or 'normal'.");
  process.exit(1);
}

// Création des joueurs
const player1 = new Player();
const player2 = new Player();

// Déclaration des fonctions de placement en dehors des blocs conditionnels
const placeBoatsSimple = (player: Player, nb: number): void => {
  let placed = 0;
  while (placed < nb) {
    const row = getRandomNumber(0, 7);
    const col = getRandomNumber(0, 7);
    if (player.board.placeBoat(row, col)) {
      placed += 1;
    }
  }
};

const placeShipsNormal = (player: Player, ships: any[]): void => {
  for (const ship of ships) {
    for (let i = 0; i < ship.quantity; i += 1) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const orientation: 'H' | 'V' = Math.random() < 0.5 ? 'H' : 'V';
        let row: number;
        let col: number;
        if (orientation === 'H') {
          row = getRandomNumber(0, 7);
          col = getRandomNumber(0, 8 - ship.length);
        } else {
          row = getRandomNumber(0, 8 - ship.length);
          col = getRandomNumber(0, 7);
        }
        placed = player.board.placeShip(row, col, ship.length, orientation);
        attempts += 1;
      }
      if (!placed) {
        console.error(`Could not place ship: ${ship.name}`);
      }
    }
  }
};

// Placement des bateaux selon le mode
if (config.mode === 'simple') {
  placeBoatsSimple(player1, config.numberOfBoats!);
  placeBoatsSimple(player2, config.numberOfBoats!);
} else if (config.mode === 'normal') {
  try {
    const rawData = fs.readFileSync(config.dataFile!, 'utf8');
    const data = JSON.parse(rawData);
    const shipsData = data.ships; // tableau des définitions de bateaux
    placeShipsNormal(player1, shipsData);
    placeShipsNormal(player2, shipsData);
  } catch (error: any) {
    console.error('Error reading or processing data file:', error.message);
    process.exit(1);
  }
}

// Interface utilisateur et boucle de jeu (attaques)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let currentPlayer = 1;

function askPosition(callback: (row: number, col: number) => void): void {
  rl.question('Enter attack position (e.g., A5): ', (input: string) => {
    input = input.trim().toUpperCase();
    if (input.length < 2
        || !/[A-H]/.test(input.charAt(0))
        || !/[1-8]/.test(input.charAt(1))) {
      console.log('Invalid format. Use, for instance, A5.');
      askPosition(callback);
    } else {
      const col = input.charCodeAt(0) - 'A'.charCodeAt(0);
      const row = parseInt(input.charAt(1), 10) - 1;
      callback(row, col);
    }
  });
}

function takeTurn(): void {
  console.log(`\n== Player ${currentPlayer}'s Turn ==`);
  if (currentPlayer === 1) {
    console.log('Player 2 Board:');
    player2.board.printBoard(true);
  } else {
    console.log('Player 1 Board:');
    player1.board.printBoard(true);
  }
  askPosition((row, col) => {
    const defender = currentPlayer === 1 ? player2 : player1;
    const hit = defender.board.attack(row, col);
    const posStr = `${String.fromCharCode(col + 65)}${row + 1}`;
    console.log(`Player ${currentPlayer} attacks ${posStr}: ${hit ? 'Hit!' : 'Miss!'}`);
    if (defender.board.allBoatsSunk()) {
      console.log(`Player ${currentPlayer} wins! All enemy ships have been sunk.`);
      rl.close();
      return;
    }
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    takeTurn();
  });
}

// Démarre la boucle de jeu
takeTurn();
