import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";

export class Queen extends Base {
  constructor(scene: Phaser.Scene, white: boolean, position: Position) {
    super(scene, PIECE_NAME.QUEEN, white, position);
  }

  possibleMovements() {
    const possiblepositions = [];
    possiblepositions.push(...this.checkdiagonalSpace())
    possiblepositions.push(...this.checkStraightSpace())
    return possiblepositions
  }
}
