import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";


export class King extends Base {
  constructor(scene: Phaser.Scene, white: boolean, position: Position) {
    super(scene, PIECE_NAME.KING, white, position);
  }

  protected possibleMovements(friendlyPositions: Position[]) {
    const possibleMovements: Position[] = [];
    const additions = [-1, 0, 1];
    for (const addX of additions) {
      for (const addY of additions) {
        if (addX !== 0 || addY !== 0) {
          const position = { horizontal: this.position.horizontal + addX, vertical: this.position.vertical + addY } as Position;
          if (this.isInbound(position) && !this.isOccupied(position, friendlyPositions)) {
            possibleMovements.push(position);
          }
        }
      }
    }

    return possibleMovements;
  }

  flash() {
    this.gameObject.setTint(+import.meta.env.VITE_COLOR_DANGER);
    setTimeout(() => this.gameObject.clearTint(), 250);
  }
}
