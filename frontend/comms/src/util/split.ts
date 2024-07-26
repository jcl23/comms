import { UtilThrow } from "../../../../shared/enums/utility";

export const splitByProp = (prop: string, data: UtilThrow[]) => data.reduce((acc, throwData) => {
    if (acc[throwData[prop]]) {
        acc[throwData[prop]].push(throwData);
    } else {
        acc[throwData[prop]] = [throwData];
    }
    return acc;
}, {} as {[key: string]: UtilThrow[]});

export const splitByProps = (props: string[], data: UtilThrow[]) : any => {
    // form a tree, so that we can access items by (props.length) array accesses,
    // like tree[prop1][prop2][prop3]...[propN]
    const [prop, ...rest] = props;
    // use splitByProp
    const split = splitByProp(prop, data);
    split["All"] = data;
    // if there are more props, recurse
    if (rest.length > 0) {
        for (const key in split) {
            split[key] = splitByProps(rest, split[key]);
        }
    }
    return split;
}