// import { Component } from "@angular/core";
// import { NavController } from "@ionic/angular";
// // import { TournamentsService } from "../../services/tournaments.service";

// @Component({
// 	selector: "page-tournaments",
// 	templateUrl: "tournaments.html",
// 	styleUrls: ["tournaments.scss"]
// 	// providers: [TournamentsService]
// })
// export class TournamentsPage {
// 	posts: any = [];
// 	title: any = "Tournaments";

// 	constructor(
// 		public navCtrl: NavController // private tournamentsService: TournamentsService
// 	) {
// 		// this.loadTournamentss();
// 	}
// }

import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { SMS } from '@ionic-native/sms/ngx';

import swiss from './swiss.js';

@Component({
    selector: 'app-tournaments',
    templateUrl: 'tournaments.html',
    styleUrls: ['tournaments.scss']
})
export class TournamentsPage {
    constructor(
        private router: Router,
        private storage: Storage,
        private route: ActivatedRoute,
        private sms: SMS
    ) {
        this.route.queryParams.subscribe(params => {
            console.log('starting');
            if (this.router.getCurrentNavigation().extras.state) {
                this.newTournament = this.router.getCurrentNavigation().extras.state.new;
            }
        });
    }

    participants;
    matches;
    pairings;
    round;
    totalRounds;
    newTournament;
    status = 'No Errors';

    async ionViewWillEnter() {
        try {
            this.participants = await this.storage.get('participants');
            this.pairings = await this.storage.get('pairings');
            this.round = await this.storage.get('round');
            this.totalRounds = await this.storage.get('totalRounds');
            console.log('Total Rounds', this.totalRounds);
            this.matches = await this.storage.get('matches');
        } catch (e) {
            console.log('Error');
        }

        if (this.round < 1 || this.participants.length < 2) {
            await this.storage.set('round', 0);
            this.router.navigate(['/tabs/events']);
        }

        if (this.newTournament) {
            this.matches = [];
            this.pairings = [];
            this.generatePairings();
        }
        console.log('Matches');
    }

    async ionViewWillLeave() {
        try {
            await this.storage.set('matches', this.matches);
            await this.storage.set('pairings', this.pairings);
            await this.storage.set('round', this.round);
            await this.storage.set('participants', this.participants);
        } catch (e) {
            console.log(e);
        }
    }

    textPairings() {
        console.log(this.pairings);
        let participantRefactor = {};
        this.participants.forEach(participant => {
            participantRefactor[participant.id] = participant.phoneNumber;
        });

        let numbers = [];
        let string = this.pairings.map(pairing => {
            numbers.push(participantRefactor[pairing.home.id]);
            numbers.push(participantRefactor[pairing.away.id]);

            return `${pairing.home.id} vs ${pairing.away.id}`;
        });
        let pairings = string.join('\n');
        let phoneNumbers = numbers.join(', ');

        console.log(pairings);
        console.log(phoneNumbers);

        try {
            this.sms.send(phoneNumbers, pairings);
        } catch (e) {
            this.status = e.message;
        }
    }

    nextRound() {
        this.round++;
        this.generatePairings();
    }

    async generatePairings() {
        console.log(this.round);
        console.log(this.totalRounds);
        for (let i = 0; i < this.pairings.length; i++) {
            if (this.pairings[i].home.score == this.pairings[i].away.score) {
                this.pairings[i].home.points = 0.5;
                this.pairings[i].away.points = 0.5;
            } else if (this.pairings[i].home.score > this.pairings[i].away.score) {
                this.pairings[i].home.points = 1;
                this.pairings[i].away.points = 0;
            } else {
                this.pairings[i].home.points = 0;
                this.pairings[i].away.points = 1;
            }
            this.pairings[i].home.score = parseInt(this.pairings[i].home.score);
            this.pairings[i].away.score = parseInt(this.pairings[i].away.score);
        }

        this.matches = (this.pairings || []).concat(this.matches || []);

        if (this.round > this.totalRounds || this.round > 8) {
            await this.storage.set('matches', this.matches);
            this.endEvent();
        }

        // console.log(this.round);
        // console.log(this.matches);
        this.pairings = swiss.getMatchups(this.round, this.participants, this.matches || []);

        this.pairings = this.pairings.map((pairing, index) => {
            if (!pairing.away) {
                return {
                    index,
                    round: this.round,
                    home: {
                        id: pairing.home,
                        points: 1,
                        score: 2
                    },
                    bye: true,
                    away: {
                        id: pairing.away,
                        points: 0,
                        score: 0
                    }
                };
            }
            return {
                index,
                round: this.round,
                home: {
                    id: pairing.home,
                    points: 0,
                    score: 0
                },
                away: {
                    id: pairing.away,
                    points: 0,
                    score: 0
                }
            };
        });

        console.log(this.pairings);
    }

    endEvent = () => {
        this.round = 0;
        this.router.navigate(['/tabs/events/standings']);
    };
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
