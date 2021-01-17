Civitas
=======

![Main game area](docs/images/civitas-screenshot-2.jpg)

## Description

Civitas is a free-to-play strategy empire-building browser game written in Javascript with the help of the [jQuery library](https://jquery.org). Players develop and maintain their settlement from initial village to a fully grown metropolis, influencing and conquering the neighbouring settlements.

There is no set goal, game is played on an infinite-round basis and there is a server component planned. The focus of the game is to manufacture and trade resources in order to raise the level of your city.

## Features

- [x] Over 80 types of buildings, each intertwined in the chain of production.
- [x] Custom climate zones, each with specific buildings.
- [x] Global market, player can trade goods with other settlements.
- [x] Army! Navy! Soldiers! Ships!
- [x] Fame system that allows your city to level up via trades, conquers and special buildings.
- [x] Prestige system that affects diplomacy.
- [x] Each city in the game world is linked via an influence system that needs to be maintained for diplomacy to work.
- [x] Random events that can change your diplomacy status with the other cities, give you coins or random resources.
- [x] Espionage, influence cities, destroy buildings, sabotage.
- [x] Ranking screen, where cities get ranked according to their status in the world.
- [x] Declare war, propose alliances and pacts, ask other settlements to join your city, propose cease fire.
- [ ] Heroes, unique classes and items, attributes.
- [ ] Server component, no actual data is saved externally, only in your browser's localStorage.
- [ ] Jailer component that assures game data integrity (no cheating).
- [ ] Any player interaction since no data is transmitted to the server component.
- [ ] Artificial Intelligence (AI) for computer-controlled cities.

## Playing

In development, Civitas is using several assets that are copyrighted by [Bluebyte](https://www.bluebyte.com), so I cannot redistribute them with the game. In the future, the game will have a brand new set of graphics but for now those will be enough for testing. You can find a link to the said assets [here](https://app.nihaocloud.com/f/01c8b5ec0dab45f39f66/?dl=1). All the other game resources are freely distributed under the [GPLv3 license](license.md), same as the code.

### 1. With Docker

```bash
$ docker-compose up --build
```

And point your browser to `http://localhost` (or even better, add the line below to your `/etc/hosts` file and browse `http://civitas.test`.

```txt
127.0.0.1	civitas.test
```

### 2. Local

Choose an archive format from below, download and uncompress it. Point your browser to `dist/index.html`, you don't need a game server to play.

## Development

Start by installing all the prerequisites:

```bash
$ npm install
```

Run the main script that will load gulp and open `http://localhost:8080` in your web browser.

```bash
$ npm start
```

## Releases

- bleeding edge version - [GitHub .zip](https://github.com/sizeofcat/civitas/archive/master.zip) - [GitHub .tar.gz](https://github.com/sizeofcat/civitas/archive/master.tar.gz) - [Gitee .zip](https://gitee.com/sizeofcat/civitas/repository/archive/develop.zip)
- 0.3 (June 11, 2019) - [GitHub .zip](https://github.com/sizeofcat/civitas/archive/v0.3.zip) - [GitHub .tar.gz](https://github.com/sizeofcat/civitas/archive/v0.3.tar.gz) - [Gitee .zip](https://gitee.com/sizeofcat/civitas/repository/archive/v0.3)
- 0.2 (April 30, 2017) - [GitHub .zip](https://github.com/sizeofcat/civitas/archive/v0.2.zip) - [GitHub .tar.gz](https://github.com/sizeofcat/civitas/archive/v0.2.tar.gz) - [Gitee .zip](https://gitee.com/sizeofcat/civitas/repository/archive/v0.2)
- 0.1 (January 20, 2017) - [GitHub .zip](https://github.com/sizeofcat/civitas/archive/v0.1.zip) - [GitHub .tar.gz](https://github.com/sizeofcat/civitas/archive/v0.1.tar.gz) - [Gitee .zip](https://gitee.com/sizeofcat/civitas/repository/archive/v0.1)

## License

Civitas is written by sizeof(cat) and distributed under the [GPLv3 license](license.md).

```txt
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

## Contributing

Pull requests are always welcome!

I am always thrilled to receive pull requests, and do my best to process them as fast as possible. Not sure if that typo is worth a pull request? Do it! I will probably appreciate it.

If your pull request is not accepted on the first try, don't be discouraged! If there's a problem with the implementation, hopefully you received feedback on what to improve.

Always sign your commits and make sure you read the [Coding Style](docs/coding_style.md) and the [Code of Conduct](docs/code_of_conduct.md).

## Source code

Civitas is written using Javascript, has ~22000 lines of code (including comments and whitespace), ~290Kb minified and can be [downloaded from GitHub.com](https://github.com/sizeofcat/civitas/archive/master.zip), [Gitee.com](https://gitee.com/sizeofcat/civitas/repository/archive/master.zip) or by using git to clone the repository:

GitHub:

```bash
$ git clone git@github.com/sizeofcat/civitas.git
```

Gitee

```bash
git clone git@gitee.com/sizeofcat/civitas.git
```

## Dependencies

- [jQuery 3.4.1](https://jquery.com)
- [jQuery UI 1.11.2](https://jqueryui.com)
- [jQuery Tipsy 1.0.0a](https://github.com/jaz303/tipsy)
- [jQuery scrollTo 1.4.14](https://github.com/flesler/jquery.scrollTo)
- [CryptoJS 3.1.9](https://github.com/brix/crypto-js)
- [simplex-noise.js](https://github.com/jwagner/simplex-noise.js)
- [PRNG.js](https://github.com/odogono/prng-parkmiller-js)

## Thanks

The `music/track1.mp3` song is named __Glandula Pinealis__ by [Shantifax](https://ektoplazm.com/artist/shantifax).

## Screenshots

| | | |
|---|---|---|
| ![](docs/images/civitas-screenshot-1.jpg) | ![](docs/images/civitas-screenshot-34.jpg) | ![](docs/images/civitas-screenshot-3.jpg) |
| ![](docs/images/civitas-screenshot-4.jpg) | ![](docs/images/civitas-screenshot-5.jpg) | ![](docs/images/civitas-screenshot-6.jpg) |
| ![](docs/images/civitas-screenshot-7.jpg) | ![](docs/images/civitas-screenshot-8.jpg) | ![](docs/images/civitas-screenshot-9.jpg) |
| ![](docs/images/civitas-screenshot-10.jpg) | ![](docs/images/civitas-screenshot-11.jpg) | ![](docs/images/civitas-screenshot-12.jpg) |
| ![](docs/images/civitas-screenshot-13.jpg) | ![](docs/images/civitas-screenshot-14.jpg) | ![](docs/images/civitas-screenshot-15.jpg) |
| ![](docs/images/civitas-screenshot-16.jpg) | ![](docs/images/civitas-screenshot-17.jpg) | ![](docs/images/civitas-screenshot-18.jpg) |
| ![](docs/images/civitas-screenshot-19.jpg) | ![](docs/images/civitas-screenshot-20.jpg) | ![](docs/images/civitas-screenshot-21.jpg) |
| ![](docs/images/civitas-screenshot-22.jpg) | ![](docs/images/civitas-screenshot-23.jpg) | ![](docs/images/civitas-screenshot-24.jpg) |
| ![](docs/images/civitas-screenshot-25.jpg) | ![](docs/images/civitas-screenshot-26.jpg) | |
