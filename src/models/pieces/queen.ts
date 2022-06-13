import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";

export class Queen extends Base {
  constructor(scene: Phaser.Scene, white: boolean, position: Position) {
    super(scene, PIECE_NAME.QUEEN, white, position, []);
  }

  protected possibleMovements(friendlyPositions: Position[], enemyPositions: Position[]) {
    const possiblePositions: Position[] = [];
    const plusminusArray = [-1, 0, 1];
    for (const plusminusX of plusminusArray) {
      for (const plusminusY of plusminusArray) {
        if (plusminusX !== 0 || plusminusY !== 0) {
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
    }
    return possiblePositions;
  }
}
