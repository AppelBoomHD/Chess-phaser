import Phaser from 'phaser';
import { PIECE_NAME, SIZE_PIECE, SIZE_SQUARE } from '../environment';
import { Base } from '../models/pieces/base';
import { Bishop } from '../models/pieces/bishop';
import { King } from '../models/pieces/king';
import { Knight } from '../models/pieces/knight';
import { Pawn } from '../models/pieces/pawn';
import { Queen } from '../models/pieces/queen';
import { Rook } from '../models/pieces/rook';

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
    const grid = this.add.grid(
      +import.meta.env.VITE_SIZE_BOARD / 2,
      +import.meta.env.VITE_SIZE_BOARD / 2,
      +import.meta.env.VITE_SIZE_BOARD,
      +import.meta.env.VITE_SIZE_BOARD,
      SIZE_SQUARE, SIZE_SQUARE,
      +import.meta.env.VITE_COLOR_WHITE_SQUARE
    );
    grid.setAltFillStyle(+import.meta.env.VITE_COLOR_BLACK_SQUARE);
  }

  private drawPieces() {
    this.whitePieces = [
      new Pawn(this, true, { vertical: 2, horizontal: 1 }),
      new Pawn(this, true, { vertical: 2, horizontal: 2 }),
      new Pawn(this, true, { vertical: 2, horizontal: 3 }),
      new Pawn(this, true, { vertical: 2, horizontal: 4 }),
      new Pawn(this, true, { vertical: 2, horizontal: 5 }),
      new Pawn(this, true, { vertical: 2, horizontal: 6 }),
      new Pawn(this, true, { vertical: 2, horizontal: 7 }),
      new Pawn(this, true, { vertical: 2, horizontal: 8 }),
      new Rook(this, true, { vertical: 1, horizontal: 1 }),
      new Knight(this, true, false, { vertical: 1, horizontal: 2 }),
      new Bishop(this, true, { vertical: 1, horizontal: 3 }),
      new Queen(this, true, { vertical: 1, horizontal: 4 }),
      new King(this, true, { vertical: 1, horizontal: 5 }),
      new Bishop(this, true, { vertical: 1, horizontal: 6 }),
      new Knight(this, true, true, { vertical: 1, horizontal: 7 }),
      new Rook(this, true, { vertical: 1, horizontal: 8 })
    ];

    this.blackPieces = [
      new Pawn(this, false, { vertical: 7, horizontal: 1 }),
      new Pawn(this, false, { vertical: 7, horizontal: 2 }),
      new Pawn(this, false, { vertical: 7, horizontal: 3 }),
      new Pawn(this, false, { vertical: 7, horizontal: 4 }),
      new Pawn(this, false, { vertical: 7, horizontal: 5 }),
      new Pawn(this, false, { vertical: 7, horizontal: 6 }),
      new Pawn(this, false, { vertical: 7, horizontal: 7 }),
      new Pawn(this, false, { vertical: 7, horizontal: 8 }),
      new Rook(this, false, { vertical: 8, horizontal: 1 }),
      new Knight(this, false, false, { vertical: 8, horizontal: 2 }),
      new Bishop(this, false, { vertical: 8, horizontal: 3 }),
      new Queen(this, false, { vertical: 8, horizontal: 4 }),
      new King(this, false, { vertical: 8, horizontal: 5 }),
      new Bishop(this, false, { vertical: 8, horizontal: 6 }),
      new Knight(this, false, true, { vertical: 8, horizontal: 7 }),
      new Rook(this, false, { vertical: 8, horizontal: 8 })
    ];

    this.allPieces = [...this.whitePieces, ...this.blackPieces];
  }

  private startGame() {
    this.switchTurn();
    this.addListeners();
  }

  private addListeners() {
    this.input.on('dragstart', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
      const piece = this.allPieces[+gameObject.name];

      this.selectedPiece?.gameObject.clearTint();

      if (this.selectedPiece !== piece) {
        this.selectedPiece = piece;
        this.selectedPiece.select();
      } else {
        this.selectedPiece = undefined;
      }
    });

    this.input.on('drag', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
      const piece = this.allPieces[+gameObject.name];
      if (this.selectedPiece !== piece) {
        this.selectedPiece = piece;
        this.selectedPiece.select();
      }
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, _dragX: number, _dragY: number) => {
      const piece = this.allPieces[+gameObject.name];

      if (piece.move()) {
        piece.deselect();
        this.switchTurn();
      }
    });
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
}
