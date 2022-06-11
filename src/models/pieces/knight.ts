import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";

export class Knight extends Base {
  constructor(scene: Phaser.Scene, white: boolean, right: boolean, position: Position) {
    super(scene, right ? PIECE_NAME.KNIGHT_RIGHT : PIECE_NAME.KNIGHT_LEFT, white, position);
  }

  possibleMovements() {
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
    const possiblePosition = this.position;
    possiblePosition.horizontal + 1;
    possiblePosition.vertical + 2;
    if (this.checkInbounds(possiblePosition)) {
      possiblepositions.push(possiblePosition)
    }
    return possiblepositions;
  }
}
