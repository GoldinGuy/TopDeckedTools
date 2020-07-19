import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { isNullOrUndefined } from 'util';
import {
    Tournament,
    TournamentService,
    TournamentPlayer,
} from 'src/app/services/tournament.service';

@Component({
    selector: 'app-events',
    templateUrl: 'events.html',
    styleUrls: ['events.scss'],
})
export class EventsPage {
    tourney: Tournament;
    participants = Array<TournamentPlayer>();
    swipeLeft = true;
    round: number;
    totalRounds: number;
    name: string;
    phoneNumber: string;

    roundsPicker = [
        { val: 2, isChecked: false },
        { val: 3, isChecked: false },
        { val: 4, isChecked: true },
        { val: 5, isChecked: false },
        { val: 6, isChecked: false },
    ];

    constructor(
        public popoverController: PopoverController,
        public alertController: AlertController,
        private router: Router,
        private storage: Storage,
        private tournamentService: TournamentService
    ) {}

    async ionViewWillEnter() {
        try {
            this.tourney = await this.storage.get('tournament');
            this.participants = this.tourney.participants;
            this.round = this.tourney.round.roundNum;
            this.totalRounds = this.tourney.totalRounds;
        } catch (e) {
            console.log('Error. No tournament found.');
            this.participants = [];
            this.round = 0;
            this.totalRounds = 4;
        }
        if (isNullOrUndefined(this.participants)) {
            this.participants = [];
            this.round = 0;
            this.totalRounds = 4;
        }

        if (this.round != 0) {
            this.router.navigate(['/tabs/events/tournaments']);
        }
    }

    isDisabled() {
        console.log('Checking if disabled');
        console.log(this.participants.length < 2);
        if (this.participants.length < 1) {
            return true;
        } else {
            return false;
        }
    }

    isButtonDisabled() {
        console.log('Checking if disabled');
        console.log(this.participants.length < 2);
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

        this.tourney = this.tournamentService.createTournament(this.participants, this.totalRounds);
        await this.storage.set('tournament', this.tourney);
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
        const player = this.tournamentService.addPlayer(
            this.name,
            this.phoneNumber,
            this.participants.length + 1
        );

        this.name = '';
        this.phoneNumber = '';

        this.participants.push(player);
        console.log(this.participants);
    };

    remove = async (name: string) => {
        console.log('Remove ' + name);
        this.participants = this.participants.filter(
            (player: TournamentPlayer) => player.name != name
        );
    };

    removeAll = async () => {
        this.participants = [];
        this.swipeLeft = false;
    };

    removeTutorial() {
        this.swipeLeft = false;
        return this.swipeLeft;
    }

    segmentButtonClicked(event: any) {
        this.totalRounds = event.target.value;
        this.roundsPicker = this.roundsPicker.map((round) => {
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
        console.log(this.roundsPicker);
    }
}
