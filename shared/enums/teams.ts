export enum Team {
    T = "T",
    CT = "CT",
    Any = "Any",
}

export const isTeam = (arg: any): arg is Team => (
    Object.values(Team).includes(arg)
);