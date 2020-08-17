import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DetailsPage } from './details/details';
import { Game, PlayerStats, LifeCounterService } from 'src/app/services/life.service';
import { Storage } from '@ionic/storage';

enum Settings {
    off,
    default,
    history,
    timer,
}

@Component({
    selector: 'page-life',
    templateUrl: 'counter.html',
    styleUrls: ['counter.scss'],
})
export class CounterPage {
    game: Game;
    settings: Settings;
    displayModal: boolean;
    timerOn: boolean;
    timerDisplay: string;

    constructor(
        public lifeCounter: LifeCounterService,
        private router: Router,
        public modalController: ModalController,
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
        this.settings = Settings.off;
        this.displayModal = false;
    }

    ionViewWillEnter() {
        if (this.game.players.length < 1) {
            this.game = this.lifeCounter.initializePlayers(this.game);
            this.timerOn = false;
        }
        this.timerDisplay = this.getTimerDisplay();
    }

    settingsIs(): string {
        if (this.settings === Settings.off) {
            return 'off';
        } else if (this.settings === Settings.default) {
            return 'default';
        } else if (this.settings === Settings.history) {
            return 'history';
        } else if (this.settings === Settings.timer) {
            return 'timer';
        }
    }

    setSettings(val: string) {
        if (val === 'off') {
            this.settings = Settings.off;
        } else if (val === 'default') {
            this.settings = Settings.default;
        } else if (val === 'history') {
            this.settings = Settings.history;
        } else if (val === 'timer') {
            this.settings = Settings.timer;
        }
    }

    async detailsModal(player: PlayerStats, rotate: string) {
        if (!this.displayModal) {
            this.displayModal = true;
            console.log(rotate);
            this.lifeCounter.setOpps(this.game);
            // let ro: string;
            // if (player.id === 'Player1') {
            //     ro = 'rotate(180.001deg)';
            // } else if (player.id === 'Player2') {
            //     ro = 'rotate(0deg)';
            // } else if (player.id === 'Player3') {
            //     ro = 'rotate(180.001deg)';
            // } else if (player.id === 'Player4') {
            //     ro = 'rotate(180.001deg)';
            // } else if (player.id === 'Player5') {
            //     ro = 'rotate(180.001deg)';
            // } else if (player.id === 'Player6') {
            //     ro = 'rotate(180.001deg)';
            // }
            // rotation

            const modal = await this.modalController.create({
                component: DetailsPage,
                cssClass: 'modal-fullscreen',
                componentProps: {
                    player: player,
                    rotate: rotate,
                },
            });
            modal.onDidDismiss().then(() => {
                this.displayModal = false;
            });
            return await modal.present();
        }
    }

    async startTimer() {
        var interval = setInterval(() => {
            if (this.timerOn) {
                if (this.game.timer > 0) {
                    this.game.timer--;
                }
                this.timerDisplay = this.getTimerDisplay();
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }

    getTimerDisplay(): string {
        var minutes: string, seconds: string;
        if (this.game.timer === 3000) {
            return (this.game.timer / 60).toString() + ':00';
        } else {
            if (this.game.timer % 60 < 10) {
                seconds = '0' + parseInt('' + (this.game.timer % 60));
            } else if (this.game.timer % 60 == 0) {
                seconds = '00';
            } else {
                seconds = '' + parseInt((this.game.timer % 60).toString());
            }
            if (this.game.timer / 60 < 10) {
                minutes = '0' + parseInt('' + this.game.timer / 60, 10);
            } else {
                minutes = '' + parseInt((this.game.timer / 60).toString(), 10);
            }

            if (parseInt(minutes) >= 60) {
                minutes = parseInt('' + (parseInt(minutes) % 60)).toString();
            }
            return minutes + ':' + seconds;
        }
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
        this.timerDisplay = (this.game.timer / 60).toString() + ':00';
    }

    reset() {
        this.game = this.lifeCounter.reset(this.game);
        this.settings = Settings.off;
    }

    async quit() {
        this.settings = Settings.off;
        this.toggleTimer();
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
}
