import PieceName from '../../interfaces/piecename';
import Position from '../../interfaces/position';
import Base from './base';

export default class Pawn extends Base {
  private firstMove = true;

  constructor(id: number, scene: Phaser.Scene, white: boolean, position: Position) {
    const moves = white
      ? [
          { ...position, vertical: position.vertical + 1 },
          { ...position, vertical: position.vertical + 2 },
        ]
      : [];
    super(id, scene, PieceName.PAWN, white, position, moves);
  }

  override move(toPosition: Position) {
    if (this.firstMove) this.firstMove = false;
    super.move(toPosition);
  }

  protected possibleMovements(
    friendlyPositions: Position[],
    enemyPositions: Position[],
    doubleMovedPawn?: Position,
  ) {
    const possiblePositions: Position[] = [];
    const allPositions = [...friendlyPositions, ...enemyPositions];
    this.add(1, possiblePositions, allPositions);
    if (this.firstMove) {
      this.add(2, possiblePositions, allPositions);
    }

    [-1, 1].forEach((add) => {
      const position = {
        horizontal: this.position.horizontal + add,
        vertical: this.position.vertical + (this.white ? 1 : -1),
      } as Position;
      if (Base.isOccupied(position, enemyPositions) || this.canEnPassant(add, doubleMovedPawn)) {
        possiblePositions.push(position);
      }
    });

    return possiblePositions;
  }

  private canEnPassant(side: number, doubleMovedPawn?: Position) {
    const position = {
      horizontal: this.position.horizontal + side,
      vertical: this.position.vertical,
    } as Position;

    return (
      doubleMovedPawn &&
      doubleMovedPawn.horizontal === position.horizontal &&
      doubleMovedPawn.vertical === position.vertical
    );
  }

  private add(add: number, possiblePositions: Position[], allPositions: Position[]) {
    const position = {
      horizontal: this.position.horizontal,
      vertical: this.position.vertical + add * (this.white ? 1 : -1),
    } as Position;

    if (Base.isInbound(position) && !Base.isOccupied(position, allPositions)) {
      possiblePositions.push(position);
    }
  }
}
