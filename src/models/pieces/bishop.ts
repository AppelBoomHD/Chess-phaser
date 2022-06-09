import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";

export class Bishop extends Base {
  constructor(scene: Phaser.Scene, id: string, white: boolean, position: Position) {
    super(scene, id, PIECE_NAME.BISHOP, white, position);
  }

  possibleMovements() {
    return this.checkdiagonalSpace()
  }
}
