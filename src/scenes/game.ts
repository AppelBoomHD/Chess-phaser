import Phaser from 'phaser';
import { PIECE_NAME, SIZE_PIECE, SIZE_SQUARE } from '../environment';
import { CoordinateHelper } from '../helpers/coordinateHelper';
import { Base } from '../models/pieces/base';
import { Bishop } from '../models/pieces/bishop';
import { King } from '../models/pieces/king';
import { Knight } from '../models/pieces/knight';
import { Pawn } from '../models/pieces/pawn';
import { Queen } from '../models/pieces/queen';
import { Rook } from '../models/pieces/rook';
import { Position } from '../interfaces/position';

export default class Game extends Phaser.Scene {
  private whitesTurn = false;

  private whitePieces!: Base[];
  private blackPieces!: Base[];
  private allPieces!: Base[];
  private selectedPiece?: Base;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.loadSvgs(true);
    this.loadSvgs(false);
  }

  create() {
    this.drawBoard();
    this.drawPieces();
    this.startGame();
  }

  private loadSvgs(white: boolean) {
    for (const piece of Object.values(PIECE_NAME)) {
      const name = `${piece}${white ? '_white' : '_black'}`;
      this.load.svg(name, 'assets/' + name + '.svg', { scale: SIZE_PIECE });
    }
  }

  private drawBoard() {
    const blackSquares = [0, 2, 4, 6];
    const whiteSquares = [1, 3, 5, 7];

    this.drawSquares(whiteSquares, whiteSquares, +import.meta.env.VITE_COLOR_WHITE_SQUARE);
    this.drawSquares(blackSquares, blackSquares, +import.meta.env.VITE_COLOR_WHITE_SQUARE);
    this.drawSquares(whiteSquares, blackSquares, +import.meta.env.VITE_COLOR_BLACK_SQUARE);
    this.drawSquares(blackSquares, whiteSquares, +import.meta.env.VITE_COLOR_BLACK_SQUARE);
  }

  private drawSquares(squaresX: number[], squaresY: number[], color: number) {

    // set the line style to have a width of 5 and set the color to red
    for (const xIndex of squaresX) {
      for (const yIndex of squaresY) {
        const x = (xIndex + 0.5) * SIZE_SQUARE;
        const y = (yIndex + 0.5) * SIZE_SQUARE;

        // draw a rectangle
        this.add.rectangle(x, y, SIZE_SQUARE, SIZE_SQUARE, color);
      }
    }
  }

  private drawPieces() {
    this.whitePieces = [
      new Pawn(this, '0', true, { vertical: 2, horizontal: 1 }),
      new Pawn(this, '1', true, { vertical: 2, horizontal: 2 }),
      new Pawn(this, '2', true, { vertical: 2, horizontal: 3 }),
      new Pawn(this, '3', true, { vertical: 2, horizontal: 4 }),
      new Pawn(this, '4', true, { vertical: 2, horizontal: 5 }),
      new Pawn(this, '5', true, { vertical: 2, horizontal: 6 }),
      new Pawn(this, '6', true, { vertical: 2, horizontal: 7 }),
      new Pawn(this, '7', true, { vertical: 2, horizontal: 8 }),
      new Rook(this, '8', true, { vertical: 1, horizontal: 1 }),
      new Knight(this, '9', true, false, { vertical: 1, horizontal: 2 }),
      new Bishop(this, '10', true, { vertical: 1, horizontal: 3 }),
      new Queen(this, '11', true, { vertical: 1, horizontal: 4 }),
      new King(this, '12', true, { vertical: 1, horizontal: 5 }),
      new Bishop(this, '13', true, { vertical: 1, horizontal: 6 }),
      new Knight(this, '14', true, true, { vertical: 1, horizontal: 7 }),
      new Rook(this, '15', true, { vertical: 1, horizontal: 8 })
    ];
    this.blackPieces = [
      new Pawn(this, '16', false, { vertical: 7, horizontal: 1 }),
      new Pawn(this, '17', false, { vertical: 7, horizontal: 2 }),
      new Pawn(this, '18', false, { vertical: 7, horizontal: 3 }),
      new Pawn(this, '19', false, { vertical: 7, horizontal: 4 }),
      new Pawn(this, '20', false, { vertical: 7, horizontal: 5 }),
      new Pawn(this, '21', false, { vertical: 7, horizontal: 6 }),
      new Pawn(this, '22', false, { vertical: 7, horizontal: 7 }),
      new Pawn(this, '23', false, { vertical: 7, horizontal: 8 }),
      new Rook(this, '24', false, { vertical: 8, horizontal: 1 }),
      new Knight(this, '25', false, false, { vertical: 8, horizontal: 2 }),
      new Bishop(this, '26', false, { vertical: 8, horizontal: 3 }),
      new Queen(this, '27', false, { vertical: 8, horizontal: 4 }),
      new King(this, '28', false, { vertical: 8, horizontal: 5 }),
      new Bishop(this, '29', false, { vertical: 8, horizontal: 6 }),
      new Knight(this, '30', false, true, { vertical: 8, horizontal: 7 }),
      new Rook(this, '31', false, { vertical: 8, horizontal: 8 })
    ];

    this.allPieces = [...this.whitePieces, ...this.blackPieces];
  }

  private startGame() {
    this.switchTurn();

    this.input.on('dragstart', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
      const piece = this.allPieces[+gameObject.name];

      this.selectedPiece?.gameObject.clearTint();

      if (this.selectedPiece !== piece) {
        this.selectedPiece = piece;
        this.selectedPiece.gameObject.setTint(+import.meta.env.VITE_COLOR_TINT);
        this.selectedPiece.possibleMovements();
      } else {
        this.selectedPiece = undefined;
      }
    });

    this.input.on('drag', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
      const piece = this.allPieces[+gameObject.name];
      if (this.selectedPiece !== piece) {
        this.selectedPiece = piece;
        this.selectedPiece.gameObject.setTint(+import.meta.env.VITE_COLOR_TINT);
      }
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, _dragX: number, _dragY: number) => {
      const piece = this.allPieces[+gameObject.name];
      const position = CoordinateHelper.getPosition({ x: gameObject.x, y: gameObject.y });

      if (this.checkPosition(piece, position)) {
        piece.move(position);
        this.move(gameObject, piece);
        gameObject.clearTint();
        this.switchTurn();
      } else {
        this.move(gameObject, piece);
      }
    });
  }

  private move(gameObject: Phaser.GameObjects.Image, piece: Base) {
    const coordinate = piece.coordinate;
    gameObject.x = coordinate.x;
    gameObject.y = coordinate.y;
  }

  private switchTurn() {
    if (this.whitesTurn) {
      this.blackPieces.forEach(({ gameObject }) => {
        gameObject.setInteractive({ draggable: true, useHandCursor: true })
      });
      this.whitePieces.forEach(({ gameObject }) => {
        gameObject.disableInteractive();
      });
      this.whitesTurn = false;
    } else {
      this.whitePieces.forEach(({ gameObject }) => {
        gameObject.setInteractive({ draggable: true, useHandCursor: true })
      });
      this.blackPieces.forEach(({ gameObject }) => {
        gameObject.disableInteractive();
      });
      this.whitesTurn = true;
    }
  }

  private checkPosition(piece: Base, position: Position) {
    const locations = piece.possibleMovements()
    return locations.some((location) =>
      location.vertical === position.vertical && location.horizontal === position.horizontal
    )
  }
}
