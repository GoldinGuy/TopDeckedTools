import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DetailsPage } from './details/details';
import { Game, PlayerStats, LifeCounterService } from 'src/app/services/life.service';

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
    displayModal: boolean;

    constructor(
        public lifeCounter: LifeCounterService,
        private router: Router,
        public modalController: ModalController,
        private route: ActivatedRoute
    ) {
        this.route.queryParamMap.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.game = this.router.getCurrentNavigation().extras.state.game;
            } else {
                this.router.navigate(['/tabs/life']);
            }
        });
        this.displaySettings = false;
        this.displayHistory = false;
        this.displayModal = false;
    }

    ionViewWillEnter() {
        this.game = this.lifeCounter.initializePlayers(this.game);
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
        if (!this.displayModal) {
            this.displayModal = true;
            const modal = await this.modalController.create({
                component: DetailsPage,
                cssClass: 'modal-fullscreen',
                componentProps: {
                    player: player,
                },
            });
            modal.onDidDismiss().then(() => {
                this.displayModal = false;
            });
            return await modal.present();
        }
    }

    reset() {
        this.game = this.lifeCounter.reset(this.game);
        this.toggleSettings();
    }

    quit() {
        this.toggleSettings();
        this.router.navigate(['/tabs/life']);
    }
}
