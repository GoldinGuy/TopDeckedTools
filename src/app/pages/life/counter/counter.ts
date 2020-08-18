import { Game, LifeCounterService, PlayerStats } from 'src/app/services/life.service';

import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController, PickerController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { DetailsPage } from './details/details';

type SettingsMode = 'off' | 'default' | 'history' | 'timer';

@Component({
    selector: 'page-life',
    templateUrl: 'counter.html',
    styleUrls: ['counter.scss'],
})
export class CounterPage {
    game: Game;
    settings: SettingsMode;
    displayModal: boolean;
    timerOn: boolean;
    timerDisplay: string;

    constructor(
        public lifeCounter: LifeCounterService,
        private router: Router,
        public modalController: ModalController,
        private pickerController: PickerController,
        private storage: Storage,
        private route: ActivatedRoute
    ) {
        this.route.queryParamMap.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.game = this.router.getCurrentNavigation().extras.state.game;
            } else {
                this.router.navigate(['/tabs/life']);
            }
        });
        this.settings = 'off';
        this.displayModal = false;
    }

    ionViewWillEnter() {
        if (this.game.players.length < 1) {
            this.game = this.lifeCounter.initializePlayers(this.game);
            this.timerOn = false;
        }
        this.timerDisplay = this.lifeCounter.getTimerDisplay(this.game);
    }

    settingsIs(): SettingsMode {
        return this.settings;
    }

    setSettings(val: SettingsMode) {
        this.settings = val;
    }

    resetGame() {
        this.game = this.lifeCounter.reset(this.game);
        this.timerDisplay = this.lifeCounter.getTimerDisplay(this.game);
        this.timerOn = false;
        this.settings = 'off';
    }

    async quitGame() {
        this.settings = 'off';
        this.timerOn = false;
        this.lifeCounter.setOpps(this.game, true);
        await this.lifeCounter.saveGame(this.game, this.storage);
        // await this.storage.set('activeGame', this.game);
        let navigationExtras: NavigationExtras = {
            state: {
                activeGame: this.game,
            },
        };
        this.router.navigate(['/tabs/life'], navigationExtras);
    }

    async detailsModal(player: PlayerStats) {
        if (!this.displayModal) {
            this.displayModal = true;
            // console.log(rotate);
            this.lifeCounter.setOpps(this.game);
            // let ro: string;
            // if (player.id === 'Player1') {
            //     ro = 'rotate(180.001deg)';
            // } else if (player.id === 'Player2') {
            //     ro = 'rotate(0deg)';
            // }
            const modal = await this.modalController.create({
                component: DetailsPage,
                cssClass: 'modal-fullscreen',
                componentProps: {
                    player: player,
                    // rotate: rotate,
                },
            });
            modal.onDidDismiss().then(() => {
                this.displayModal = false;
            });
            return await modal.present();
        }
    }

    // methods that deal with timer
    async startTimer() {
        var interval = setInterval(() => {
            if (this.timerOn) {
                if (this.game.timer > 0) {
                    this.game.timer--;
                }
                this.timerDisplay = this.lifeCounter.getTimerDisplay(this.game);
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }

    toggleTimer() {
        if (this.timerOn) {
            this.timerOn = false;
        } else {
            this.timerOn = true;
            this.startTimer();
        }
    }

    resetTimer() {
        this.timerOn = false;
        this.game.timer = 3000;
        this.timerDisplay = this.lifeCounter.getTimerDisplay(this.game);
    }

    async editTimer() {
        const picker = await this.pickerController.create({
            columns: [
                {
                    name: `Timer`,
                    options: [
                        {
                            text: '60 Minutes',
                            value: 3600,
                        },
                        {
                            text: '55 Minutes',
                            value: 3300,
                        },
                        {
                            text: '50 Minutes',
                            value: 3000,
                        },
                        {
                            text: '45 Minutes',
                            value: 2700,
                        },
                        {
                            text: '40 Minutes',
                            value: 2400,
                        },
                        {
                            text: '35 Minutes',
                            value: 2100,
                        },
                        {
                            text: '30 Minutes',
                            value: 1800,
                        },
                    ],
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Confirm',
                    handler: (picker) => {
                        this.timerOn = false;
                        this.game.timer = picker.Timer.value;
                        this.timerDisplay = this.lifeCounter.getTimerDisplay(this.game);
                    },
                },
            ],
        });
        await picker.present();
    }
}
