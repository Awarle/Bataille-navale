/* Board.ts */
export class Board {
    grid: string[][];
  
    constructor() {
      this.grid = [];
      for (let i = 0; i < 8; i += 1) {
        const row: string[] = [];
        for (let j = 0; j < 8; j += 1) {
          row.push('.');
        }
        this.grid.push(row);
      }
    }
  
    // Pour le mode simple (bateau 1x1)
    placeBoat(row: number, col: number): boolean {
      if (this.grid[row][col] === '.') {
        this.grid[row][col] = 'B';
        return true;
      }
      return false;
    }
  
    // Pour le mode normal : place un bateau de longueur donnée en orientation 'H' (horizontal)
    // ou 'V' (vertical)
    placeShip(row: number, col: number, length: number, orientation: 'H' | 'V'): boolean {
      if (orientation === 'H') {
        if (col + length > 8) return false;
        for (let j = col; j < col + length; j += 1) {
          if (this.grid[row][j] !== '.') return false;
        }
        for (let j = col; j < col + length; j += 1) {
          this.grid[row][j] = 'B';
        }
        return true;
      }
      // orientation 'V'
      if (row + length > 8) return false;
      for (let i = row; i < row + length; i += 1) {
        if (this.grid[i][col] !== '.') return false;
      }
      for (let i = row; i < row + length; i += 1) {
        this.grid[i][col] = 'B';
      }
      return true;
    }
  
    // Applique une attaque sur une case donnée
    attack(row: number, col: number): boolean {
      if (this.grid[row][col] === 'B') {
        this.grid[row][col] = 'X';
        return true;
      }
      if (this.grid[row][col] === '.') {
        this.grid[row][col] = 'O';
      }
      return false;
    }
  
    // Retourne true si aucune case ne contient encore un bateau
    allBoatsSunk(): boolean {
      for (const row of this.grid) {
        for (const cell of row) {
          if (cell === 'B') return false;
        }
      }
      return true;
    }
  
    // Affiche la grille. Si hideBoats est true,
    // les cases contenant des bateaux non touchés sont affichées comme '.'
    printBoard(hideBoats: boolean = false): void {
      for (const row of this.grid) {
        let line = '';
        for (const cell of row) {
          if (hideBoats && cell === 'B') {
            line += '. ';
          } else {
            line += `${cell} `;
          }
        }
        console.log(line);
      }
    }
  }
  