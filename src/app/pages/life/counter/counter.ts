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

export interface Game {
    players: Array<PlayerStats>;
    startingLife: number;
    numPlayers: number;
    timer: number;
    pickFirstPlayer: boolean;
}

import { Component } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DetailsPage } from './details/details';
import { LongPressDirective } from '../../../../../plugins/longPressDirective2';

@Component({
    selector: 'page-life',
    templateUrl: 'counter.html',
    styleUrls: ['counter.scss'],
})
export class CounterPage {
    game: Game;
    displaySettings: boolean;
    displayHistory: boolean;
    displayTimer: boolean;

    constructor(
        private router: Router,
        public modalController: ModalController,
        private route: ActivatedRoute
    ) {
        this.route.queryParamMap.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.game = this.router.getCurrentNavigation().extras.state.game;
            }
        });
        this.displaySettings = false;
        this.displayHistory = false;
    }

    ionViewWillEnter() {
        let cmdDam = [];
        for (let i = 0; i < this.game.numPlayers; i++) {
            cmdDam.push(0);
        }
        for (let i = 0; i < this.game.numPlayers; i++) {
            this.game.players.push({
                id: 'Player' + (i + 1),
                life: this.game.startingLife,
                color: this.setRandomColor(),
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
        for (let i = 0; i < this.game.numPlayers; i++) {
            for (let j = 0; j < this.game.numPlayers; j++) {
                if (j != i) {
                    this.game.players[i].opps.push(this.game.players[j]);
                }
            }
        }
    }

    // ionViewDidEnter() {
    //     if (this.numPlayers === undefined) {
    //         console.log('Back');
    //         this.router.navigate(['/tabs/life']);
    //     }
    // }

    // ionViewDidLeave() {
    //     this.numPlayers = undefined;
    //     this.players = undefined;
    // }

    setHistory(player: PlayerStats) {
        var shift: number;
        shift = player.life - parseInt(player.history[player.history.length - 1]);
        // if (shift > 0) {
        //     hist = '+' + shift;
        // } else {
        //     hist = shift.toString();
        // }
        // player.history.push(hist);
        player.history.push(player.life.toString());
    }

    setRandomColor(): string {
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
            for (let i = 0; i < this.game.players.length; i++) {
                if (this.game.players[i].color === color) {
                    color = null;
                }
            }
        } while (isNullOrUndefined(color));
        return color;
    }

    incrementLife(player: PlayerStats) {
        player.life += 1;
        this.setHistory(player);
    }

    decrementLife(player: PlayerStats) {
        player.life -= 1;
        this.setHistory(player);
    }

    toggleSettings() {
        if (this.displaySettings) {
            this.displaySettings = false;
            if (this.displayHistory) {
                this.displayHistory = false;
            }
        } else {
            this.displaySettings = true;
        }
    }

    toggleTimer() {
        if (this.displayTimer) {
            this.displayTimer = false;
        } else {
            this.displayTimer = true;
        }
    }

    async detailsModal(player: PlayerStats) {
        const modal = await this.modalController.create({
            component: DetailsPage,
            cssClass: 'modal-fullscreen',
            componentProps: {
                player: player,
            },
        });
        return await modal.present();
    }

    reset() {
        let cmdDam = [];
        for (let i = 0; i < this.game.numPlayers; i++) {
            cmdDam.push(0);
        }
        for (let i = 0; i < this.game.numPlayers; i++) {
            this.game.players[i] = {
                id: this.game.players[i].id,
                life: this.game.startingLife,
                color: this.game.players[i].color,
                history: [],
                opps: this.game.players[i].opps,
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
        console.table(this.game.players);
        this.toggleSettings();
    }

    quit() {
        this.toggleSettings();
        this.router.navigate(['/tabs/life']);
    }
}
