import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  scale: {
    width: +import.meta.env.VITE_SIZE_BOARD,
    height: +import.meta.env.VITE_SIZE_BOARD,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
} as Phaser.Types.Core.GameConfig;
