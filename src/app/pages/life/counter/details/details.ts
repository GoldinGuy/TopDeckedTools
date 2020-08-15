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

    dismiss() {
        this.modalController.dismiss({
            dismissed: true,
        });
    }
}
