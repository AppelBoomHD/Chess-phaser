import PieceName from '../../interfaces/piecename';
import Position from '../../interfaces/position';
import Base from './base';

export default class Knight extends Base {
  constructor(scene: Phaser.Scene, white: boolean, right: boolean, position: Position) {
    const moves = white
      ? [
          {
            horizontal: position.horizontal + 1,
            vertical: position.vertical + 2,
          },
          {
            horizontal: position.horizontal - 1,
            vertical: position.vertical + 2,
          },
        ]
      : [];
    super(scene, right ? PieceName.KNIGHT_RIGHT : PieceName.KNIGHT_LEFT, white, position, moves);
  }

  protected possibleMovements(friendlyPositions: Position[]) {
    const possiblePositions: Position[] = [];
    const additions = [-2, -1, 1, 2];
    additions.forEach((addX) => {
      additions.forEach((addY) => {
        if (addX !== addY && addX !== -addY) {
          const position = {
            horizontal: this.position.horizontal + addX,
            vertical: this.position.vertical + addY,
          } as Position;
          if (Base.isInbound(position) && !Base.isOccupied(position, friendlyPositions)) {
            possiblePositions.push(position);
          }
        }
      });
    });
    return possiblePositions;
  }
}
