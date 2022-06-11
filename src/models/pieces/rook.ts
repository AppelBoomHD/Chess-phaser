import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";

export class Rook extends Base {
  constructor(scene: Phaser.Scene, white: boolean, position: Position) {
    super(scene, PIECE_NAME.ROOK, white, position);
  }

  possibleMovements() {
    return this.checkStraightSpace()
  }
}
