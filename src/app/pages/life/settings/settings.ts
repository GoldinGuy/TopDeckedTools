import { Component, Input } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { PlayerStats } from '../counter/counter';

@Component({
    selector: 'page-life',
    templateUrl: 'settings.html',
    styleUrls: ['settings.scss'],
})
export class SettingsPage {
    constructor(
        private navParams: NavParams,
        private router: Router,
        private route: ActivatedRoute
    ) {}
    @Input() players: Array<PlayerStats>;

    ngOnInit() {
        let data = this.navParams.data;
        this.players = data.players;
    }
}
