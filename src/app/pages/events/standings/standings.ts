import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { SMS } from '@ionic-native/sms/ngx';

@Component({
    selector: 'app-standings',
    templateUrl: 'standings.html',
    styleUrls: ['standings.scss'],
})
export class standingsPage {
    constructor(
        private router: Router,
        private storage: Storage,
        private route: ActivatedRoute,
        // private sms: SMS,
        public alertController: AlertController
    ) {}

    participants;
    matches;
    standing;
    totalRounds;
    results;

    async ionViewWillEnter() {}

    back() {
        console.log('Going Back');
        this.router.navigate(['/tabs/events']);
    }

    async presentAlertLongMessage(person) {
        const alert = await this.alertController.create({
            header: 'Record',
            message:
                'Game Wins: ' +
                person.wins +
                '\n Game Losses: ' +
                person.losses +
                '\n Opponent Wins: ' +
                person.tb +
                '\n Points: ' +
                person.dtb,
            buttons: ['DONE'],
        });
        return await alert.present();
    }

    // async showModal() {
    // 	const modal = await this.modalCtrl.create({
    // 		component: advancedPage,
    // 		componentProps: {
    // 			data: 5
    // 		}
    // 	});
    // 	await modal.present();
    // 	modal.onDidDismiss().then(res => alert(JSON.stringify(res)));
    // }

    // try {
    //     this.participants = await this.storage.get('participants');
    //     this.totalRounds = await this.storage.get('totalRounds');
    //     this.matches = await this.storage.get('matches');
    //     console.log(this.participants);
    //     this.results = swiss.getStandings(
    //         this.totalRounds + 1,
    //         this.participants,
    //         this.matches
    //     );

    //     console.log(this.totalRounds);
    //     console.log(this.matches);

    //     let wins = {};
    //     let differential = {};
    //     let points = {};

    //     this.results.forEach((result) => {
    //         wins[result.id] = result.wins;
    //         differential[result.id] = 0;
    //         points[result.id] = 0;
    //     });

    //     console.log(wins);
    //     this.matches.forEach((match) => {
    //         if (match.away.id && match.home.id) {
    //             differential[match.home.id] += 0 + wins[match.away.id];
    //             differential[match.away.id] += 0 + wins[match.home.id];
    //             points[match.home.id] += 0 + match.home.score;
    //             points[match.away.id] += 0 + match.away.score;
    //         } else {
    //             points[match.home.id] += 0 + 2;
    //         }
    //     });

    //     this.results = this.results.map((result) => {
    //         return {
    //             id: result.id,
    //             wins: result.wins,
    //             losses: result.losses,
    //             seed: 1 + this.results.length - result.seed,
    //             tb: differential[result.id],
    //             dtb: points[result.id],
    //         };
    //     });

    //     console.log(differential);

    //     this.results.sort((a, b) => {
    //         let value = 10 * b.wins - b.losses - (10 * a.wins - a.losses);
    //         if (value != 0) {
    //             return value;
    //         } else if (b.tb - a.tb != 0) {
    //             return b.tb - a.tb;
    //         } else {
    //             return b.dtb - a.dtb;
    //         }
    //     });

    //     console.log(this.results);

    //     this.results = this.results.map((result, index) => {
    //         return { ...result, index: index + 1 };
    //     });

    //     console.log(this.results);
    // } catch (e) {
    //     console.log(e);
    // }

    // shareStandings() {
    // 	let participantRefactor = {};
    // 	this.participants.forEach(participant => {
    // 		participantRefactor[participant.id] = participant.phoneNumber;
    // 	});

    // 	let numbers = [];
    // 	let string = this.results.map(result => {
    // 		numbers.push(participantRefactor[result.id]);

    // 		return `${result.seed} | ${result.id} | Rounds Won: ${result.wins}`;
    // 	});
    // 	let res = string.join("\n");
    // 	let phoneNumbers = numbers.join(", ");

    // 	this.sms.send(phoneNumbers, res);
    // }
}
