import PieceName from '../../interfaces/piecename';
import Position from '../../interfaces/position';
import Base from './base';

export default class Bishop extends Base {
  constructor(id: number, scene: Phaser.Scene, white: boolean, position: Position) {
    super(id, scene, PieceName.BISHOP, white, position, []);
  }

  protected possibleMovements(friendlyPositions: Position[], enemyPositions: Position[]) {
    const possiblePositions: Position[] = [];
    const signs = [-1, 1];
    signs.forEach((signX) => {
      signs.forEach((signY) => {
        let add = 1;
        let position = {
          horizontal: this.position.horizontal + add * signX,
          vertical: this.position.vertical + add * signY,
        } as Position;

        while (Base.isInbound(position) && !Base.isOccupied(position, friendlyPositions)) {
          possiblePositions.push(position);

          if (Base.isOccupied(position, enemyPositions)) {
            break;
          }

          add += 1;
          position = {
            horizontal: this.position.horizontal + add * signX,
            vertical: this.position.vertical + add * signY,
          };
        }
      });
    });
    return possiblePositions;
  }
}
