"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        required: true,
        enum: [
            'normal',
            'overthrow',
            'bye',
            'bye_overthrow',
            'legbye',
            'legbye_overthrow',
            'noball',
            'noball_overthrow',
            'noball_bye',
            'noball_bye_overthrow',
            'noball_legbye',
            'noball_legbye_overthrow',
            'wide',
            'wide_overthrow',
            'wide_bye',
            'wide_bye_overthrow',
            'wide_legbye',
            'wide_legbye_overthrow',
            'wicket'
        ]
    },
    runs: { type: Number, default: 0 },
    extras: {
        wide: { type: Number, default: 0 },
        noBall: { type: Number, default: 0 },
        bye: { type: Number, default: 0 },
        legBye: { type: Number, default: 0 },
        overthrow: { type: Number, default: 0 }
    },
    batsman: String,
    bowler: String,
    isWicket: { type: Boolean, default: false }
}, { timestamps: true });
const matchSchema = new mongoose_1.default.Schema({
    teamA: String,
    teamB: String,
    currentInning: Number,
    overs: Number,
    events: [eventSchema],
    stats: {
        batsman: {
            type: Map,
            of: {
                runs: Number,
                balls: Number
            }
        },
        bowler: {
            type: Map,
            of: {
                runsConceded: Number,
                ballsBowled: Number
            }
        },
        extras: {
            wide: Number,
            noBall: Number,
            bye: Number,
            legBye: Number
        },
        totalRuns: Number,
        totalWickets: Number
    }
});
exports.default = mongoose_1.default.model('Match', matchSchema);
