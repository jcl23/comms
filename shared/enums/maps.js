"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMapName = exports.MapName = void 0;
//export type MapName = "Dust 2" | "Mirage" | "Inferno" | "Nuke" | "Vertigo" | "Ancient" | "Anubis";
var MapName;
(function (MapName) {
    MapName["Dust2"] = "Dust 2";
    MapName["Mirage"] = "Mirage";
    MapName["Inferno"] = "Inferno";
    MapName["Nuke"] = "Nuke";
    MapName["Vertigo"] = "Vertigo";
    MapName["Ancient"] = "Ancient";
    MapName["Anubis"] = "Anubis";
})(MapName || (exports.MapName = MapName = {}));
const isMapName = (arg) => (Object.values(MapName).includes(arg));
exports.isMapName = isMapName;
