import { Scene } from "phaser";
import { PIECE_NAME, SIZE_SQUARE } from "../../environment";
import { CoordinateHelper } from "../../helpers/coordinateHelper";
import { Coordinate } from "../../interfaces/coordinate";
import { Position } from "../../interfaces/position";
import { Pawn } from "./pawn";

export abstract class Base {
  private static id = 0;
  private static group: Phaser.GameObjects.Group;

  private scene: Scene;
  private _fullname: string;
  private _white: boolean;
  private _position: Position;
  private _coordinate: Coordinate;
  private _gameObject: Phaser.GameObjects.Image;
  private _moves: Position[] = [];

  constructor(scene: Scene, name: PIECE_NAME, white: boolean, position: Position) {
    this.scene = scene;
    this._fullname = `${name}_${white ? 'white' : 'black'}`;
    this._white = white;
    this._position = position;
    this._coordinate = CoordinateHelper.getCoordinate(position);
    this._gameObject = this.scene.add.sprite(this.coordinate.x, this.coordinate.y, this.fullname).setName(`${Base.id++}`);
  }

  public get fullname(): string {
    return this._fullname;
  }

  public get white(): boolean {
    return this._white;
  }

  public get position(): Position {
    return this._position;
  }

  public get gameObject(): Phaser.GameObjects.Image {
    return this._gameObject;
  }

  public get coordinate() {
    return this._coordinate;
  }

  public get moves(): Position[] {
    return this._moves;
  }

  protected abstract possibleMovements(friendlyPositions: Position[], enemyPositions?: Position[]): Position[]

  move(toPosition: Position) {
    this._position = toPosition;
    this._coordinate = CoordinateHelper.getCoordinate(toPosition);
    this._gameObject.setPosition(this._coordinate.x, this._coordinate.y);
  }

  moveBack() {
    this._gameObject.setPosition(this._coordinate.x, this._coordinate.y);
  }

  select() {
    this._gameObject.setTint(+import.meta.env.VITE_COLOR_TINT);
    Base.group = this.scene.add.group();
    for (const position of this._moves) {
      const coordinate = CoordinateHelper.getCoordinate({ horizontal: position.horizontal, vertical: position.vertical });
      Base.group.add(this.scene.add.rectangle(coordinate.x, coordinate.y, SIZE_SQUARE, SIZE_SQUARE, +import.meta.env.VITE_COLOR_TINT, 0.25))
    }
  }

  deselect() {
    this._gameObject.clearTint();
    Base.group.destroy(true);
  }

  destroy() {
    this._gameObject.destroy(true);
  }

  setMoves(friendlyPositions: Position[], enemyPositions?: Position[]) {
    this._moves = this.possibleMovements(friendlyPositions, enemyPositions);
  }

  protected isInbound(position: Position) {
    return position.horizontal <= 8 && position.horizontal >= 1 && position.vertical <= 8 && position.vertical >= 1;
  }

  protected isOccupied(position: Position, occupiedPositions: Position[]) {
    return occupiedPositions.some((pos) => pos.horizontal === position.horizontal && pos.vertical === position.vertical);
  }
}
