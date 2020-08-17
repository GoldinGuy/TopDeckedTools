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
import { Storage } from '@ionic/storage';

export interface ILifeCounterService {
    // methods that alter all players/the whole game
    initializePlayers(game: Game): Game;
    saveGame(game: Game, storage: Storage): void;
    reset(game: Game): Game;

    // methods that edit individual player values
    setOpps(game: Game): void;
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

    getTimerDisplay(game: Game): string;
}

@Injectable({ providedIn: 'root' })
export class LifeCounterService implements ILifeCounterService {
    initializePlayers(game: Game): Game {
        for (let i = 0; i < game.numPlayers; i++) {
            let cmdDam = [];
            for (let i = 0; i < game.numPlayers - 1; i++) {
                cmdDam.push(0);
            }
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
        this.setOpps(game);
        return game;
    }

    async saveGame(game: Game, storage: Storage) {
        // TODO: save game to local storage/topdecked server
        await storage.set('activeGame', game);
    }

    reset(game: Game): Game {
        for (let i = 0; i < game.numPlayers; i++) {
            let cmdDam = [];
            for (let i = 0; i < game.numPlayers - 1; i++) {
                cmdDam.push(0);
            }
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
        game.timer = 3000;
        console.table(game.players);
        return game;
    }

    setOpps(game: Game, empty?: boolean) {
        for (let i = 0; i < game.numPlayers; i++) {
            game.players[i].opps = [];
            for (let j = 0; j < game.numPlayers; j++) {
                if (j != i) {
                    game.players[i].opps.push(game.players[j]);
                }
                if (empty) {
                    game.players[i].opps = [];
                }
            }
        }
    }

    incrementLife(player: PlayerStats) {
        player.life += 1;
        this.setHistory(player);
    }

    decrementLife(player: PlayerStats) {
        player.life -= 1;
        this.setHistory(player);
    }

    incrementCount(player: PlayerStats, type: string, activeCmd?: number) {
        if (type === 'infect') {
            player.other.infect += 1;
        } else if (type === 'storm') {
            player.other.storm += 1;
        } else if (type === 'energy') {
            player.other.energy += 1;
        } else if (type === 'cmdDam') {
            player.other.cmdDam[activeCmd] += 1;
        }
    }

    decrementCount(player: PlayerStats, type: string, activeCmd?: number) {
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
        } else if (type === 'cmdDam') {
            player.other.cmdDam[activeCmd] -= 1;
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
        // console.log(shift);
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
            // indigo
            '#8260ed',
            // purple
            '#aa4ee0',
            // magenta
            '#e0379d',
            // pink
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
        } else if (color === 'indigo') {
            player.color = '#8260ed';
        } else if (color === 'purple') {
            player.color = '#aa4ee0';
        } else if (color === 'pink') {
            player.color = '#f38aae';
        } else if (color === 'magenta') {
            player.color = '#e0379d';
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
            return 'indigo';
        } else if (color === '#aa4ee0') {
            return 'purple';
        } else if (color === '#e0379d') {
            return 'magenta';
        } else if (color === '#f38aae') {
            return 'pink';
        }
    }

    getTimerDisplay(game: Game): string {
        var minutes: string, seconds: string;
        if (game.timer === 3600) {
            return '60:00';
        } else {
            if (game.timer % 60 < 10) {
                seconds = '0' + parseInt('' + (game.timer % 60));
            } else if (game.timer % 60 == 0) {
                seconds = '00';
            } else {
                seconds = '' + parseInt((game.timer % 60).toString());
            }
            if (game.timer / 60 < 10) {
                minutes = '0' + parseInt('' + game.timer / 60, 10);
            } else {
                minutes = '' + parseInt((game.timer / 60).toString(), 10);
            }

            if (parseInt(minutes) >= 60) {
                minutes = parseInt('' + (parseInt(minutes) % 60)).toString();
            }
            return minutes + ':' + seconds;
        }
    }
}
