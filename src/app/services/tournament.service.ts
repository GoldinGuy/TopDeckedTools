export interface Tournament {
    id: string;
    participants: Array<TournamentPlayer>;
    matches: Array<Pairing>;
    round: TournamentRound;
    rounds: Array<TournamentRound>; // FIXME: Previous rounds, or is current round here as well?
    totalRounds: TotalRounds;
    standings: Array<Result>;
    status: string;
}

export interface TournamentPlayer {
    name: string;
    phoneNumber: string;
    standing: Result;
    seed: number;
    droppedOut?: boolean;
}

export interface TournamentRound {
    roundNum: number;
    pairings: Array<Pairing>;
}

export interface Result {
    id: string; // player name/id
    wins: number;
    losses: number;
    seed: number;
    tiebreaker: number;
    dtb: number;
    index?: number;
}

export interface Pairing {
    index: number;
    roundNum: number;
    home: {
        id: any;
        points: number;
        score: number;
    };
    bye?: boolean;
    away: {
        id: any;
        points: number;
        score: number;
    };
}

export type TotalRounds = number;
export type Events = Array<Tournament>;

import { Injectable } from '@angular/core';
import { SMS } from '@ionic-native/sms/ngx';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import swiss from './tournaments/swiss.js';

export interface ITournamentService {
    // methods that control the status of the tournament
    createTournament(players: Array<TournamentPlayer>, numRounds: number, id?: string): Tournament;
    saveTournament(tourneys: Events, storage: Storage): void;
    loadTournament(tourneys: Events, id: string): Tournament;
    generateNextRound(tourney: Tournament): TournamentRound;

    // methods that manipulate parts of the tournament
    createPlayer(
        pname: string,
        phone: string,
        seed: number,
        tourney?: Tournament,
    ): TournamentPlayer;
    removePlayer(tourney: Tournament, name: string): void;
    removeAllPlayers(tourney: Tournament): void;
    setResults(tourney: Tournament): void;

    // methods that gather and share data about the tournament
    sendPairings(tourney: Tournament, sms?: SMS, round?: TournamentRound): void;
    getCurrentRound(tourney: Tournament): TournamentRound;
    getStandings(tourney: Tournament): Array<Result>;
    getDetailedStandings(result: Result, alertController: AlertController): void;
}

@Injectable({ providedIn: 'root' })
export class TournamentService implements ITournamentService {
    public createTournament(players: Array<TournamentPlayer>, numRounds: number, id?: string): Tournament {
        const tourney: Tournament = {
            id: id ? null : Math.random().toString(36).substring(2, 15),
            participants: players,
            matches: [],
            round: {
                roundNum: 0,
                pairings: [],
            },
            rounds: [],
            totalRounds: numRounds,
            standings: null,
            status: 'No errors',
            // ui_settings: {
            //     timer: 3000,
            //     expanded_view: true ? players.length > 6 : false,
            // },
        };
        return tourney;
    }

    public async saveTournament(tourneys: Events, storage: Storage) {
        // TODO: save tournament to local storage/topdecked server
        // await storage.set('tournament', tourney);
        await storage.set('events', tourneys);
    }

    public loadTournament(tourneys: Events, id: string): Tournament {
        for (let i = 0; i < tourneys.length; i++) {
            if (tourneys[i].id === id) {
                return tourneys[i];
            }
        }
    }

    public generateNextRound(tourney: Tournament): TournamentRound {
        // create the next round with data based on last round
        const newRound: TournamentRound = {
            roundNum: tourney.round.roundNum + 1,
            pairings: tourney.round.pairings,
        };
        // if there are enough participants to play and rounds left
        if (!(newRound.roundNum < 1) && !(tourney.participants.length < 2)) {
            // console.log('pairings: ' + JSON.stringify(tourney.round.pairings));
            console.log('matches: ' + JSON.stringify(tourney.matches));

            // this.setResults(tourney);
            // get the new matchups based on results of previous matchups (uses Result.id to match)
            newRound.pairings = swiss.getMatchups(
                newRound.roundNum,
                tourney.participants,
                tourney.matches || [],
            );

            // map pairings data -- FIXME: is this necessary?
            newRound.pairings = newRound.pairings.map((pairing: Pairing, index: number) => {
                if (!pairing.away) {
                    return {
                        index,
                        roundNum: newRound.roundNum,
                        home: {
                            id: pairing.home,
                            points: 1,
                            score: 2,
                        },
                        bye: true,
                        away: {
                            id: pairing.away,
                            points: 0,
                            score: 0,
                        },
                    };
                }
                return {
                    index,
                    roundNum: newRound.roundNum,
                    home: {
                        id: pairing.home,
                        points: 0,
                        score: 0,
                    },
                    away: {
                        id: pairing.away,
                        points: 0,
                        score: 0,
                    },
                };
            });

            // console.log('next round: ' + newRound.roundNum);
            console.log('new pairings: ' + JSON.stringify(newRound.pairings));
            // set tournament round to the new round
            tourney.round = newRound;
            tourney.rounds.push(newRound);
            return newRound;
        }
    }

    public createPlayer(
        pname: string,
        phone: string,
        seed: number,
        tourney?: Tournament,
    ): TournamentPlayer {
        // create the new player based on the interface
        const player: TournamentPlayer = {
            name: pname,
            phoneNumber: phone,
            standing: null,
            seed,
        };
        // allows other classes to use this method to create a player without a valid tournament
        if (tourney != null && tourney != undefined) {
            tourney.participants.push(player);
            console.log('players: ' + JSON.stringify(tourney.participants));
        }
        return player;
    }

    public removePlayer(tourney: Tournament, name: string) {
        for (let i = 0; i < tourney.participants.length; i++) {
            if (tourney.participants[i].name === name) {
                tourney.participants.splice(i--, 1);
            }
        }
    }

    public removeAllPlayers(tourney: Tournament) {
        tourney.participants = [];
    }

    public setResults(tourney: Tournament) {
        const round = tourney.round;
        // for each set of pairings in the tournament, calculate how many points each participant earns
        for (let i = 0; i < round.pairings.length; i++) {
            if (round.pairings[i].home.score === round.pairings[i].away.score) {
                round.pairings[i].home.points = 0.5;
                round.pairings[i].away.points = 0.5;
            } else if (tourney.round.pairings[i].home.score > round.pairings[i].away.score) {
                round.pairings[i].home.points = 1;
                round.pairings[i].away.points = 0;
            } else {
                round.pairings[i].home.points = 0;
                round.pairings[i].away.points = 1;
            }
        }
        // add the last round partipants to matches to avoid getting identical pairings
        tourney.matches = (tourney.round.pairings || []).concat(tourney.matches || []);
        // this.getStandings(tourney);
    }

    public getStandings(tourney: Tournament): Array<Result> {
        // generate standings based on the current results
        tourney.standings = swiss.getStandings(
            tourney.totalRounds + 1,
            tourney.participants,
            tourney.matches,
        );

        const wins = {},
            differential = {},
            points = {};
        // for each result, determine data
        tourney.standings.forEach((result: Result) => {
            wins[result.id] = result.wins;
            differential[result.id] = 0;
            points[result.id] = 0;
        });

        console.log('wins: ' + JSON.stringify(wins));
        tourney.matches.forEach((match: Pairing) => {
            if (match.away.id && match.home.id) {
                differential[match.home.id] += 0 + wins[match.away.id];
                differential[match.away.id] += 0 + wins[match.home.id];
                points[match.home.id] += 0 + match.home.score;
                points[match.away.id] += 0 + match.away.score;
            } else {
                points[match.home.id] += 0 + 2;
            }
        });

        // determine standings for each participant
        tourney.standings = tourney.standings.map((result: Result) => {
            const newStandings: Result = {
                id: result.id,
                wins: result.wins,
                losses: result.losses,
                seed: 1 + tourney.standings.length - result.seed,
                tiebreaker: differential[result.id],
                dtb: points[result.id],
            };
            return newStandings;
        });
        // console.log('differential: ' + JSON.stringify(differential));

        // sort participants by current standings
        tourney.standings.sort((standing1: Result, standing2: Result) => {
            const val =
                10 * standing2.wins - standing2.losses - (10 * standing1.wins - standing1.losses);
            if (val != 0) {
                return val;
            } else if (standing2.tiebreaker - standing1.tiebreaker != 0) {
                return standing2.tiebreaker - standing1.tiebreaker;
            } else {
                return standing2.dtb - standing1.dtb;
            }
        });

        // set standings
        tourney.standings = tourney.standings.map((result: Result, index: number) => {
            return { ...result, index: index + 1 };
        });
        console.log('standings: ' + JSON.stringify(tourney.standings));

        return tourney.standings;
    }

    public async getDetailedStandings(result: Result, alertController: AlertController): Promise<void> {
        const alert = await alertController.create({
            header: result.id + '\'s record',
            message: `<p>Wins: ${result.wins}</p>
            <p>Losses: ${result.losses}</p>
            <p>Opponent Wins: ${result.tiebreaker}</p>
            <p>Points: ${result.dtb}</p>
            <p>Seed: ${result.seed}</p>`,
            buttons: ['OK'],
        });
        return await alert.present();
    }

    public async sendPairings(tourney: Tournament, sms?: SMS, round?: TournamentRound) {
        // sends current round pairings by default, with optional parameters
        const shareRound = round ? null : tourney.round;

        const participantRefactor = {};
        tourney.participants.forEach((participant: TournamentPlayer) => {
            participantRefactor[participant.name] = participant.phoneNumber;
        });

        const numbers = [];
        let string = shareRound.pairings.map((pairing: Pairing) => {
            numbers.push(participantRefactor[pairing.home.id]);
            numbers.push(participantRefactor[pairing.away.id]);

            return `${pairing.home.id} vs ${pairing.away.id}`;
        });
        const pairings = string.join('\n');
        const phoneNumbers = numbers.join(', ');

        if (sms != null) {
            // TODO: send pairings via topdecked messaging, right now instead it sends via sms
            try {
                sms.send(phoneNumbers, pairings);
            } catch (e) {
                tourney.status = e.message;
            }
        }
    }

    public getCurrentRound(tourney: Tournament): TournamentRound {
        return tourney.round;
    }
}
