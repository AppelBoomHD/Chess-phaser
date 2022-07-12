import Phaser from 'phaser';
import { SIZE_PIECE, SIZE_SQUARE } from '../environment';
import CoordinateHelper from '../helpers/coordinateHelper';
import PieceName from '../interfaces/piecename';
import Position from '../interfaces/position';
import Base from '../models/pieces/base';
import Bishop from '../models/pieces/bishop';
import King from '../models/pieces/king';
import Knight from '../models/pieces/knight';
import Pawn from '../models/pieces/pawn';
import Queen from '../models/pieces/queen';
import Rook from '../models/pieces/rook';

export default class Game extends Phaser.Scene {
  private selectedPiece?: Base;

  private friendlyPieces: (Base | undefined)[] = [];

  private enemyPieces: (Base | undefined)[] = [];

  private board!: Phaser.GameObjects.Grid;

  private promoteWindow?: Phaser.GameObjects.Container;

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
    Object.values(PieceName).forEach((piece) => {
      const name = `${piece}${white ? '_white' : '_black'}`;
      this.load.svg(name, `assets/${name}.svg`, { scale: SIZE_PIECE });
    });
  }

  private drawBoard() {
    this.board = this.add
      .grid(
        +import.meta.env.VITE_SIZE_BOARD / 2,
        +import.meta.env.VITE_SIZE_BOARD / 2,
        +import.meta.env.VITE_SIZE_BOARD,
        +import.meta.env.VITE_SIZE_BOARD,
        SIZE_SQUARE,
        SIZE_SQUARE,
        +import.meta.env.VITE_COLOR_WHITE_SQUARE,
      )
      .setInteractive();
    this.board.setAltFillStyle(+import.meta.env.VITE_COLOR_BLACK_SQUARE);
  }

  private drawPieces() {
    this.friendlyPieces = [
      new Pawn(0, this, true, { vertical: 2, horizontal: 1 }),
      new Pawn(1, this, true, { vertical: 2, horizontal: 2 }),
      new Pawn(2, this, true, { vertical: 2, horizontal: 3 }),
      new Pawn(3, this, true, { vertical: 2, horizontal: 4 }),
      new Pawn(4, this, true, { vertical: 2, horizontal: 5 }),
      new Pawn(5, this, true, { vertical: 2, horizontal: 6 }),
      new Pawn(6, this, true, { vertical: 2, horizontal: 7 }),
      new Pawn(7, this, true, { vertical: 2, horizontal: 8 }),
      new Rook(8, this, true, { vertical: 1, horizontal: 1 }),
      new Knight(9, this, true, false, { vertical: 1, horizontal: 2 }),
      new Bishop(10, this, true, { vertical: 1, horizontal: 3 }),
      new Queen(11, this, true, { vertical: 1, horizontal: 4 }),
      new King(12, this, true, { vertical: 1, horizontal: 5 }),
      new Bishop(13, this, true, { vertical: 1, horizontal: 6 }),
      new Knight(14, this, true, true, { vertical: 1, horizontal: 7 }),
      new Rook(15, this, true, { vertical: 1, horizontal: 8 }),
    ];

    this.enemyPieces = [
      new Pawn(0, this, false, { vertical: 7, horizontal: 1 }),
      new Pawn(1, this, false, { vertical: 7, horizontal: 2 }),
      new Pawn(2, this, false, { vertical: 7, horizontal: 3 }),
      new Pawn(3, this, false, { vertical: 7, horizontal: 4 }),
      new Pawn(4, this, false, { vertical: 7, horizontal: 5 }),
      new Pawn(5, this, false, { vertical: 7, horizontal: 6 }),
      new Pawn(6, this, false, { vertical: 7, horizontal: 7 }),
      new Pawn(7, this, false, { vertical: 7, horizontal: 8 }),
      new Rook(8, this, false, { vertical: 8, horizontal: 1 }),
      new Knight(9, this, false, false, { vertical: 8, horizontal: 2 }),
      new Bishop(10, this, false, { vertical: 8, horizontal: 3 }),
      new Queen(11, this, false, { vertical: 8, horizontal: 4 }),
      new King(12, this, false, { vertical: 8, horizontal: 5 }),
      new Bishop(13, this, false, { vertical: 8, horizontal: 6 }),
      new Knight(14, this, false, true, { vertical: 8, horizontal: 7 }),
      new Rook(15, this, false, { vertical: 8, horizontal: 8 }),
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
    this.board.on('pointerup', () => this.closePromoteWindow());

    this.input.on(
      'dragstart',
      (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        this.closePromoteWindow();

        const piece = this.friendlyPieces[+gameObject.name]!;

        if (this.selectedPiece !== piece) {
          this.selectedPiece?.deselect();
          this.selectedPiece = piece;
          this.selectedPiece.select();
        }
      },
    );

    this.input.on(
      'drag',
      (
        _pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Image,
        dragX: number,
        dragY: number,
      ) => {
        // eslint-disable-next-line no-param-reassign
        gameObject.x = dragX;
        // eslint-disable-next-line no-param-reassign
        gameObject.y = dragY;
      },
    );

    this.input.on(
      'dragend',
      (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        if (!this.selectedPiece) {
          return;
        }

        const newPosition = CoordinateHelper.getPosition({ x: gameObject.x, y: gameObject.y });

        const enemyPiece = this.enemyPieces.findIndex(
          (p) =>
            p &&
            p.position.horizontal === newPosition.horizontal &&
            p.position.vertical === newPosition.vertical,
        );

        let passedPawn = -1;
        if (this.selectedPiece instanceof Pawn) {
          passedPawn = this.enemyPieces.findIndex(
            (p) =>
              p instanceof Pawn &&
              p.position.horizontal === newPosition.horizontal &&
              p.position.vertical + (p.white ? -1 : 1) === newPosition.vertical,
          );
        }

        this.setMoves(enemyPiece, newPosition);
        if (this.invalidMove(enemyPiece, newPosition)) {
          this.enemyPieces.forEach((piece) => {
            piece?.setBackMoves();
          });
          this.selectedPiece.moveBack();
          return;
        }

        if (
          this.selectedPiece instanceof Pawn &&
          newPosition.vertical === (this.selectedPiece.white ? 8 : 1)
        ) {
          this.promote(newPosition, enemyPiece, passedPawn);
          return;
        }

        this.strike(enemyPiece, passedPawn);
        this.move(newPosition);
      },
    );
  }

  private closePromoteWindow(moveBack = true) {
    if (this.promoteWindow) {
      if (moveBack) this.selectedPiece!.moveBack();
      this.promoteWindow.removeAll(true);
      this.promoteWindow = undefined;
    }
  }

  private invalidMove(enemyPiece: number, position: Position) {
    return (
      !this.selectedPiece!.moves.some(
        (location) =>
          location.vertical === position.vertical && location.horizontal === position.horizontal,
      ) ||
      this.isInCheck(enemyPiece, position) ||
      (this.selectedPiece instanceof King &&
        Math.abs(this.selectedPiece.position.horizontal - position.horizontal) >= 2 &&
        (this.isInCheck(-1, {
          ...this.selectedPiece.position,
          horizontal:
            position.horizontal +
            (this.selectedPiece.position.horizontal - position.horizontal) / 2,
        }) ||
          this.isInCheck(-1, this.selectedPiece.position)))
    );
  }

  private setMoves(enemyPiece: number, newPosition: Position) {
    const friendlyPositions = this.friendlyPieces.map((piece) => piece?.position);
    const enemyPositions = this.enemyPieces.map((piece) => piece?.position);

    let doubleMovedPawn: Position | undefined;
    if (
      this.selectedPiece instanceof Pawn &&
      Math.abs(this.selectedPiece!.position.vertical - newPosition.vertical) >= 2
    ) {
      doubleMovedPawn = newPosition;
    }

    const rooks = [
      (this.friendlyPieces[8] as Rook)?.firstMove ?? false,
      (this.friendlyPieces[15] as Rook)?.firstMove ?? false,
    ];

    friendlyPositions[this.selectedPiece!.id] = newPosition;

    // check if enemy piece doesn't exist
    if (enemyPiece >= 0) {
      enemyPositions[enemyPiece] = undefined;
    }

    const friendlyPositionsFiltered = friendlyPositions.filter(
      (position): position is Position => position !== undefined,
    );
    const enemyPositionsFiltered = enemyPositions.filter(
      (position): position is Position => position !== undefined,
    );

    this.enemyPieces.forEach((piece) => {
      piece?.setMoves(enemyPositionsFiltered, friendlyPositionsFiltered, doubleMovedPawn, rooks);
    });
  }

  private isInCheck(enemyPiece: number, newPosition: Position) {
    const king = this.friendlyPieces[12]! as King;
    let kingPosition: Position;
    if (this.selectedPiece instanceof King) {
      kingPosition = newPosition;
    } else {
      kingPosition = king.position;
    }

    const inCheck = this.enemyPieces.some(
      (piece) =>
        piece &&
        piece.id !== enemyPiece &&
        piece.moves.some(
          (position) =>
            position.horizontal === kingPosition.horizontal &&
            position.vertical === kingPosition.vertical,
        ),
    );

    if (inCheck) {
      king.flash();
    }

    return inCheck;
  }

  private strike(piece: number, passedPawn: number) {
    if (piece >= 0) {
      this.enemyPieces[piece]?.destroy();
      this.enemyPieces[piece] = undefined;
    } else if (passedPawn >= 0) {
      this.enemyPieces[passedPawn]?.destroy();
      this.enemyPieces[passedPawn] = undefined;
    }
  }

  private move(position: Position) {
    if (this.selectedPiece instanceof King) {
      this.castles(position);
    }
    this.selectedPiece!.move(position);
    this.switchTurn();
  }

  private castles(position: Position) {
    if (this.selectedPiece!.position.horizontal - position.horizontal >= 2) {
      this.friendlyPieces[8]?.move({
        ...position,
        horizontal: position.horizontal + 1,
      });
    } else if (this.selectedPiece!.position.horizontal - position.horizontal <= -2) {
      this.friendlyPieces[15]?.move({
        ...position,
        horizontal: position.horizontal - 1,
      });
    }
  }

  private promote(position: Position, enemyPiece: number, passedPawn: number) {
    const square = this.add
      .grid(0, 0, 2 * SIZE_SQUARE, 2 * SIZE_SQUARE, SIZE_SQUARE, SIZE_SQUARE, 0xdbc0ba, 1)
      .setOrigin(0);

    const white = this.selectedPiece!.white ? 'white' : 'black';
    const queen = this.add
      .image(0.5 * SIZE_SQUARE, 0.5 * SIZE_SQUARE, `queen_${white}`)
      .setInteractive({ useHandCursor: true })
      .setName('queen');
    const rook = this.add
      .image(1.5 * SIZE_SQUARE, 0.5 * SIZE_SQUARE, `rook_${white}`)
      .setInteractive({ useHandCursor: true })
      .setName('rook');
    const knight = this.add
      .image(0.5 * SIZE_SQUARE, 1.5 * SIZE_SQUARE, `knight_left_${white}`)
      .setInteractive({ useHandCursor: true })
      .setName('knight');
    const bishop = this.add
      .image(1.5 * SIZE_SQUARE, 1.5 * SIZE_SQUARE, `bishop_${white}`)
      .setInteractive({ useHandCursor: true })
      .setName('bishop');

    const x = (position.horizontal - (position.horizontal === 8 ? 2 : 1)) * SIZE_SQUARE;
    const y = position.vertical === 1 ? 6 * SIZE_SQUARE : 0;
    this.promoteWindow = this.add.container(x, y, [square, queen, rook, knight, bishop]);

    queen.on('pointerup', () => {
      this.finishPromote(
        new Queen(this.selectedPiece!.id, this, this.selectedPiece!.white, position),
        enemyPiece,
        passedPawn,
      );
    });

    rook.on('pointerup', () => {
      this.finishPromote(
        new Rook(this.selectedPiece!.id, this, this.selectedPiece!.white, position),
        enemyPiece,
        passedPawn,
      );
    });

    knight.on('pointerup', () => {
      this.finishPromote(
        new Knight(this.selectedPiece!.id, this, this.selectedPiece!.white, false, position),
        enemyPiece,
        passedPawn,
      );
    });
    bishop.on('pointerup', () => {
      this.finishPromote(
        new Bishop(this.selectedPiece!.id, this, this.selectedPiece!.white, position),
        enemyPiece,
        passedPawn,
      );
    });
  }

  private finishPromote(piece: Base, enemyPiece: number, passedPawn: number) {
    this.friendlyPieces[this.selectedPiece!.id]?.destroy();
    this.friendlyPieces[this.selectedPiece!.id] = piece;
    this.closePromoteWindow(false);
    this.strike(enemyPiece, passedPawn);
    this.switchTurn();
  }

  private switchTurn() {
    this.selectedPiece!.deselect();
    const enemyPieces = this.friendlyPieces;
    this.friendlyPieces = this.enemyPieces;
    this.enemyPieces = enemyPieces;

    this.activatePieces();
  }
}
