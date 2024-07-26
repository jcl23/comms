import { UtilThrow } from "../../../../shared/enums/utility";

export default function(throwData: UtilThrow) {
    const { speed, doJump, doCrouch, throwType } = throwData;

    const throwDescription: string[] = [];
    
    let movement: string[] = [];
    if (doCrouch) movement.push("Crouch");
    if (speed == "Run") movement.push("Running");
    if (speed == "Walk") movement.push("Walking");

    throwDescription.push(movement.join("-"));

    if (throwType == "Left") throwDescription.push("Left-Click");
    if (throwType == "Middle") throwDescription.push("Left & Right-Click");
    if (throwType == "Right") throwDescription.push("Right-Click");

    if (doJump) throwDescription.push("Jump");
    throwDescription.push("Throw");

    return throwDescription.join(" ");
}