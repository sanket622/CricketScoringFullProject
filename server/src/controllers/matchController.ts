import Match from '../models/Match';
import { Request, Response } from 'express';

const updateStats = (match: any, event: any) => {
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

  const totalExtras = (Object.values(extras) as number[]).reduce((sum, val) => sum + val, 0);

  // Update based on type
  if (type.includes('wide')) {
    match.stats.extras.wide += totalExtras;
    bowlerStats.runsConceded += 1; // Only 1 legal delivery
    match.stats.totalRuns += runs;
  } else if (type.includes('noball') && type.includes('bye')) {
    batsmanStats.balls += 1;
    match.stats.extras.noBall += 1;
    match.stats.extras.bye += extras.bye;
    bowlerStats.runsConceded += 1;
    match.stats.totalRuns += runs;
  } else if (type.includes('noball') && type.includes('legbye')) {
    batsmanStats.balls += 1;
    match.stats.extras.noBall += 1;
    match.stats.extras.legBye += extras.legBye;
    bowlerStats.runsConceded += 1;
    match.stats.totalRuns += runs;
  } else if (type.includes('noball')) {
    batsmanStats.balls += 1;
    batsmanStats.runs += runs - 1;
    bowlerStats.runsConceded += runs;
    match.stats.extras.noBall += 1;
    match.stats.totalRuns += runs;
  } else if (type.includes('bye')) {
    match.stats.extras.bye += extras.bye;
    match.stats.totalRuns += runs;
  } else if (type.includes('legbye')) {
    match.stats.extras.legBye += extras.legBye;
    match.stats.totalRuns += runs;
  } else {
    batsmanStats.runs += runs;
    batsmanStats.balls += 1;
    bowlerStats.ballsBowled += 1;
    bowlerStats.runsConceded += runs;
    match.stats.totalRuns += runs;
  }

  if (isWicket) match.stats.totalWickets += 1;

  match.stats.batsman.set(batsman, batsmanStats);
  match.stats.bowler.set(bowler, bowlerStats);
};

export const addEvent = async (req: Request, res: Response) => {
  try {
    const { matchId, event } = req.body;
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    match.events.push(event);
    updateStats(match, event);

    await match.save();
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMatch = async (req: Request, res: Response) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createMatch = async (req: Request, res: Response) => {
  try {
    const { teamA, teamB, overs } = req.body;

    const match = new Match({
      teamA,
      teamB,
      overs,
      currentInning: 1,
      events: [],
      stats: {
        batsman: {},
        bowler: {},
        extras: {
          wide: 0,
          noBall: 0,
          bye: 0,
          legBye: 0
        },
        totalRuns: 0,
        totalWickets: 0
      }
    });

    await match.save();
    res.status(201).json({ message: 'Match created', match });
  } catch (error) {
    res.status(500).json({ message: 'Error creating match', error });
  }
};

export const undoEvent = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findById(matchId);

    if (!match) return res.status(404).json({ message: 'Match not found' });
    if (match.events.length === 0)
      return res.status(400).json({ message: 'No events to undo' });

    // Remove the last event
    match.events.pop();

    // TODO: Recalculate stats from scratch
    match.stats = {
      batsman: new Map(),
      bowler: new Map(),
      extras: {
        wide: 0,
        noBall: 0,
        bye: 0,
        legBye: 0
      },
      totalRuns: 0,
      totalWickets: 0
    };

    for (const event of match.events) {
      updateStats(match, event); // reuse existing function
    }

    await match.save();
    res.status(200).json({ message: 'Last event undone', match });
  } catch (error) {
    res.status(500).json({ message: 'Error undoing event', error });
  }
};

