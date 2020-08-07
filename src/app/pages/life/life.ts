import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { CounterPage } from './modal/counter';
import { CounterPageModule } from './modal/counter.module';
import { NavigationExtras, Router } from '@angular/router';

@Component({
    selector: 'page-life',
    templateUrl: 'life.html',
    styleUrls: ['life.scss'],
})
export class LifePage {
    constructor(
        public loadingController: LoadingController,
        public modalController: ModalController,
        private router: Router
    ) {
        this.startingLife = 20;
        this.numPlayers = 2;
    }

    startingLife: number;
    numPlayers: number;

    setNumPlayers(newPlayer: number) {
        this.numPlayers = newPlayer;
    }

    setLife(newLife: number) {
        this.startingLife = newLife;
    }

    async startGame() {
        // const modal = await this.modalController.create({
        //     component: CounterPage,
        //     cssClass: 'modal-fullscreen',
        //     componentProps: {
        //         startingLife: this.startingLife,
        //         numPlayers: this.numPlayers,
        //         timer: 3000,
        //         pickFirstPlayer: false,
        //     },
        // });
        // return await modal.present();

        let navigationExtras: NavigationExtras = {
            state: {
                startingLife: this.startingLife,
                numPlayers: this.numPlayers,
                timer: 3000,
                pickFirstPlayer: false,
            },
        };
        this.router.navigate(['/lifeCounter'], navigationExtras);
    }
}
