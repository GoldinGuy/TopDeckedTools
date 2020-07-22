import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { SMS } from '@ionic-native/sms/ngx';

import {
    TournamentService,
    Tournament,
    TournamentPlayer,
    Pairing,
    Result,
} from 'src/app/services/tournament.service.js';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-tournaments',
    templateUrl: 'tournaments.html',
    styleUrls: ['tournaments.scss'],
})
export class TournamentsPage {
    tourney: Tournament;
    // bool variables that determine UI
    displayStandings: boolean;
    eventComplete: boolean;
    expandedView: boolean;
    timer: number;
    timerDisplay: string;
    timerOn: boolean;

    constructor(
        private router: Router,
        private storage: Storage,
        private route: ActivatedRoute,
        public alertController: AlertController,
        private sms: SMS,
        private tournamentService: TournamentService
    ) {
        this.route.queryParams.subscribe(() => {
            console.log('starting');
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
    }

    async ionViewWillEnter() {
        try {
            this.tourney = await this.storage.get('tournament');
        } catch (e) {
            console.log('Error. No tournament found.');
        }
        // UI state bools
        this.displayStandings = false;
        this.eventComplete = false;
        this.timer = 3000.0;
        this.timerDisplay = (this.timer / 60).toString() + ':00';
        this.timerOn = true;
        if (this.tourney.participants.length > 6) {
            this.expandedView = false;
        } else {
            this.expandedView = true;
        }

        this.startTimer();
        this.nextRound();
        if (this.tourney.round.roundNum <= 0 || this.tourney.participants.length < 2) {
            this.tourney.round.roundNum = 0;
            this.tournamentService.saveTournament(this.tourney, this.storage);
            this.router.navigate(['/tabs/events']);
        }
    }

    async ionViewWillLeave() {
        try {
            this.tournamentService.saveTournament(this.tourney, this.storage);
        } catch (e) {
            console.log(e);
            this.tourney.status = e;
        }
    }

    nextRound() {
        if (
            this.tourney.round.roundNum >= this.tourney.totalRounds ||
            this.tourney.round.roundNum > 8
        ) {
            this.displayStandings = true;
            this.eventComplete = true;
        } else {
            this.tournamentService.setResults(this.tourney);
            this.tournamentService.getStandings(this.tourney);
            this.tourney.round = this.tournamentService.generateNextRound(this.tourney);
        }
    }

    incrementScore(
        player1: {
            id: any;
            points: number;
            score: number;
        },
        player2: {
            id: any;
            points: number;
            score: number;
        }
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

    endEvent = () => {
        this.tourney.round.roundNum = 0;
        this.tournamentService.saveTournament(this.tourney, this.storage);
        this.router.navigate(['/tabs/events']);
    };

    reset() {
        this.tournamentService.saveTournament(
            {
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
            },
            this.storage
        );
        this.router.navigate(['/tabs/events']);
    }

    textPairings() {
        this.tournamentService.sendPairings(this.tourney, this.sms);
    }

    segmentChanged(ev: any) {
        if (ev.detail.value == 'standings') {
            this.displayStandings = true;
        } else {
            this.displayStandings = false;
        }
    }

    async presentDetailedStandings(person: Result) {
        this.tournamentService.getDetailedStandings(person, this.alertController);
    }

    manipulateTimer() {
        if (this.timerOn) {
            this.timerOn = false;
        } else {
            this.timerOn = true;
            this.startTimer();
        }
    }

    async startTimer() {
        var minutes: string, seconds: string;
        var interval = setInterval(() => {
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
