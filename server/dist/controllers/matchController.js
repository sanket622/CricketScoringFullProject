"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatch = exports.addEvent = void 0;
const Match_1 = __importDefault(require("../models/Match"));
const updateStats = (match, event) => {
    const { batsman, bowler, runs, extras, isWicket, type } = event;
    // Initialize stats if needed
    match.stats = match.stats || {
        batsman: new Map(),
        bowler: new Map(),
        extras: { wide: 0, noBall: 0, bye: 0, legBye: 0 },
        totalRuns: 0,
        totalWickets: 0
    };
    const batsmanStats = match.stats.batsman.get(batsman) || { runs: 0, balls: 0 };
    const bowlerStats = match.stats.bowler.get(bowler) || { runsConceded: 0, ballsBowled: 0 };
    const totalExtras = Object.values(extras).reduce((sum, val) => sum + val, 0);
    // Update based on type
    if (type.includes('wide')) {
        match.stats.extras.wide += totalExtras;
        bowlerStats.runsConceded += 1; // Only 1 legal delivery
        match.stats.totalRuns += runs;
    }
    else if (type.includes('noball') && type.includes('bye')) {
        batsmanStats.balls += 1;
        match.stats.extras.noBall += 1;
        match.stats.extras.bye += extras.bye;
        bowlerStats.runsConceded += 1;
        match.stats.totalRuns += runs;
    }
    else if (type.includes('noball') && type.includes('legbye')) {
        batsmanStats.balls += 1;
        match.stats.extras.noBall += 1;
        match.stats.extras.legBye += extras.legBye;
        bowlerStats.runsConceded += 1;
        match.stats.totalRuns += runs;
    }
    else if (type.includes('noball')) {
        batsmanStats.balls += 1;
        batsmanStats.runs += runs - 1;
        bowlerStats.runsConceded += runs;
        match.stats.extras.noBall += 1;
        match.stats.totalRuns += runs;
    }
    else if (type.includes('bye')) {
        match.stats.extras.bye += extras.bye;
        match.stats.totalRuns += runs;
    }
    else if (type.includes('legbye')) {
        match.stats.extras.legBye += extras.legBye;
        match.stats.totalRuns += runs;
    }
    else {
        batsmanStats.runs += runs;
        batsmanStats.balls += 1;
        bowlerStats.ballsBowled += 1;
        bowlerStats.runsConceded += runs;
        match.stats.totalRuns += runs;
    }
    if (isWicket)
        match.stats.totalWickets += 1;
    match.stats.batsman.set(batsman, batsmanStats);
    match.stats.bowler.set(bowler, bowlerStats);
};
const addEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { matchId, event } = req.body;
        const match = yield Match_1.default.findById(matchId);
        if (!match)
            return res.status(404).json({ message: 'Match not found' });
        match.events.push(event);
        updateStats(match, event);
        yield match.save();
        res.status(200).json(match);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.addEvent = addEvent;
const getMatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const match = yield Match_1.default.findById(req.params.id);
        if (!match)
            return res.status(404).json({ message: 'Match not found' });
        res.status(200).json(match);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getMatch = getMatch;
