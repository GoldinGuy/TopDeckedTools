import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { isNullOrUndefined } from 'util';
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';

@Component({
    selector: 'app-events',
    templateUrl: 'events.html',
    styleUrls: ['events.scss'],
})
export class EventsPage {
    participants = [];
    swipeLeft = true;
    round;
    totalRounds = 4;
    name;
    phoneNumber;

    rounds = [
        { val: 2, isChecked: false },
        { val: 3, isChecked: false },
        { val: 4, isChecked: true },
        { val: 5, isChecked: false },
        { val: 6, isChecked: false },
    ];
    // rounds: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

    constructor(
        public popoverController: PopoverController,
        public alertController: AlertController,
        private router: Router,
        private storage: Storage,
        private pickerController: PickerController
    ) {}

    async ionViewWillEnter() {
        try {
            this.participants = await this.storage.get('participants');
        } catch (e) {
            console.log('Error');
            this.participants = [];
        }
        if (isNullOrUndefined(this.participants)) {
            this.participants = [];
        }

        try {
            this.round = await this.storage.get('round');
        } catch (e) {
            console.log('Error Rounds');
            this.round = 0;
        }

        if (this.round != 0) {
            this.router.navigate(['/tabs/events/tournaments']);
        }
    }

    isDisabled() {
        console.log('Checking for disabled');
        console.log(this.participants.length < 2);
        // return this.participants.length < 2;
        if (this.participants.length < 1) {
            return true;
        } else {
            return false;
        }
    }

    isButtonDisabled() {
        console.log('Checking for disabled');
        console.log(this.participants.length < 2);
        // return this.participants.length < 2;
        if (this.participants.length < 2) {
            return true;
        } else {
            return false;
        }
    }

    async startEvent() {
        if (this.participants.length < 2) {
            return;
        }
        this.storage.set('round', 1);

        await this.storage.set('totalRounds', this.totalRounds);
        let navigationExtras: NavigationExtras = {
            state: {
                new: true,
            },
        };
        this.router.navigate(['/tabs/events/tournaments'], navigationExtras);
    }

    addPlayer = async () => {
        if (!this.name || !this.phoneNumber) {
            return;
        }

        const player = {
            id: this.name,
            phoneNumber: this.phoneNumber,
            seed: this.participants.length + 1,
        };

        this.name = '';
        this.phoneNumber = '';

        this.participants.push(player);
        console.log(this.participants);
        await this.storage.set('participants', this.participants);
    };

    remove = async (name) => {
        console.log('Remove ' + name);
        this.participants = this.participants.filter((player) => player.id != name);
        await this.storage.set('participants', this.participants);
    };

    removeAll = async () => {
        this.participants = [];
        await this.storage.set('participants', this.participants);
        this.swipeLeft = false;
    };

    removeTutorial() {
        this.swipeLeft = false;
        return this.swipeLeft;
    }

    segmentButtonClicked(event: any) {
        this.totalRounds = event.target.value;
        this.rounds = this.rounds.map((round) => {
            if (round.val == event.target.value) {
                return {
                    val: round.val,
                    isChecked: true,
                };
            } else {
                return {
                    val: round.val,
                    isChecked: false,
                };
            }
        });
        console.log(this.rounds);
    }

    // async showPicker() {
    //     let options: PickerOptions = {
    //         buttons: [
    //             {
    //                 text: 'Cancel',
    //                 role: 'cancel',
    //             },
    //             {
    //                 text: 'Ok',
    //                 handler: (value: any) => {
    //                     console.log(value);
    //                 },
    //             },
    //         ],
    //         columns: [
    //             {
    //                 name: 'Number of Rounds',
    //                 options: this.getColumnOptions(),
    //             },
    //         ],
    //     };

    //     let picker = await this.pickerController.create(options);
    //     picker.present();
    // }

    // getColumnOptions() {
    //     let options = [];
    //     this.rounds.forEach((x) => {
    //         options.push({ text: x, value: x });
    //     });
    //     return options;
    // }
}
