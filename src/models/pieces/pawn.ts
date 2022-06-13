import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";

export class Pawn extends Base {
  private firstmove = true;

  constructor(scene: Phaser.Scene, white: boolean, position: Position) {
    const moves = white ? [
      { ...position, vertical: position.vertical + 1 },
      { ...position, vertical: position.vertical + 2 }
    ] : [];
    super(scene, PIECE_NAME.PAWN, white, position, moves);
  }

  override move(toPosition: Position) {
    if (this.firstmove) this.firstmove = false;
    super.move(toPosition);
  }

  protected possibleMovements(friendlyPositions: Position[], enemyPositions: Position[], doubleMovedPawn?: Position) {
    const possiblePositions: Position[] = [];

    const position = this.add(0, 1);
    if (this.isInbound(position) && !this.isOccupied(position, [...friendlyPositions, ...enemyPositions])) {
      possiblePositions.push(position);
      if (this.firstmove) {
        const position = this.add(0, 2);
        if (this.isInbound(position) && !this.isOccupied(position, [...friendlyPositions, ...enemyPositions])) {
          possiblePositions.push(position);
        }
      }
    }

    for (const add of [-1, 1]) {
      const position = this.add(add, 1);
      if (this.isOccupied(position, enemyPositions) || this.canEnPassant(this.add(add, 0), doubleMovedPawn)) {
        possiblePositions.push(position);
      }
    }

    return possiblePositions;
  }

  private canEnPassant(position: Position, doubleMovedPawn?: Position) {
    return doubleMovedPawn && doubleMovedPawn.horizontal === position.horizontal && doubleMovedPawn.vertical === position.vertical
  }

  private add(addX: number, addY: number) {
    return { horizontal: this.position.horizontal + addX, vertical: this.position.vertical + addY * (this.white ? 1 : -1) };
  }
}
