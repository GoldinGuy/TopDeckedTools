import { Component } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Game } from '../counter';

@Component({
    selector: 'page-life',
    templateUrl: 'details.html',
    styleUrls: ['details.scss'],
})
export class DetailsPage {
    game: Game;

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
    }
}
