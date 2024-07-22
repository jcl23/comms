//export type MapName = "Dust 2" | "Mirage" | "Inferno" | "Nuke" | "Vertigo" | "Ancient" | "Anubis";
export enum MapName {
    Dust2 = "Dust 2",
    Mirage = "Mirage",
    Inferno = "Inferno",
    Nuke = "Nuke",
    Vertigo = "Vertigo",
    Ancient = "Ancient",
    Anubis = "Anubis",
}

export const isMapName = (arg: any): arg is MapName => (
    Object.values(MapName).includes(arg)
);