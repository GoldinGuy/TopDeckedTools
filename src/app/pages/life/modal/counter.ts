export interface PlayerStats {
    id: string;
    life: number;
    color: string;
    cmdDam: Array<number>;
    infect: number;
    energy: number;
    monarch: boolean;
    cityBless: boolean;
}

import { Component, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { isNullOrUndefined } from 'util';

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

    constructor(private navParams: NavParams) {
        // dummy data
        // this.players = [
        //     {
        //         id: null,
        //         color: 'purple',
        //         life: 20,
        //         cmdDam: [],
        //         infect: 0,
        //         energy: 0,
        //         monarch: false,
        //         cityBless: false,
        //     },
        //     {
        //         id: null,
        //         color: 'blue',
        //         life: 20,
        //         cmdDam: [],
        //         infect: 0,
        //         energy: 0,
        //         monarch: false,
        //         cityBless: false,
        //     },
        // ];
    }

    ngOnInit() {
        console.table(this.navParams);
        let data = this.navParams.data;
        (this.startingLife = data.startingLife),
            (this.numPlayers = data.numPlayers),
            (this.timer = data.timer),
            (this.pickFirstPlayer = data.pickFirstPlayer),
            (this.players = []);
        for (let i = 0; i < this.numPlayers; i++) {
            this.players.push({
                id: null,
                life: this.startingLife,
                color: this.getColor(),
                cmdDam: [],
                infect: 0,
                energy: 0,
                monarch: false,
                cityBless: false,
            });
        }
        console.log('Players: ' + JSON.stringify(this.players));
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
            // light purple
            // '#6a5787',
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
    }

    incrementMuchLife(player: PlayerStats) {
        player.life += 3;
    }

    decrementLife(player: PlayerStats) {
        player.life -= 1;
    }
}
