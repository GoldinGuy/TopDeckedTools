export interface Game {
    players: Array<PlayerStats>;
    startingLife: number;
    numPlayers: number;
    timer: number;
    pickFirstPlayer: boolean;
}

export interface PlayerStats {
    id: string;
    life: number;
    color: string;
    history: Array<string>;
    opps: Array<PlayerStats>;
    other: {
        cmdDam: Array<number>;
        infect: number;
        energy: number;
        storm: number;
        monarch: boolean;
        cityBless: boolean;
    };
}

import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';

export interface ILifeCounterService {
    // methods that alter all players/the whole game
    initializePlayers(game: Game): Game;
    reset(game: Game): Game;

    // methods that edit individual player values
    incrementLife(player: PlayerStats): void;
    decrementLife(player: PlayerStats): void;
    incrementCount(player: PlayerStats, type: string): void;
    decrementCount(player: PlayerStats, type: string): void;
    toggleBoolExtras(player: PlayerStats, type: string): void;
    setHistory(player: PlayerStats): void;

    // methods that deal with colors
    setRandomColor(game: Game): string;
    changeColor(player: PlayerStats, color: string): string;
    getColorFromHex(color: string): string;
}

@Injectable({ providedIn: 'root' })
export class LifeCounterService implements ILifeCounterService {
    initializePlayers(game: Game): Game {
        let cmdDam = [];
        for (let i = 0; i < game.numPlayers; i++) {
            cmdDam.push(0);
        }
        for (let i = 0; i < game.numPlayers; i++) {
            game.players.push({
                id: 'Player' + (i + 1),
                life: game.startingLife,
                color: this.setRandomColor(game),
                history: [],
                opps: [],
                other: {
                    cmdDam: cmdDam,
                    infect: 0,
                    energy: 0,
                    storm: 0,
                    monarch: false,
                    cityBless: false,
                },
            });
        }
        for (let i = 0; i < game.numPlayers; i++) {
            for (let j = 0; j < game.numPlayers; j++) {
                if (j != i) {
                    game.players[i].opps.push(game.players[j]);
                }
            }
        }
        return game;
    }

    reset(game: Game): Game {
        let cmdDam = [];
        for (let i = 0; i < game.numPlayers; i++) {
            cmdDam.push(0);
        }
        for (let i = 0; i < game.numPlayers; i++) {
            game.players[i] = {
                id: game.players[i].id,
                life: game.startingLife,
                color: game.players[i].color,
                history: [],
                opps: game.players[i].opps,
                other: {
                    cmdDam: cmdDam,
                    infect: 0,
                    energy: 0,
                    storm: 0,
                    monarch: false,
                    cityBless: false,
                },
            };
        }
        console.table(game.players);
        return game;
    }

    incrementLife(player: PlayerStats) {
        player.life += 1;
        this.setHistory(player);
    }

    decrementLife(player: PlayerStats) {
        player.life -= 1;
        this.setHistory(player);
    }

    incrementCount(player: PlayerStats, type: string) {
        if (type === 'infect') {
            player.other.infect += 1;
        } else if (type === 'storm') {
            player.other.storm += 1;
        } else if (type === 'energy') {
            player.other.energy += 1;
        }
    }

    decrementCount(player: PlayerStats, type: string) {
        if (type === 'infect') {
            if (player.other.infect > 0) {
                player.other.infect -= 1;
            }
        } else if (type === 'storm') {
            if (player.other.storm > 0) {
                player.other.storm -= 1;
            }
        } else if (type === 'energy') {
            if (player.other.energy > 0) {
                player.other.energy -= 1;
            }
        }
    }

    toggleBoolExtras(player: PlayerStats, type: string) {
        if (type === 'monarch') {
            if (player.other.monarch) {
                player.other.monarch = false;
            } else {
                player.other.monarch = true;
            }
        } else if (type === 'cityBless') {
            if (player.other.cityBless) {
                player.other.cityBless = false;
            } else {
                player.other.cityBless = true;
            }
        }
    }

    setHistory(player: PlayerStats) {
        let shift: number;
        shift = player.life - parseInt(player.history[player.history.length - 1]);
        player.history.push(player.life.toString());
    }

    setRandomColor(game: Game): string {
        let colors = [
            // red
            '#dc2054',
            // orange
            '#f0583b',
            // tangerine
            '#f29a2c',
            // yellow
            '#e6c72f',
            // lime
            '#a4d53f',
            // green
            '#6fd872',
            // aqua
            '#56c9ab',
            // sky
            '#51a8e7',
            // blue
            '#597fdd',
            // purple
            '#8260ed',
            // magenta
            '#aa4ee0',
            // pink
            '#dc2054',
            // hot pink
            '#e0379d',
            // light pink
            '#f38aae',
        ];
        var color: string;
        do {
            color = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < game.players.length; i++) {
                if (game.players[i].color === color) {
                    color = null;
                }
            }
        } while (isNullOrUndefined(color));
        return color;
    }

    changeColor(player: PlayerStats, color: string): string {
        if (color === 'red') {
            player.color = '#dc2054';
        } else if (color === 'orange') {
            player.color = '#f0583b';
        } else if (color === 'tangerine') {
            player.color = '#f29a2c';
        } else if (color === 'yellow') {
            player.color = '#e6c72f';
        } else if (color === 'lime') {
            player.color = '#a4d53f';
        } else if (color === 'green') {
            player.color = '#6fd872';
        } else if (color === 'aqua') {
            player.color = '#56c9ab';
        } else if (color === 'sky') {
            player.color = '#51a8e7';
        } else if (color === 'blue') {
            player.color = '#597fdd';
        } else if (color === 'purple') {
            player.color = '#8260ed';
        } else if (color === 'magenta') {
            player.color = '#aa4ee0';
        } else if (color === 'pink') {
            player.color = '#dc2054';
        } else if (color === 'hotPink') {
            player.color = '#e0379d';
        } else if (color === 'lightPink') {
            player.color = '#f38aae';
        }
        return player.color;
    }

    getColorFromHex(color: string): string {
        if (color === '#dc2054') {
            return 'red';
        } else if (color === '#f0583b') {
            return 'orange';
        } else if (color === '#f29a2c') {
            return 'tangerine';
        } else if (color === '#e6c72f') {
            return 'yellow';
        } else if (color === '#a4d53f') {
            return 'lime';
        } else if (color === '#6fd872') {
            return 'green';
        } else if (color === '#56c9ab') {
            return 'aqua';
        } else if (color === '#51a8e7') {
            return 'sky';
        } else if (color === '#597fdd') {
            return 'blue';
        } else if (color === '#8260ed') {
            return 'purple';
        } else if (color === '#aa4ee0') {
            return 'magenta';
        } else if (color === '#dc2054') {
            return 'pink';
        } else if (color === '#e0379d') {
            return 'hotPink';
        } else if (color === '#f38aae') {
            return 'lightPink';
        }
    }
}
