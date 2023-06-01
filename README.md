# Chess-phaser

![icon](/public/apple-touch-icon.png)

> This is a Chess game made using [Phaser 3](https://github.com/photonstorm/phaser) with [TypeScript](https://www.typescriptlang.org/) implementing [Object-Oriented Programming](https://en.wikipedia.org/wiki/Object-oriented_programming)

## Available Commands

| Command                     | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| `npm install`               | Install project dependencies                             |
| `npm start` / `npm run dev` | Builds project and open web server, watching for changes |
| `npm run build`             | Builds code bundle with production settings              |
| `npm serve`                 | Run a web server to serve built code bundle              |

## Development

After cloning the repo, run `npm install` from your project directory. Make a copy of `.env.example` and name it `.env`. Then, you can start the local development
server by running `npm start` and navigate to http://localhost:3000.

## Production

After running `npm run build`, the files you need for production will be on the `dist` folder. To test code on your `dist` folder, run `npm run serve` and navigate to http://localhost:5000
