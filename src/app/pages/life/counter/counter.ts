export interface PlayerStats {
    id: string;
    life: number;
    color: string;
    cmdDam: Array<number>;
    history: Array<string>;
    other: {
        infect: number;
        energy: number;
        monarch: boolean;
        cityBless: boolean;
    };
}

import { Component, Input } from '@angular/core';
// import { NavParams } from '@ionic/angular';
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'page-life',
    templateUrl: 'counter.html',
    styleUrls: ['counter.scss'],
})
export class CounterPage {
    @Input() startingLife: number;
    @Input() numPlayers: number;
    @Input() timer: number;
    @Input() pickFirstPlayer: boolean;
    players: Array<PlayerStats>;
    displaySettings: boolean;
    displayHistory: boolean;
    displayTimer: boolean;

    constructor(
        // private navParams: NavParams,
        private router: Router,
        public modalController: ModalController,
        private route: ActivatedRoute
    ) {
        this.route.queryParamMap.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                let data = this.router.getCurrentNavigation().extras.state;
                this.startingLife = data.startingLife;
                this.numPlayers = data.numPlayers;
                this.timer = data.timer;
                this.pickFirstPlayer = data.pickFirstPlayer;
            }
        });

        this.players = [];
        (this.displaySettings = false), (this.displayHistory = false);
    }

    ionViewWillEnter() {
        // console.table(this.navParams);
        // let data = this.navParams.data;

        for (let i = 0; i < this.numPlayers; i++) {
            this.players.push({
                id: 'Player' + (i + 1),
                life: this.startingLife,
                color: this.getColor(),
                cmdDam: [],
                history: [],
                other: {
                    infect: 0,
                    energy: 0,
                    monarch: false,
                    cityBless: false,
                },
            });
        }
        console.table(this.players);
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

    getColor(): string {
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
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].color === color) {
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

    toggleHistory() {
        if (this.displayHistory) {
            this.displayHistory = false;
        } else {
            this.displayHistory = true;
        }
    }

    reset() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i] = {
                id: this.players[i].id,
                life: this.startingLife,
                color: this.players[i].color,
                cmdDam: [],
                history: [],
                other: {
                    infect: 0,
                    energy: 0,
                    monarch: false,
                    cityBless: false,
                },
            };
        }
        console.table(this.players);
        this.toggleSettings();
    }

    quit() {
        this.players = [];
        this.toggleSettings();
        this.router.navigate(['/tabs/life']);
    }
}
