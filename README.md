<h1 align="center">
  <br>
  <a href="https://github.com/geocine/phaser3-rollup-typescript#readme"><img src="https://i.imgur.com/6lcIxDs.png" alt="header" width="600"/></a>
  <br>
  Chess (Made with Phaser 3 & TypeScript)
  <br>
</h1>

This is a Chess game made using [Phaser 3](https://github.com/photonstorm/phaser) with [TypeScript](https://www.typescriptlang.org/), [Rollup](https://rollupjs.org) with ⚡️ lightning fast HMR through [Vite](https://vitejs.dev/).

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` / `npm run dev` | Builds project and open web server, watching for changes |
| `npm run build` | Builds code bundle with production settings  |
| `npm serve` | Run a web server to serve built code bundle |

## Development

After cloning the repo, run `npm install` from your project directory. Make a copy of `.env.example` and name it `.env`. Then, you can start the local development
server by running `npm start` and navigate to http://localhost:3000.

## Production

After running `npm run build`, the files you need for production will be on the `dist` folder. To test code on your `dist` folder, run `npm run serve` and navigate to http://localhost:5000
