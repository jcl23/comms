"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUIRED_THROW_PROPS = exports.isStrafeType = exports.isThrowType = exports.isSpeed = exports.isUtility = exports.StrafeType = exports.ThrowType = exports.Speed = exports.Utility = void 0;
var Utility;
(function (Utility) {
    Utility["Smoke"] = "Smoke";
    Utility["Flash"] = "Flash";
    Utility["Molotov"] = "Molotov";
    Utility["HE"] = "HE";
    Utility["Decoy"] = "Decoy";
})(Utility || (exports.Utility = Utility = {}));
;
var Speed;
(function (Speed) {
    Speed["Run"] = "Run";
    Speed["Walk"] = "Walk";
    Speed["Stand"] = "Stand";
})(Speed || (exports.Speed = Speed = {}));
;
var ThrowType;
(function (ThrowType) {
    ThrowType["Left"] = "Left";
    ThrowType["Middle"] = "Middle";
    ThrowType["Right"] = "Right";
})(ThrowType || (exports.ThrowType = ThrowType = {}));
var StrafeType;
(function (StrafeType) {
    StrafeType["Left"] = "Left";
    StrafeType["Right"] = "Right";
    StrafeType["None"] = "None";
})(StrafeType || (exports.StrafeType = StrafeType = {}));
const isUtility = (arg) => (Object.values(Utility).includes(arg));
exports.isUtility = isUtility;
const isSpeed = (arg) => (Object.values(Speed).includes(arg));
exports.isSpeed = isSpeed;
const isThrowType = (arg) => (Object.values(ThrowType).includes(arg));
exports.isThrowType = isThrowType;
const isStrafeType = (arg) => (Object.values(StrafeType).includes(arg));
exports.isStrafeType = isStrafeType;
exports.REQUIRED_THROW_PROPS = ["map", "team", "utility", "throwPosition", "throwAngle", "strafe", "speed", "doJump", "doCrouch", "throwType", "activePosition"];
