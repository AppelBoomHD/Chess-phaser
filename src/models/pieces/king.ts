import PieceName from '../../interfaces/piecename';
import Position from '../../interfaces/position';
import Base from './base';

export default class King extends Base {
  constructor(scene: Phaser.Scene, white: boolean, position: Position) {
    super(scene, PieceName.KING, white, position, []);
  }

  protected possibleMovements(friendlyPositions: Position[]) {
    const possibleMovements: Position[] = [];
    const additions = [-1, 0, 1];
    additions.forEach((addX) => {
      additions.forEach((addY) => {
        if (addX !== 0 || addY !== 0) {
          const position = {
            horizontal: this.position.horizontal + addX,
            vertical: this.position.vertical + addY,
          } as Position;
          if (Base.isInbound(position) && !Base.isOccupied(position, friendlyPositions)) {
            possibleMovements.push(position);
          }
        }
      });
    });

    return possibleMovements;
  }

  flash() {
    this.gameObject.setTint(+import.meta.env.VITE_COLOR_DANGER);
    setTimeout(() => this.gameObject.clearTint(), 250);
  }
}
