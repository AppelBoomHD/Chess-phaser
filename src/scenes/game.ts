import Phaser from 'phaser';
import { PIECE_NAME, SIZE_PIECE, SIZE_SQUARE } from '../environment';
import { CoordinateHelper } from '../helpers/coordinateHelper';
import { Position } from '../interfaces/position';
import { Base } from '../models/pieces/base';
import { Bishop } from '../models/pieces/bishop';
import { King } from '../models/pieces/king';
import { Knight } from '../models/pieces/knight';
import { Pawn } from '../models/pieces/pawn';
import { Queen } from '../models/pieces/queen';
import { Rook } from '../models/pieces/rook';

export default class Game extends Phaser.Scene {
  private selectedPiece?: Base;

  private friendlyPieces: (Base | undefined)[] = [];
  private enemyPieces: (Base | undefined)[] = [];

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
    this.friendlyPieces = [
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

    this.enemyPieces = [
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
  }

  private startGame() {
    this.activatePieces();
    this.addListeners();
  }

  private activatePieces() {
    this.friendlyPieces.forEach((piece) => {
      piece?.enableInteractive();
    });
    this.enemyPieces.forEach((piece) => {
      piece?.disableInteractive();
    });
  }

  private addListeners() {
    this.input.on('dragstart', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
      const piece = this.friendlyPieces[+gameObject.name]!;

      if (this.selectedPiece !== piece) {
        this.selectedPiece?.deselect();
        this.selectedPiece = piece;
        this.selectedPiece.select();
      }
    });

    this.input.on('drag', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, _dragX: number, _dragY: number) => {
      const piece = this.selectedPiece!;
      const newPosition = CoordinateHelper.getPosition({ x: gameObject.x, y: gameObject.y });

      const enemyPiece = this.enemyPieces.findIndex((p) => p &&
        p.position.horizontal === newPosition.horizontal && (p.position.vertical === newPosition.vertical ||
          ((p instanceof Pawn) && (piece instanceof Pawn) && p.position.vertical + (p.white ? -1 : 1) === newPosition.vertical))
      );

      if (this.invalidMove(piece, newPosition)) {
        return piece.moveBack();
      }

      this.setMoves(piece, enemyPiece, newPosition);
      if (this.isInCheck(piece, enemyPiece, newPosition)) {
        this.enemyPieces.forEach((piece) => {
          if (piece) {
            piece.setBackMoves();
          }
        });
        return piece.moveBack();
      }

      if (enemyPiece >= 0) {
        this.strike(enemyPiece);
      }

      this.move(piece, newPosition);
    });
  }

  private invalidMove(piece: Base, position: Position) {
    return !piece.moves.some((location) =>
      location.vertical === position.vertical && location.horizontal === position.horizontal
    );
  }

  private setMoves(piece: Base, enemyPiece: number, newPosition: Position) {
    const friendlyPositions = this.friendlyPieces.map((piece) => piece?.position);
    const enemyPositions = this.enemyPieces.map((piece) => piece?.position);
    let doubleMovedPawn: Position | undefined;
    if (piece instanceof Pawn && Math.abs(piece.position.vertical - newPosition.vertical) >= 2) {
      doubleMovedPawn = newPosition;
    }

    friendlyPositions[piece.id] = newPosition;

    if (enemyPiece >= -1) {
      enemyPositions[enemyPiece] = undefined;
    }

    const friendlyPositionsFiltered = friendlyPositions.filter((position): position is Position => position !== undefined);
    const enemyPositionsFiltered = enemyPositions.filter((position): position is Position => position !== undefined);

    this.enemyPieces.forEach((piece) => {
      if (piece) {
        piece.setMoves(enemyPositionsFiltered, friendlyPositionsFiltered, doubleMovedPawn);
      }
    });
  }

  private isInCheck(piece: Base, enemyPiece: number, newPosition: Position) {
    const king = this.friendlyPieces[12]! as King;
    let kingPosition: Position;
    if (piece instanceof King) {
      kingPosition = newPosition;
    } else {
      kingPosition = king.position;
    }

    const inCheck = this.enemyPieces.some((piece) =>
      piece && piece.id !== enemyPiece && piece.moves.some((position) => position.horizontal === kingPosition.horizontal && position.vertical === kingPosition.vertical)
    );

    if (inCheck) {
      king.flash();
    }

    return inCheck;
  }

  private strike(index: number) {
    const piece = this.enemyPieces[index];
    piece!.destroy();
    this.enemyPieces[index] = undefined;
  }

  private move(piece: Base, position: Position) {
    piece.move(position);
    piece.deselect();
    this.switchTurn();
  }

  private switchTurn() {
    const enemyPieces = this.friendlyPieces;
    this.friendlyPieces = this.enemyPieces;
    this.enemyPieces = enemyPieces;

    this.activatePieces();
  }
}
