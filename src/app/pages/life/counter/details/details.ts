import { Component, Input } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { Game, PlayerStats } from '../counter';

@Component({
    selector: 'page-life',
    templateUrl: 'details.html',
    styleUrls: ['details.scss'],
})
export class DetailsPage {
    @Input() player: PlayerStats;

    constructor(public modalController: ModalController, private navParams: NavParams) {}

    onNgInit() {
        console.table(this.navParams);
        this.player = this.navParams.data.player;
    }

    toggleBool(player: PlayerStats, type: string) {
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

    increment(player: PlayerStats, type: string) {
        if (type === 'infect') {
            player.other.infect += 1;
        } else if (type === 'storm') {
            player.other.storm += 1;
        } else if (type === 'energy') {
            player.other.energy += 1;
        }
    }

    decrement(player: PlayerStats, type: string) {
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

    changeColor(color: string) {
        if (color === 'red') {
            this.player.color = '#dc2054';
        } else if (color === 'orange') {
            this.player.color = '#f0583b';
        } else if (color === 'tangerine') {
            this.player.color = '#f29a2c';
        } else if (color === 'yellow') {
            this.player.color = '#e6c72f';
        } else if (color === 'lime') {
            this.player.color = '#a4d53f';
        } else if (color === 'green') {
            this.player.color = '#6fd872';
        } else if (color === 'aqua') {
            this.player.color = '#56c9ab';
        } else if (color === 'sky') {
            this.player.color = '#51a8e7';
        } else if (color === 'blue') {
            this.player.color = '#597fdd';
        } else if (color === 'purple') {
            this.player.color = '#8260ed';
        } else if (color === 'magenta') {
            this.player.color = '#aa4ee0';
        } else if (color === 'pink') {
            this.player.color = '#dc2054';
        } else if (color === 'hotPink') {
            this.player.color = '#e0379d';
        } else if (color === 'lightPink') {
            this.player.color = '#f38aae';
        }
    }

    getColor(color: string) {
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

    dismiss() {
        this.modalController.dismiss({
            dismissed: true,
        });
    }
}
