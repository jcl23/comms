"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTeam = exports.Team = void 0;
var Team;
(function (Team) {
    Team["T"] = "T";
    Team["CT"] = "CT";
    Team["Any"] = "Any";
})(Team || (exports.Team = Team = {}));
const isTeam = (arg) => (Object.values(Team).includes(arg));
exports.isTeam = isTeam;
