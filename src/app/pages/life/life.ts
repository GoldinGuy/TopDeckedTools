import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'page-life',
    templateUrl: 'life.html',
    styleUrls: ['life.scss'],
})
export class LifePage {
    constructor(public loadingController: LoadingController) {
        this.life = 20;
        this.playerCount = 2;
    }

    numPlayers = [
        { val: 2, isChecked: true },
        { val: 3, isChecked: false },
        { val: 4, isChecked: false },
        { val: 5, isChecked: false },
        { val: 6, isChecked: false },
    ];

    life: number;
    playerCount: number;

    setPlayerCount(newPlayer: number) {
        this.playerCount = newPlayer;
    }

    setLife(newLife: number) {
        this.life = newLife;
    }

    startGame() {}

    segmentButtonClicked(ev: any) {
        // if (round.val == ev.target.value) {
        //     return {
        //         val: round.val,
        //         isChecked: true,
        //     };
        // } else {
        //     return {
        //         val: round.val,
        //         isChecked: false,
        //     };
        // }
    }
}
