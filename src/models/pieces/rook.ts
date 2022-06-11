import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";

export class Rook extends Base {
  constructor(scene: Phaser.Scene, white: boolean, position: Position) {
    super(scene, PIECE_NAME.ROOK, white, position);
  }

  possibleMovements() {
    const possiblePositions: Position[] = [];
    const plusminusArray = [-1, 0, 1];
    for (const plusminusX of plusminusArray) {
      for (const plusminusY of plusminusArray) {
        if (plusminusX !== plusminusY && plusminusX !== -plusminusY) {
          let add = 1;
          let position = { horizontal: this.position.horizontal + add * plusminusX, vertical: this.position.vertical + add * plusminusY } as Position;
          while (this.checkInbounds(position)) {
            position = { horizontal: this.position.horizontal + add * plusminusX, vertical: this.position.vertical + add * plusminusY };
            possiblePositions.push(position);
            ++add;
          }
        }
      }
    }
    return possiblePositions;
  }
}
