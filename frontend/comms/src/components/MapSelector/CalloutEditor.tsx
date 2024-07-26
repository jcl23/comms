import React, { useState, useRef, useEffect } from "react";
import { MapName } from "../../../../../shared/enums/maps.ts";
import calloutBoxes from "../../../../../shared/data/calloutBoxes.json";
import { transformPoint } from "../../../../../shared/util/regression";
import { MapCanvas } from "./MapCanvas";
import positionToIcon from '../../../../../shared/data/positionToIcon.json';
const handleSaveCallouts = async () => {
    /*if (newThrow) {
        try {
            let method;
            if (newThrow._id == "") {
                method = "POST";
            } else {
                method = "PUT";
            }

            const response = await fetch("/throws", {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newThrow),
            });
            const data = await response.json();
            setThrowsByList(data);
            setEditing(false);
        } catch (error) {
            console.error(error);
        }
    }*/
};

const mapFileList = {
    "Ancient": ["/src/assets/Ancient_map.png"],
    "Anubis": ["/src/assets/Anubis_map.png"],
    "Dust2": ["/src/assets/Dust2_map.png"],
    "Inferno": ["/src/assets/Inferno_map.png"],
    "Mirage": ["/src/assets/Mirage_map.png"],
    "Nuke": ["/src/assets/Nuke_map1.png", "/src/assets/Nuke_map2.png"],
    "Vertigo": ["/src/assets/Vertigo_map1.png", "/src/assets/Vertigo_map2.png"],
}

type CalloutEditorProps = {
   

}
type CalloutEntry = [string, number, number, number, number, number, number];

const interpolateColor = function(value, color1, color2) {
    const r = Math.round(color1[0] + value * (color2[0] - color1[0]));
    const g = Math.round(color1[1] + value * (color2[1] - color1[1]));
    const b = Math.round(color1[2] + value * (color2[2] - color1[2]));
    return `rgba(${r}, ${g}, ${b}, 0.4)`;
}
const normalize = function(y1, y2, value) {
    // Clamp the value between y1 and y2
    const clampedValue = Math.max(y1, Math.min(y2, value));
  
    // Normalize the clamped value to a 0-1 range
    return (clampedValue - y1) / (y2 - y1);
}

const colorMap = (z) => interpolateColor(normalize(-300, 200, z), [255, 0, 0], [0, 255, 0])


export const CalloutEditor = function() {
    
    const [mapName, setMapName] = useState<MapName>(MapName.Mirage);
    const [layer, setLayer] = useState(0);
    const calloutListData = calloutBoxes[mapName] as CalloutEntry[];
    
    const imgRef = useRef<HTMLImageElement>(null);
    const imgWidth = imgRef.current?.width || 0;
    const imgHeight = imgRef.current?.height || 0;

    const calloutListElements = calloutListData.map(([name, x1_, y1_, z1_, x2_, y2_, z2_]) => {
        let [x1, y1] = transformPoint(x1_, y1_, positionToIcon[mapName]);
        let [x2, y2] = transformPoint(x2_, y2_, positionToIcon[mapName]);
        if (x2 < x1) {
            [x1, x2] = [x2, x1];
        }
        if (y2 < y1) {
            [y1, y2] = [y2, y1];
        }
        const left = x1 * 100 + "%";
        const top = y1 * 100 + "%";
        const width = (x2 - x1) * imgWidth + "px";
        const height = (y2 - y1) * imgHeight + "px";
        return <div style={{
            position: "absolute", 
            left, top, 
            width, height, 
        background: `linear-gradient(45deg, ${colorMap(z1_)}, ${colorMap(z2_)})`}}>{name}</div>
    })
    const matrix = positionToIcon[mapName];
    
    const mapImagePaths = mapFileList[mapName];
    const mapImagePath = mapImagePaths[layer];
    
   

    useEffect(() => {
        setLayer(0);
        
    }, [mapName]);

    return (
        <div >
            <div>
                {Object.keys(MapName).map((map) => (
                    <button key={map} onClick={() => setMapName(map as MapName)}>{map}</button>  
                ))}
            </div>
            <div style={{position: "relative", width: "500px"}}>

                <img ref={imgRef} src={mapImagePath} style={{width: "100%"}}/>
                <div style={{
                    width: "100%", height: "100%", position: "absolute", top: 0, left: 0, pointerEvents: "none"
                }}>
                {
                    calloutListElements
                    }
                </div>
            </div>
        </div>
    );
}