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
    newTournament: boolean;
    displayStandings: boolean;
    eventComplete: boolean;
    expandedView: boolean;

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
            if (this.router.getCurrentNavigation().extras.state) {
                this.newTournament = this.router.getCurrentNavigation().extras.state.new;
            }
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
        if (this.tourney.participants.length > 6) {
            this.expandedView = true;
        } else {
            this.expandedView = true;
        }
        if (this.newTournament) {
            this.tourney.status = 'newly created';
        }
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
            // if (!this.newTournament) {
            this.tournamentService.setResults(this.tourney);
            this.tournamentService.getStandings(this.tourney);
            // }
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
            // if (player1.score > 2) {
            //     player1.score = 0;
            // }
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
}

// // An asynchronous timer
// function startCountDown(seconds) {
// 	var counter = seconds;
// 	var interval = setInterval(() => {
// 		console.log(counter);
// 		counter--;
// 		if (counter < 0) {
// 			// code here will run when the counter reaches zero.

// 			clearInterval(interval);
// 			console.log("Ding!");
// 		}
// 	}, 1000);
// }

// startCountDown(10);
