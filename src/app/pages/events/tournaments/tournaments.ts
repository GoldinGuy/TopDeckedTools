import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { SMS } from '@ionic-native/sms/ngx';

import {
    TournamentService,
    Tournament,
    TournamentPlayer,
    Pairing,
} from 'src/app/services/tournament.service.js';

@Component({
    selector: 'app-tournaments',
    templateUrl: 'tournaments.html',
    styleUrls: ['tournaments.scss'],
})
export class TournamentsPage {
    tourney: Tournament;
    newTournament: boolean;

    constructor(
        private router: Router,
        private storage: Storage,
        private route: ActivatedRoute,
        private sms: SMS,
        private tournamentService: TournamentService
    ) {
        this.route.queryParams.subscribe((params) => {
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
        } catch (e) {
            console.log('Error. No tournament found.');
        }

        this.tourney.round = this.tournamentService.generateNextRound(this.tourney);

        if (this.tourney.round.roundNum <= 0 || this.tourney.participants.length < 2) {
            this.tourney.round.roundNum = 0;
            this.storage.set('tournament', this.tourney);
            this.router.navigate(['/tabs/events']);
        }

        if (this.newTournament) {
            this.tourney.status = 'no errors; newly created';
        }
    }

    async ionViewWillLeave() {
        try {
            await this.storage.set('tournament', this.tourney);
        } catch (e) {
            console.log(e);
        }
    }

    nextRound() {
        this.tourney.standings = this.tournamentService.setResults(this.tourney);
        if (
            this.tourney.round.roundNum >= this.tourney.totalRounds ||
            this.tourney.round.roundNum > 8
        ) {
            this.endEvent();
        } else {
            this.tourney.round = this.tournamentService.generateNextRound(this.tourney);
        }
    }

    endEvent = () => {
        this.tourney.round.roundNum = 0;
        this.storage.set('tournament', this.tourney);
        this.router.navigate(['/tabs/events/standings']);
    };

    textPairings() {
        this.tournamentService.sendPairings(this.tourney, this.sms);
    }
}

// async generatePairings() {
//     console.log(this.round);
//     console.log(this.totalRounds);
//     for (let i = 0; i < this.pairings.length; i++) {
//         if (this.pairings[i].home.score == this.pairings[i].away.score) {
//             this.pairings[i].home.points = 0.5;
//             this.pairings[i].away.points = 0.5;
//         } else if (this.pairings[i].home.score > this.pairings[i].away.score) {
//             this.pairings[i].home.points = 1;
//             this.pairings[i].away.points = 0;
//         } else {
//             this.pairings[i].home.points = 0;
//             this.pairings[i].away.points = 1;
//         }
//         this.pairings[i].home.score = parseInt(this.pairings[i].home.score);
//         this.pairings[i].away.score = parseInt(this.pairings[i].away.score);
//     }

//     this.matches = (this.pairings || []).concat(this.matches || []);

//     if (this.round > this.totalRounds || this.round > 8) {
//         await this.storage.set('matches', this.matches);
//         this.endEvent();
//     }

//     // console.log(this.round);
//     // console.log(this.matches);
//     this.pairings = swiss.getMatchups(this.round, this.participants, this.matches || []);

//     this.pairings = this.pairings.map((pairing, index) => {
//         if (!pairing.away) {
//             return {
//                 index,
//                 round: this.round,
//                 home: {
//                     id: pairing.home,
//                     points: 1,
//                     score: 2,
//                 },
//                 bye: true,
//                 away: {
//                     id: pairing.away,
//                     points: 0,
//                     score: 0,
//                 },
//             };
//         }
//         return {
//             index,
//             round: this.round,
//             home: {
//                 id: pairing.home,
//                 points: 0,
//                 score: 0,
//             },
//             away: {
//                 id: pairing.away,
//                 points: 0,
//                 score: 0,
//             },
//         };
//     });

//     console.log(this.pairings);
// }

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
