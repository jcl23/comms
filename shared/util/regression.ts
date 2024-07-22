function transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function multiplyMatrices(a: number[][], b: number[][]): number[][] {
    return a.map(row => b[0].map((_, colIndex) => row.reduce((sum, value, rowIndex) => sum + value * b[rowIndex][colIndex], 0)));
}

function inverseMatrix(matrix: number[][]): number[][] {
    const size = matrix.length;
    const augmented = matrix.map((row, rowIndex) => row.concat(rowIndex === 0 ? [1, 0, 0] : rowIndex === 1 ? [0, 1, 0] : [0, 0, 1]));
    
    for (let i = 0; i < size; i++) {
        let maxRow = i;
        for (let k = i + 1; k < size; k++) {
            if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                maxRow = k;
            }
        }
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
        
        for (let k = i + 1; k < size; k++) {
            const factor = augmented[k][i] / augmented[i][i];
            for (let j = i; j < 2 * size; j++) {
                augmented[k][j] -= augmented[i][j] * factor;
            }
        }
    }
    
    for (let i = size - 1; i >= 0; i--) {
        for (let k = size - 1; k > i; k--) {
            const factor = augmented[i][k] / augmented[k][k];
            for (let j = 0; j < 2 * size; j++) {
                augmented[i][j] -= augmented[k][j] * factor;
            }
        }
        const factor = augmented[i][i];
        for (let j = 0; j < 2 * size; j++) {
            augmented[i][j] /= factor;
        }
    }
    
    return augmented.map(row => row.slice(size));
}


export function computeTransformationMatrix(normalizedPoints: number[][], realPoints: number[][]): number[] {
    const X = normalizedPoints.map(point => [point[0], point[1], 1]);
    const Y_X = realPoints.map(point => [point[0]]);
    const Y_Y = realPoints.map(point => [point[1]]);

    const XT = transpose(X);
    const XTX = multiplyMatrices(XT, X);
    const XTX_inv = inverseMatrix(XTX);
    const XTY_X = multiplyMatrices(XT, Y_X);
    const XTY_Y = multiplyMatrices(XT, Y_Y);

    const theta_X = multiplyMatrices(XTX_inv, XTY_X).flat();
    const theta_Y = multiplyMatrices(XTX_inv, XTY_Y).flat();

    return [...theta_X, ...theta_Y];
}

export function transformPoint(x: number, y: number, theta: number[]): [number, number] {
    const [a, b, c, d, e, f] = theta;
    const X = a * x + b * y + c;
    const Y = d * x + e * y + f;
    return [X, Y];
}

// Ensuring the mechanism for determining transformations is correct
const sanityCheck = function() {
    // Create 50 test data, points in I x I where I is the unit interval.
    
    const data: [number, number][] = Array(50).fill(0).map(() => [Math.random(), Math.random()]);
    // create some real transformation based on 6 values: a, b, c, d, e, f
    type TransformData = [number, number, number, number, number, number];
    
    const randomScale = (a: number, b: number, c: number, d: number, e: number, f: number) => () => (Math.random() * 2 - 1) * (a + b + c + d + e + f) * 0.05; 
    const makeTransformation = ([a, b, c, d, e, f]: TransformData) => (point: [number, number]): [number, number] => {
        const [x, y] = point;
        const rand = randomScale(a, b, c, d, e, f);
        return [a * x + b * y + c + rand(), d * x + e * y + f + rand()];
    } 
    const transformationData = [50, 1, 4, 1, 52, -10] as TransformData;
    const transform = makeTransformation(transformationData);
    const transformedData = data.map(transform);
    // Now, we have the data and the transformed data. We want to find the transformation that maps the data to the transformed data.
    // We will use the transformation matrix method.
    const theta = computeTransformationMatrix(data, transformedData);
    console.log("Theta: ", theta);
    console.log("Real theta: ", transformationData);
}

