import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { isNullOrUndefined } from 'util';
import { Tournament, TournamentService } from 'src/app/services/tournament.service';

@Component({
    selector: 'app-events',
    templateUrl: 'events.html',
    styleUrls: ['events.scss'],
})
export class EventsPage {
    tourney: Tournament;
    // temporary UI fields
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
    ) {
        this.tourney = {
            id: 'unknown',
            participants: [
                {
                    name: 'bob',
                    phoneNumber: '43534543',
                    standing: null,
                    seed: 1,
                },
                {
                    name: 'joe',
                    phoneNumber: '3543536',
                    standing: null,
                    seed: 2,
                },
                {
                    name: 'sue',
                    phoneNumber: '86767876',
                    standing: null,
                    seed: 3,
                },
            ],
            matches: [],
            totalRounds: 4,
            round: {
                roundNum: 1,
                pairings: [],
            },
            rounds: [],
            standings: null,
            status: 'Unknown',
        };
    }

    async ionViewWillEnter() {
        try {
            this.tourney = await this.storage.get('tournament');
            if (this.tourney.totalRounds <= 0) {
                this.tourney.totalRounds = 4;
            }
        } catch (e) {
            console.log('Error. No tournament found. Creating new tournament.');
            this.tourney = this.tournamentService.createTournament([], 4);
        }
        if (isNullOrUndefined(this.tourney.participants)) {
            this.tourney.participants = [];
        }

        if (this.tourney.round.roundNum != 0) {
            this.router.navigate(['/tabs/events/tournaments']);
        }
    }

    async startEvent() {
        if (this.tourney.participants.length < 2) {
            return;
        }

        this.tournamentService.saveTournament(this.tourney, this.storage);
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
        this.tournamentService.createPlayer(
            this.name,
            this.phoneNumber,
            this.tourney.participants.length + 1,
            this.tourney
        );

        this.name = '';
        this.phoneNumber = '';

        console.log(this.tourney.participants);
    };

    remove = async (name: string) => {
        this.tournamentService.removePlayer(this.tourney, name);
    };

    removeAll = async () => {
        this.tournamentService.removeAllPlayers(this.tourney);
    };

    // handle button events and whether they are disbaled
    segmentButtonClicked(ev: any) {
        this.tourney.totalRounds = ev.target.value;
        this.roundsPicker = this.roundsPicker.map((round) => {
            if (round.val == ev.target.value) {
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

    isDisabled() {
        if (this.tourney.participants.length < 1) {
            return true;
        } else {
            return false;
        }
    }

    isButtonDisabled() {
        if (this.tourney.participants.length < 2) {
            return true;
        } else {
            return false;
        }
    }
}
