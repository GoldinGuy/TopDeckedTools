import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Game } from 'src/app/services/life.service';
import { Storage } from '@ionic/storage';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'page-life',
    templateUrl: 'life.html',
    styleUrls: ['life.scss'],
})
export class LifePage {
    constructor(
        public loadingController: LoadingController,
        private router: Router,
        private storage: Storage,
        private route: ActivatedRoute
    ) {
        this.route.queryParamMap.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.activeGame = this.router.getCurrentNavigation().extras.state.activeGame;
            }
        });
        this.startingLife = 20;
        this.numPlayers = 2;
    }
    activeGame: Game;
    startingLife: number;
    numPlayers: number;

    async ionViewWillEnter() {
        if (isNullOrUndefined(this.activeGame)) {
            try {
                this.activeGame = await this.storage.get('activeGame');
                console.table(this.activeGame);
            } catch (e) {
                console.log('No game found: ' + e);
            }
        }
    }

    setNumPlayers(newPlayer: number) {
        this.numPlayers = newPlayer;
    }

    setLife(newLife: number) {
        this.startingLife = newLife;
    }

    async startGame(game?: Game) {
        if (isNullOrUndefined(game)) {
            let newGame: Game = {
                players: [],
                startingLife: this.startingLife,
                numPlayers: this.numPlayers,
                timer: 3000,
                pickFirstPlayer: false,
            };
            game = newGame;
        }
        let navigationExtras: NavigationExtras = {
            state: {
                game: game,
            },
        };
        this.router.navigate(['/lifeCounter'], navigationExtras);
    }
}
