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
  private coordinate: Coordinate;
  private fullname: string;

  private _gameObject: Phaser.GameObjects.Image;
  private _id: number;
  private _white: boolean;
  private _position: Position;
  private _moves: Position[] = [];

  constructor(scene: Scene, name: PIECE_NAME, white: boolean, position: Position) {
    if (Base.id === 16) Base.id = 0;
    this._id = Base.id++;
    this.scene = scene;
    this.fullname = `${name}_${white ? 'white' : 'black'}`;
    this._white = white;
    this._position = position;
    this.coordinate = CoordinateHelper.getCoordinate(position);
    this._gameObject = this.scene.add.sprite(this.coordinate.x, this.coordinate.y, this.fullname).setName(`${this.id}`);
  }

  get id() {
    return this._id;
  }

  get white() {
    return this._white;
  }

  get position() {
    return this._position;
  }

  get moves() {
    return this._moves;
  }

  protected get gameObject() {
    return this._gameObject;
  }

  protected abstract possibleMovements(friendlyPositions: Position[], enemyPositions?: Position[], doubleMovedPawn?: Position): Position[]

  move(toPosition: Position) {
    this._position = toPosition;
    this.coordinate = CoordinateHelper.getCoordinate(toPosition);
    this.gameObject.setPosition(this.coordinate.x, this.coordinate.y);
  }

  moveBack() {
    this.gameObject.setPosition(this.coordinate.x, this.coordinate.y);
  }

  select() {
    this.gameObject.setTint(+import.meta.env.VITE_COLOR_TINT);
    Base.group = this.scene.add.group();
    for (const position of this._moves) {
      const coordinate = CoordinateHelper.getCoordinate({ horizontal: position.horizontal, vertical: position.vertical });
      Base.group.add(this.scene.add.rectangle(coordinate.x, coordinate.y, SIZE_SQUARE, SIZE_SQUARE, +import.meta.env.VITE_COLOR_TINT, 0.25))
    }
  }

  deselect() {
    this.gameObject.clearTint();
    Base.group.destroy(true);
  }

  destroy() {
    this.gameObject.destroy(true);
  }

  setMoves(friendlyPositions: Position[], enemyPositions?: Position[], doubleMovedPawn?: Position) {
    this._moves = this.possibleMovements(friendlyPositions, enemyPositions, doubleMovedPawn);
  }

  enableInteractive() {
    this.gameObject.setInteractive({ draggable: true, useHandCursor: true });
  }

  disableInteractive() {
    this.gameObject.disableInteractive();
  }

  protected isInbound(position: Position) {
    return position.horizontal <= 8 && position.horizontal >= 1 && position.vertical <= 8 && position.vertical >= 1;
  }

  protected isOccupied(position: Position, occupiedPositions: Position[]) {
    return occupiedPositions.some((pos) => pos.horizontal === position.horizontal && pos.vertical === position.vertical);
  }
}
