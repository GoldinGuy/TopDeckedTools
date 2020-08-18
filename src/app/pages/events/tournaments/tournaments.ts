import {
  Events, Result, Tournament, TournamentService
} from 'src/app/services/tournament.service.js';

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SMS } from '@ionic-native/sms/ngx';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-tournaments',
    templateUrl: 'tournaments.html',
    styleUrls: ['tournaments.scss'],
})
export class TournamentsPage {
    public tourney: Tournament;
    public events: Events;
    // bool variables that determine UI
    public displayStandings: boolean;
    public eventComplete: boolean;
    public expandedView: boolean;
    public timerDisplay: string;
    public timerOn: boolean;
    public timer: number;

    constructor(
        private router: Router,
        private storage: Storage,
        private route: ActivatedRoute,
        public alertController: AlertController,
        private sms: SMS,
        private tournamentService: TournamentService,
    ) {
        this.route.queryParams.subscribe(() => {
            console.log('starting tournament');
        });
        // dummy data
        this.tourney = {
            id: 'unknown',
            participants: [
                {
                    name: 'Jace',
                    phoneNumber: '43534543',
                    standing: null,
                    seed: 1,
                },
                {
                    name: 'Chandra',
                    phoneNumber: '3543536',
                    standing: null,
                    seed: 2,
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
        this.events = [this.tourney];
    }

    public async ionViewWillEnter() {
        try {
            this.events = await this.storage.get('events');
            if (this.events.length > 0) {
                this.tourney = this.events[0];
            }
        } catch (e) {
            console.log('Error. No tournaments found.');
        }
        // set UI state
        (this.displayStandings = false), (this.eventComplete = false), (this.timerOn = true);
        this.timer = 3000.0; // 50 minutes
        this.timerDisplay = (this.timer / 60).toString() + ':00';
        if (this.tourney.participants.length > 6) {
            this.expandedView = false;
        } else {
            this.expandedView = true;
        }
        // start new round
        this.startTimer();
        this.nextRound();
        // if tournament does not have enough players or rounds, end
        if (this.tourney.round.roundNum <= 0 || this.tourney.participants.length < 2) {
            this.tournamentService.saveTournament(this.events, this.storage);
            this.router.navigate(['/tabs/events']);
        }
    }

    public async ionViewWillLeave() {
        try {
            this.tournamentService.saveTournament(this.events, this.storage);
        } catch (e) {
            console.log(e);
            this.tourney.status = e;
        }
    }

    // handle button events, what they do, and whether they are disabled
    public nextRound() {
        if (
            this.tourney.round.roundNum >= this.tourney.totalRounds ||
            this.tourney.round.roundNum > 8
        ) {
            // display standings when event complete
            this.displayStandings = true;
            this.eventComplete = true;
        } else {
            // save results of current round, start new round
            this.tournamentService.setResults(this.tourney);
            this.tournamentService.getStandings(this.tourney);
            this.tourney.round = this.tournamentService.generateNextRound(this.tourney);
        }
    }

    public incrementScore(
        player1: {
            id: any;
            points: number;
            score: number;
        },
        player2: {
            id: any;
            points: number;
            score: number;
        },
    ) {
        if (player2.score < 2 || player1.score < 1) {
            player1.score += 1;
        } else {
            player2.score -= 1;
            player1.score += 1;
        }
        if (player1.score > 2 || player1.score < 0) {
            player1.score = 0;
        }
        // console.log(player1.score);
    }

    public endEvent = () => {
        this.tourney.status = 'complete';
        this.tournamentService.saveTournament(this.events, this.storage);
        this.router.navigate(['/tabs/events']);
    }

    reset() {
        try {
            this.tournamentService.saveTournament(this.events, this.storage);
        } catch (e) {
            console.log(e);
        }
        this.router.navigate(['/tabs/events']);
    }

    public textPairings() {
        this.tournamentService.sendPairings(this.tourney, this.sms);
    }

    public segmentChanged(ev: any) {
        if (ev.detail.value == 'standings') {
            this.displayStandings = true;
        } else {
            this.displayStandings = false;
        }
    }

    public async presentDetailedStandings(person: Result) {
        this.tournamentService.getDetailedStandings(person, this.alertController);
    }

    public manipulateTimer() {
        if (this.timerOn) {
            this.timerOn = false;
        } else {
            this.timerOn = true;
            this.startTimer();
        }
    }

    public async startTimer() {
        let minutes: string, seconds: string;
        const interval = setInterval(() => {
            if (this.timerOn) {
                if (this.timer > 0) {
                    this.timer--;
                }
                if (this.timer % 60 < 10) {
                    seconds = '0' + parseInt('' + (this.timer % 60));
                } else if (this.timer % 60 == 0) {
                    seconds = '00';
                } else {
                    seconds = '' + parseInt((this.timer % 60).toString());
                }
                if (this.timer / 60 < 10) {
                    minutes = '0' + parseInt('' + this.timer / 60, 10);
                } else {
                    minutes = '' + parseInt((this.timer / 60).toString(), 10);
                }

                if (parseInt(minutes) >= 60) {
                    minutes = parseInt('' + (parseInt(minutes) % 60)).toString();
                }
                this.timerDisplay = minutes + ':' + seconds;
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }
}
