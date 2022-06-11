import { Position } from "../../interfaces/position";
import { Base } from "./base";
import { PIECE_NAME } from "../../environment";


export class King extends Base {
  constructor(scene: Phaser.Scene, white: boolean, position: Position) {
    super(scene, PIECE_NAME.KING, white, position);
  }

  possibleMovements() {
    var possiblepositions = [];
    // +1 +0, +1 +1, +0 +1, -1 +1, -1 0, -1 -1, 0 -1, +1 -1
    var possiblePosition = this.position;
    possiblePosition.horizontal + 1;
    if (this.checkInbounds(possiblePosition)) {
      possiblepositions.push(possiblePosition)
    }
    possiblePosition = this.position;
    possiblePosition.horizontal + 1;
    possiblePosition.vertical + 1;
    if (this.checkInbounds(possiblePosition)) {
      possiblepositions.push(possiblePosition)
    }
    possiblePosition = this.position;
    possiblePosition.vertical + 1;
    if (this.checkInbounds(possiblePosition)) {
      possiblepositions.push(possiblePosition)
    }
    possiblePosition = this.position;
    possiblePosition.horizontal - 1;
    possiblePosition.vertical + 1;
    if (this.checkInbounds(possiblePosition)) {
      possiblepositions.push(possiblePosition)
    }
    possiblePosition = this.position;
    possiblePosition.horizontal - 1;
    if (this.checkInbounds(possiblePosition)) {
      possiblepositions.push(possiblePosition)
    }
    possiblePosition = this.position;
    possiblePosition.horizontal - 1;
    possiblePosition.vertical - 1;
    if (this.checkInbounds(possiblePosition)) {
      possiblepositions.push(possiblePosition)
    }
    possiblePosition = this.position;
    possiblePosition.vertical - 1;
    if (this.checkInbounds(possiblePosition)) {
      possiblepositions.push(possiblePosition)
    }
    possiblePosition = this.position;
    possiblePosition.horizontal + 1;
    possiblePosition.vertical - 1;
    if (this.checkInbounds(possiblePosition)) {
      possiblepositions.push(possiblePosition)
    }
    return possiblepositions
  }
}
