import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";

export class Bishop extends Base {
  constructor(scene: Phaser.Scene, white: boolean, position: Position) {
    super(scene, PIECE_NAME.BISHOP, white, position);
  }

  possibleMovements() {
    const possiblePositions: Position[] = [];
    const plusminusArray = [-1, 1];
    for (const plusminusX of plusminusArray) {
      for (const plusminusY of plusminusArray) {
        let add = 1;
        let position = { horizontal: this.position.horizontal + add * plusminusX, vertical: this.position.vertical + add * plusminusY } as Position;
        while (this.checkInbounds(position)) {
          position = { horizontal: this.position.horizontal + add * plusminusX, vertical: this.position.vertical + add * plusminusY };
          possiblePositions.push(position);
          ++add;
        }
      }
    }
    return possiblePositions;
  }
}
