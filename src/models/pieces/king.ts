import PieceName from '../../interfaces/piecename';
import Position from '../../interfaces/position';
import Base from './base';

export default class King extends Base {
  public firstMove = true;

  constructor(scene: Phaser.Scene, white: boolean, position: Position) {
    super(scene, PieceName.KING, white, position, []);
  }

  override move(toPosition: Position) {
    if (this.firstMove) this.firstMove = false;
    super.move(toPosition);
  }

  protected possibleMovements(
    friendlyPositions: Position[],
    _enemyPositions: Position[],
    _doubleMovedPawn: Position,
    rooks: boolean[],
  ) {
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

    if (this.firstMove) {
      const pos = { vertical: this.white ? 1 : 8 };
      if (
        rooks[this.white ? 0 : 1] &&
        !Base.isOccupied({ horizontal: 2, ...pos }, friendlyPositions) &&
        !Base.isOccupied({ horizontal: 3, ...pos }, friendlyPositions) &&
        !Base.isOccupied({ horizontal: 4, ...pos }, friendlyPositions)
      ) {
        possibleMovements.push({ horizontal: 3, ...pos });
      }
      if (
        rooks[this.white ? 1 : 0] &&
        !Base.isOccupied({ horizontal: 6, ...pos }, friendlyPositions) &&
        !Base.isOccupied({ horizontal: 7, ...pos }, friendlyPositions)
      ) {
        possibleMovements.push({ horizontal: 7, ...pos });
      }
    }

    return possibleMovements;
  }

  flash() {
    this.gameObject.setTint(+import.meta.env.VITE_COLOR_DANGER);
    setTimeout(() => this.gameObject.clearTint(), 250);
  }
}
