import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { CounterPage } from './modal/counter';
import { CounterPageModule } from './modal/counter.module';

@Component({
    selector: 'page-life',
    templateUrl: 'life.html',
    styleUrls: ['life.scss'],
})
export class LifePage {
    constructor(
        public loadingController: LoadingController,
        public modalController: ModalController
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
        const modal = await this.modalController.create({
            component: CounterPage,
            cssClass: 'my-custom-class',
            componentProps: {
                startingLife: this.startingLife,
                numPlayers: this.numPlayers,
                timer: 3000,
                pickFirstPlayer: false,
            },
        });
        return await modal.present();
    }

    // numPlayers = [
    //     { val: 2, isChecked: true },
    //     { val: 3, isChecked: false },
    //     { val: 4, isChecked: false },
    //     { val: 5, isChecked: false },
    //     { val: 6, isChecked: false },
    // ];

    // segmentButtonClicked(ev: any) {
    // }
}
