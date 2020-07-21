//www.npmjs.com/package/swiss-pairing

https: const blossom = require('./blossom');

const options = {
    maxPerRound: 3,
    rematchWeight: 100,
    standingPower: 2,
    seedMultiplier: 6781,
};

function getModifiedMedianScores(options, round, participants, matches) {
    matches = matches.filter((match) => match.roundNum < round);
    var mappings = getMappings(participants, matches);
    var points = mappings.reduce((acc, val) => {
        acc[val.id] = val.points;
        return acc;
    }, {});
    var scores = mappings.reduce(
        (acc, history) => {
            history.opponents.forEach((opponent) => {
                // Doesn't calculate points for opponents with byes
                if (opponent) {
                    acc[opponent].scores.push(history.points);
                    acc[opponent].points += history.points;
                }
            });
            return acc;
        },
        participants.reduce((acc, participant) => {
            acc[participant.name] = {
                scores: [],
                points: 0,
            };
            return acc;
        }, {})
    );
    var fifty = ((round - 1) * options.maxPerRound) / 2;
    return Object.entries(scores).reduce((acc, [key, value]) => {
        value.scores.sort((a, b) => a - b);
        if (points[key] > fifty) {
            value.scores.shift();
        } else if (points[key] < fifty) {
            value.scores.pop();
        }
        acc[key] = value.scores.reduce((acc, val) => acc + val, 0);
        return acc;
    }, {});
}

function getStandings(options, round, participants, matches) {
    matches = matches.filter((match) => match.roundNum < round);
    var scores = getModifiedMedianScores(options, round, participants, matches);
    var standings = participants.reduce((standings, participant) => {
        standings[participant.name] = {
            seed: participant.seed,
            wins: 0,
            losses: 0,
            tiebreaker: scores[participant.name],
        };
        return standings;
    }, {});
    matches.forEach((match) => {
        standings[match.home.id].wins += match.home.points;
        standings[match.home.id].losses += match.away.points;
        // Ignore opponents with byes
        if (match.away.id) {
            standings[match.away.id].wins += match.away.points;
            standings[match.away.id].losses += match.home.points;
        }
    });
    return Object.entries(standings)
        .reduce((standings, [key, value]) => {
            standings.push({
                id: key,
                seed: value.seed,
                wins: value.wins,
                losses: value.losses,
                tiebreaker: value.tiebreaker,
            });
            return standings;
        }, [])
        .sort((a, b) => {
            if (a.wins === b.wins) {
                if (a.tiebreaker === b.tiebreaker) {
                    return b.seed - a.seed;
                } else {
                    return b.tiebreaker - a.tiebreaker;
                }
            } else {
                return b.wins - a.wins;
            }
        });
}

function getMatchups(options, round, participants, matches) {
    matches = matches.filter((match) => match.roundNum < round);
    var mappings = getMappings(participants, matches);

    // ids are strings but the blossom algorithm needs integers - create maps from int-to-id then set the ids to integers
    var mapIds = new Map();
    var index = 0;
    for (var m of mappings) {
        mapIds.set(index, m.id);
        m.id = index++;
    }

    mappings = mappings.filter((m) => !m.droppedOut);

    if (mappings.length % 2 === 1) {
        mappings.push({
            id: index,
            points: 0,
            seed: 0,
            tiebreaker: 0,
            opponents: mappings
                .filter((m) => {
                    return m.opponents.filter((o) => o === null).length > 0;
                })
                .map((m) => mapIds.get(m.id)),
        });
        mapIds.set(index, null);
    }
    // avoid repeatedly matching the same pairing up or down repeatedly
    // shuffle the inputs to the blossom algorithm to counteract any ordering biases
    mappings = shuffle(mappings, round, options.seedMultiplier);
    var arr = mappings.reduce((arr, team, i, orig) => {
        var opps = orig.slice(0, i).concat(orig.slice(i + 1));
        for (var opp of opps) {
            arr.push([
                team.id,
                opp.id,
                -1 *
                    (Math.pow(team.points - opp.points, options.standingPower) +
                        options.rematchWeight *
                            team.opponents.reduce((n, o) => {
                                return n + (o === mapIds.get(opp.id));
                            }, 0)),
            ]);
        }
        return arr;
    }, []);

    var results = blossom(arr, true);
    var matchups = [];
    // sort matchups by standings so they follow roughly the same order
    var standings = getStandings(options, round, participants, matches);
    var sortedKeys = [...mapIds.keys()].sort((a, b) => {
        if (mapIds.get(a) === null) {
            return 1;
        } else if (mapIds.get(b) === null) {
            return -1;
        }
        return (
            standings.findIndex((s) => s.id === mapIds.get(a)) -
            standings.findIndex((s) => s.id === mapIds.get(b))
        );
    });
    for (var i of sortedKeys) {
        if (
            results[i] !== -1 &&
            !matchups.reduce((n, r) => n || r.home === mapIds.get(results[i]), false)
        ) {
            matchups.push({
                home: mapIds.get(i),
                away: mapIds.get(results[i]),
            });
        }
    }
    return matchups;
}

function getMappings(participants, matches) {
    return participants.reduce((acc, participant) => {
        acc.push(
            matches
                .filter((match) => {
                    return match.home.id === participant.name || match.away.id === participant.name;
                })
                .reduce(
                    (acc, match) => {
                        if (match.home.id === participant.name) {
                            acc.points += match.home.points;
                            acc.opponents.push(match.away.id);
                        } else if (match.away.id === participant.name) {
                            acc.points += match.away.points;
                            acc.opponents.push(match.home.id);
                        }
                        return acc;
                    },
                    {
                        id: participant.name,
                        seed: participant.seed,
                        droppedOut: participant.droppedOut,
                        points: 0,
                        opponents: [],
                    }
                )
        );
        return acc;
    }, []);
}

// Knuth shuffle from stack overflow
function shuffle(array, seed, multiplier) {
    var currentIndex = array.length;

    // fast, seeded PRNG from stackoverflow
    var s = seed;
    const random = () => {
        var x = (Math.abs((((s++ * multiplier) / Math.PI) % 4) - 2) - 1) * 10000;
        return x - Math.floor(x);
    };

    while (0 !== currentIndex) {
        var randomIndex = Math.floor(random() * currentIndex--);
        var temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

module.exports = {
    getModifiedMedianScores: getModifiedMedianScores.bind(null, options),
    getStandings: getStandings.bind(null, options),
    getMatchups: getMatchups.bind(null, options),
    getMappings,
};
