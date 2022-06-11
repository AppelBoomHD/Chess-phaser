import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";

export class Pawn extends Base {
  private firstmove = true;

  constructor(scene: Phaser.Scene, white: boolean, position: Position) {
    super(scene, PIECE_NAME.PAWN, white, position);
  }

  override move() {
    const didMove = super.move();

    if (didMove) {
      this.firstmove = false;
    }

    return didMove;
  }

  possibleMovements() {
    var moveAmount = 1;
    var possiblepositions = [];
    if (this.firstmove) {
      moveAmount = 2;
    }

    for (var i = 1; i <= moveAmount; i++) {
      const possiblePostion = { horizontal: this.position.horizontal, vertical: this.position.vertical } as Position;
      if (this.white) {
        possiblePostion.vertical += i;
      } else {
        possiblePostion.vertical -= i;
      }
      possiblepositions.push(possiblePostion)
    }

    return possiblepositions;
  }

}
