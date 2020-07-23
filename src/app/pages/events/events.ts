import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { isNullOrUndefined } from 'util';
import {
    Tournament,
    TournamentService,
    TournamentPlayer,
    Events,
} from 'src/app/services/tournament.service';

@Component({
    selector: 'app-events',
    templateUrl: 'events.html',
    styleUrls: ['events.scss'],
})
export class EventsPage {
    tourney: Tournament;
    events: Events;
    lastUsedPlayers: Array<TournamentPlayer>;
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
            participants: [],
            matches: [],
            totalRounds: 4,
            round: {
                roundNum: 0,
                pairings: [],
            },
            rounds: [],
            standings: null,
            status: 'Unknown',
        };
        this.events = [this.tourney];
    }

    async ionViewWillEnter() {
        this.lastUsedPlayers = [];
        try {
            this.events = await this.storage.get('events');
            console.log('events: ' + JSON.stringify(this.events));
            if (this.events.length > 0) {
                this.tourney = this.events[0];
                if (this.tourney.totalRounds <= 0) {
                    this.tourney.totalRounds = 4;
                }
                if (isNullOrUndefined(this.tourney.participants)) {
                    this.tourney.participants = [];
                }
                if (
                    this.tourney.round.roundNum >= this.tourney.totalRounds ||
                    isNullOrUndefined(this.tourney)
                ) {
                    for (var i = 0; i < this.tourney.participants.length; i++) {
                        var play = this.tournamentService.createPlayer(
                            this.tourney.participants[i].name,
                            this.tourney.participants[i].phoneNumber,
                            this.lastUsedPlayers.length + 1,
                            null
                        );
                        this.lastUsedPlayers.push(play);
                        // console.log(JSON.stringify(this.lastUsedPlayers));
                    }
                    this.tourney = this.tournamentService.createTournament([], 4);
                    this.events.unshift(this.tourney);
                }
            }
        } catch (e) {
            console.log('Error. No tournaments found. Creating new tournament.');
            this.events = [];
            this.tourney = this.tournamentService.createTournament([], 4);
            this.events.unshift(this.tourney);
        }
        if (this.tourney.round.roundNum != 0) {
            this.router.navigate(['/tabs/events/tournaments']);
        }
    }

    // handle button events, what they do, and whether they are disabled
    async startEvent() {
        if (this.tourney.participants.length < 2) {
            return;
        }
        this.tournamentService.saveTournament(this.events, this.storage);
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

        console.log(JSON.stringify(this.tourney.participants));
    };

    remove = async (name: string) => {
        this.tournamentService.removePlayer(this.tourney, name);
    };

    removeAll = async () => {
        this.tournamentService.removeAllPlayers(this.tourney);
    };

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
