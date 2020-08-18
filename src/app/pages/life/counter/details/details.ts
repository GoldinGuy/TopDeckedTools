import { Component, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PlayerStats, LifeCounterService } from 'src/app/services/life.service';

@Component({
    selector: 'page-life',
    templateUrl: 'details.html',
    styleUrls: ['details.scss'],
})
export class DetailsPage {
    @Input() player: PlayerStats;
    // @Input() rotate: string;
    activeCmd: number;

    constructor(
        public modalController: ModalController,
        public lifeCounter: LifeCounterService,
        private navParams: NavParams
    ) {
        this.activeCmd = 0;
    }

    ngOnInit() {
        // console.table(this.navParams);
        this.player = this.navParams.data.player;
        // this.rotate = this.navParams.data.rotate;
    }

    setCmd(num: number) {
        this.activeCmd = num;
    }

    dismiss() {
        this.modalController.dismiss({
            dismissed: true,
        });
    }
}
