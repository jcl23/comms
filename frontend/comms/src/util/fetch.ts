import { UtilThrow } from "../../../../shared/enums/utility";

export const fetchThrows = async () => {
    try {
        const response = await fetch("/throws");
        const dataList = await response.json();
        console.log("Fetched from the throws endpoint: ", dataList);
        return dataList;
    } catch (error) {
        console.error(error);
    }
};

export const fetchCallouts = async (throwData: UtilThrow) => {
    const { map, throwPosition, activePosition } = throwData;
    // fetch from /throws/callouts, with query params map, throwPosition, activePosition
    const response = await fetch(`/throws/callouts?map=${map}&throwPosition=${throwPosition}&activePosition=${activePosition}`);
    
    const data = await response.json();
    return data;
}
export const saveThrow = async (throwData: UtilThrow) => {
    if (throwData === null) return;
    const method = throwData._id ? "PUT" : "POST";
    console.log("Saving: ", throwData);
    const response = await fetch("/throws", {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(throwData),
        redirect: "manual",
    });
    const data = await response.json();
    return data;
};