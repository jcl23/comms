import React, { useEffect, useRef } from "react";
import { act } from "react";
import { UtilThrow } from "../../../../../shared/enums/utility";
import { transformPoint } from "../../../../../shared/util/regression";

type MapCanvasProps = {
    activePosition: number[] | null;
    throws: UtilThrow[] | null;
    imgRef: React.RefObject<HTMLImageElement> | null;
    matrix: number[];
}

const drawThrowLine = (ctx: CanvasRenderingContext2D, from: number[], to: number[], imgWidth: number, imgHeight: number, matrix) => {
    // debug log
    console.log("Drawing line from", from, "to", to);

    let [x1, y1] = transformPoint(from[0], from[1], matrix);
    let [x2, y2] = transformPoint(to[0], to[1], matrix);

    x1 *= imgWidth;
    x2 *= imgWidth;
    y1 *= imgHeight;
    y2 *= imgHeight;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
export const MapCanvas = ({ throws, activePosition, imgRef, matrix }: MapCanvasProps) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const ctx = ref?.current?.getContext("2d");

    console.log({matrix})
    useEffect(() => {
        
        const canDraw = (activePosition !== null) && (throws !== null) &&  imgRef && (imgRef.current !== null);
        if (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            if (canDraw) {
                const { width, height } = imgRef.current;
                // get width, height
                ctx.canvas.width = width;
                ctx.canvas.height = height;
                ctx.strokeStyle = "lightgray";
                ctx.lineWidth = 2;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                throws.forEach(throwData => {
                    drawThrowLine(ctx, activePosition, throwData.throwPosition, width, height, matrix);
                });
            }
        }    
        }, [throws, activePosition, imgRef]);
        return (
            <canvas ref={ref} style={{position: "absolute", top: 0, pointerEvents: "none"}} >
            
        </canvas>
    )
}