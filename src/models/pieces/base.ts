import { Scene } from 'phaser';
import { SIZE_SQUARE } from '../../environment';
import CoordinateHelper from '../../helpers/coordinateHelper';
import Coordinate from '../../interfaces/coordinate';
import PieceName from '../../interfaces/piecename';
import Position from '../../interfaces/position';

export default abstract class Base {
  public id: number;

  public white: boolean;

  public position: Position;

  public moves: Position[];

  protected readonly gameObject: Phaser.GameObjects.Image;

  private static group: Phaser.GameObjects.Group;

  private scene: Scene;

  private coordinate: Coordinate;

  private fullname: string;

  private lastMoves: Position[] = [];

  constructor(
    id: number,
    scene: Scene,
    name: PieceName,
    white: boolean,
    position: Position,
    moves: Position[],
  ) {
    this.id = id;
    this.moves = moves;
    this.scene = scene;
    this.fullname = `${name}_${white ? 'white' : 'black'}`;
    this.white = white;
    this.position = position;
    this.coordinate = CoordinateHelper.getCoordinate(position);
    this.gameObject = this.scene.add
      .sprite(this.coordinate.x, this.coordinate.y, this.fullname)
      .setName(`${this.id}`);
  }

  protected abstract possibleMovements(
    friendlyPositions: Position[],
    enemyPositions?: Position[],
    doubleMovedPawn?: Position,
    rooks?: boolean[],
  ): Position[];

  move(toPosition: Position) {
    this.position = toPosition;
    this.coordinate = CoordinateHelper.getCoordinate(toPosition);
    this.gameObject.setPosition(this.coordinate.x, this.coordinate.y);
  }

  moveBack() {
    this.gameObject.setPosition(this.coordinate.x, this.coordinate.y);
  }

  select() {
    this.gameObject.setTint(+import.meta.env.VITE_COLOR_TINT);
    Base.group = this.scene.add.group();
    this.moves.forEach((position) => {
      const coordinate = CoordinateHelper.getCoordinate({
        horizontal: position.horizontal,
        vertical: position.vertical,
      });
      Base.group.add(
        this.scene.add.rectangle(
          coordinate.x,
          coordinate.y,
          SIZE_SQUARE,
          SIZE_SQUARE,
          +import.meta.env.VITE_COLOR_TINT,
          0.25,
        ),
      );
    });
  }

  deselect() {
    this.gameObject.clearTint();
    Base.group.destroy(true);
  }

  destroy() {
    this.gameObject.destroy(true);
  }

  setMoves(
    friendlyPositions: Position[],
    enemyPositions?: Position[],
    doubleMovedPawn?: Position,
    rooks?: boolean[],
  ) {
    this.lastMoves = this.moves;
    this.moves = this.possibleMovements(friendlyPositions, enemyPositions, doubleMovedPawn, rooks);
  }

  setBackMoves() {
    this.moves = this.lastMoves;
  }

  enableInteractive() {
    this.gameObject.setInteractive({ draggable: true, useHandCursor: true });
  }

  disableInteractive() {
    this.gameObject.disableInteractive();
  }

  protected static isInbound(position: Position) {
    return (
      position.horizontal <= 8 &&
      position.horizontal >= 1 &&
      position.vertical <= 8 &&
      position.vertical >= 1
    );
  }

  protected static isOccupied(position: Position, occupiedPositions: Position[]) {
    return occupiedPositions.some(
      (pos) => pos.horizontal === position.horizontal && pos.vertical === position.vertical,
    );
  }
}
