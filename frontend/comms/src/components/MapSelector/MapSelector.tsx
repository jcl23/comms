import React, { useEffect } from 'react';
import { UtilThrow } from '../../../../../shared/enums/utility';
import positionToIcon from '../../../../../shared/data/positionToIcon.json';
import { transformPoint } from '../../../../../shared/util/regression';
import { MapName } from '../../../../../shared/enums/maps';
import { throwsByActivePosition, throwsByThrowPosition } from '../../../../../shared/util/cluster';
import styles from './MapSelector.module.css';
import { MapCanvas } from './MapCanvas';
import mapFileList from "../../data/mapFileList.json";
import colors from "../../data/colors.json";

type MapSelectorProps = {
    mapName: MapName;
    throwList: UtilThrow[];
    setSelectedThrow: (throwData: UtilThrow | null) => void;
};




const interpolateColor = function(value, color1, color2) {
    const r = Math.round(color1[0] + value * (color2[0] - color1[0]));
    const g = Math.round(color1[1] + value * (color2[1] - color1[1]));
    const b = Math.round(color1[2] + value * (color2[2] - color1[2]));
    return `rgb(${r}, ${g}, ${b})`;
}
const normalize = function(y1, y2, value) {
    // Clamp the value between y1 and y2
    const clampedValue = Math.max(y1, Math.min(y2, value));
  
    // Normalize the clamped value to a 0-1 range
    return (clampedValue - y1) / (y2 - y1);
}

const colorMap = (z) => interpolateColor(normalize(-300, 200, z), [155, 100, 100], [100, 100, 255])

const MapSelector = ({ mapName, throwList, setSelectedThrow }: MapSelectorProps) => {

    const [layer, setLayer] = React.useState(0);
    const [activeGroupIndex, setActiveGroupIndex] = React.useState<number>(-1);
    const throwGroups = throwsByActivePosition(throwList);
    const visibleThrowGroups = activeGroupIndex < 0 ? throwGroups : [throwGroups[activeGroupIndex]];
    const [activeThrowIndex, setActiveThrowIndex] = React.useState<number>(visibleThrowGroups.length == 1 ? 0 : -1);
    
    const visibleThrows = activeGroupIndex < 0 ? null : throwGroups[activeGroupIndex].throws;
    
    const matrix = positionToIcon[mapName];
    const [throwLeft, throwTop] = activeGroupIndex < 0 ? [null, null]: transformPoint(throwGroups[activeGroupIndex].location[0], throwGroups[activeGroupIndex].location[1], matrix);

    console.log("Available groups:", throwGroups);
    const mapImagePaths = mapFileList[mapName];
    const mapImagePath = mapImagePaths[layer];
    const imgRef = React.useRef<HTMLImageElement>(null);
    
    const activeThrow = (activeThrowIndex < 0 || !visibleThrows) ? null : visibleThrows[activeThrowIndex];

    useEffect(() => {
        setLayer(0);
        
    }, [mapName]);


    return (
        <div>
            <div style={{display: "Flex"}}>
                <h2>{`${mapName}: ${throwList.length} throws`}</h2>
                {(mapImagePaths.length > 1) && (
                    <button onClick={() => setLayer((layer + 1) % mapImagePaths.length)}>
                        Toggle Layer
                    </button>
                )}
                
               
            </div>
            <div className={styles.imageContainer}>

                <img 
                    ref={imgRef}
                    src={mapImagePath} alt={mapName} 
                    className={styles.map}
                    onClick={() => {
                        setActiveThrowIndex(-1);
                        setActiveGroupIndex(-1);
                        setSelectedThrow(null);
                    }}
                />
                {
                    <MapCanvas throws={visibleThrows} activePosition={(activeGroupIndex === null) ? null : throwGroups[activeGroupIndex]?.location} imgRef={imgRef} matrix={matrix}/>
                }
                <ul className={styles.points}  >
                    {visibleThrowGroups.map(({ location: [x, y], throws }, index) => {
                        const [left, top] = transformPoint(x, y, matrix);
                        return (
                            <li
                                className={styles.throw}
                                key={"throwgroup" + index} 
                                style={{
                                    left:left * 100 + "%",
                                    top: top * 100 + "%",
                                    background: colors[throws[0].utility],
                                }}
                                onClick={function() {
                                    setActiveGroupIndex(index);
                                    if (throwGroups[index].throws.length == 1) {
                                        setActiveThrowIndex(0);
                                        setSelectedThrow(throwGroups[index].throws[0]);
                                    }
                                }}
                            >
                                {(throws.length > 1) ? throws.length : ""}
                            </li>
                        )
                    })}
                    {visibleThrows && visibleThrows.map(({ throwPosition: [x, y, z]  }, index) => {
                        const [left, top] = transformPoint(x, y, matrix);
                        const lineLength = (throwLeft && throwTop) ? 100 * Math.hypot(throwLeft - left, throwTop - top) : 0;
                        
                        const color = colorMap(z);
                        return (
                            <li
                            className={styles.throw}
                            key={"throw" + index} 
                            style={{
                                left:left * 100 + "%",
                                top: top * 100 + "%",
                                backgroundColor: color,
                            }}
                            onClick={function() {
                                setActiveThrowIndex(index);
                                setSelectedThrow(visibleThrows[index]);
                            }}
                            >
           
                            </li>
                        )
                    })}
                </ul>
                         
            </div>
        </div>
    );
};

export default MapSelector;