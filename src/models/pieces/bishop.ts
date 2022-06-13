import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";

export class Bishop extends Base {
  constructor(scene: Phaser.Scene, white: boolean, position: Position) {
    super(scene, PIECE_NAME.BISHOP, white, position, []);
  }

  protected possibleMovements(friendlyPositions: Position[], enemyPositions: Position[]) {
    const possiblePositions: Position[] = [];
    const plusminusArray = [-1, 1];
    for (const plusminusX of plusminusArray) {
      for (const plusminusY of plusminusArray) {
        let add = 1;
        let position = { horizontal: this.position.horizontal + add * plusminusX, vertical: this.position.vertical + add * plusminusY } as Position;
        while (this.isInbound(position) && !this.isOccupied(position, friendlyPositions)) {
          possiblePositions.push(position);

          if (this.isOccupied(position, enemyPositions)) {
            break;
          }

          ++add;
          position = { horizontal: this.position.horizontal + add * plusminusX, vertical: this.position.vertical + add * plusminusY };
        }
      }
    }
    return possiblePositions;
  }
}
