import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";

export class Knight extends Base {
  constructor(scene: Phaser.Scene, white: boolean, right: boolean, position: Position) {
    super(scene, right ? PIECE_NAME.KNIGHT_RIGHT : PIECE_NAME.KNIGHT_LEFT, white, position);
  }

  protected possibleMovements(friendlyPositions: Position[]) {
    const possiblepositions = [];
    /**
     *  +1 +2,
     *  -1 +2,
     *  -2 +1
     *  -2 -1
     *  -1 -2
     *  -2 +1
     *  +2 -1
     */
    const additions = [-2, -1, 1, 2];
    for (const addX of additions) {
      for (const addY of additions) {
        if (addX !== addY && addX !== -addY) {
          const position = { horizontal: this.position.horizontal + addX, vertical: this.position.vertical + addY } as Position;
          if (this.isInbound(position) && !this.isOccupied(position, friendlyPositions)) {
            possiblepositions.push(position);
          }
        }
      }
    }
    return possiblepositions;
  }
}
