import { Router } from 'express';
import { UtilThrowModel, UtilThrowSchema } from '../models/throws';
import connectDB from '../database.js';
import { REQUIRED_THROW_PROPS, UtilThrow } from '@shared/enums/utility.js';
import { queryCallout, testCallout } from '@shared/util/queryCallout.js';
import { updateLocationNames } from '../database/updateLocationNames';
import { activePositionToMapPosition, assignActivePositions } from '../database/assignActivePositions';
import { isMap } from 'util/types';
import { isMapName, MapName } from '@shared/enums/maps.js';
import assert from 'assert';
import { isValidPair, isValidTriple } from '@shared/enums/position';

const uri = process.env.MONGO_URI;

const router = Router();

const LARGE_UPDATES = true;


// Get all instructions
router.get('/', async (req, res) => {
    try {

        console.log("Should trigger debug");
        const utilThrows = await UtilThrowModel.find();
        // res.json({message: "Test message for throws endpoint"});
        res.json(utilThrows);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Get the first n instructions for a specific map
router.get('/:mapName/:n', async (req, res) => {
    const mapName = req.params.mapName;
    const n = parseInt(req.params.n);
    try {
        const utilThrows = await UtilThrowModel.find({ map: mapName }).limit(n);
        // res.json({message: "Test message for throws endpoint"});
        res.json(utilThrows);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
// Get all the throws at a certain point
/*
router.get('/:mapName/pos/:x/:y', async (req, res) => {
    try {
        if (!isMapName(req.params.mapName)) {
            return res.status(400).json({ message: `Invalid map name: ${req.params.mapName}` });
        }
        const mapName = req.params.mapName as MapName;
        const [x, y] = [parseInt(req.params.x), parseInt(req.params.y)];
        const throws = await getThrowsAtPosition(mapName, [x, y]);
        res.json({
            map: mapName,
            position: [x, y],
            throws
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
})
*/
router.get('/updateLocationNames', async (req, res) => {
    if (!LARGE_UPDATES) {
        return res.status(403).json({ message: 'Big effects endpoint disabled, turn on LARGE_UPDATES to use' });
    }
    try {
        await updateLocationNames(res.status(200).send, res.status(500).json);
        res.status(200).send("Updating location names for all utility throws...");
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
router.get('/callouts', async (req, res) => {
    const { map, throwPosition: throwPosition_, activePosition: activePosition_ } = req.query;
    if (!map || !throwPosition_ || !activePosition_) {
        return res.status(400).json({ message: 'Missing required query parameters' });
    }
    if (typeof map !== 'string' || typeof throwPosition_ !== 'string' || typeof activePosition_ !== 'string') {
        return res.status(400).json({ message: 'Invalid query parameter types' });
    }    
    const throwPosition = throwPosition_.split(',').map(Number);
    const activePosition = activePosition_.split(',').map(Number);

    assert(isMapName(map), `Invalid map name: ${map}`);
    assert(isValidPair(throwPosition) || isValidTriple(throwPosition), `Invalid throw position: ${throwPosition}`);
    assert(isValidPair(activePosition) || isValidTriple(activePosition), `Invalid active position: ${throwPosition}`);
    const throwPositionCallout = queryCallout(map, throwPosition);
    const activePositionCallout = queryCallout(map, activePosition);
    res.json({ map, activePositionCallout, throwPositionCallout });
});

router.get('/queryCallout', async (req, res) => {
    const { map, point: point_, calloutName } = req.query;
    if (!map || !point_) {
        return res.status(400).json({ message: 'Missing required query parameters' });
    }
    if (typeof map !== 'string' || typeof point_ !== 'string' || typeof calloutName !== 'string') {
        return res.status(400).json({ message: 'Invalid query parameter types' });
    }
    const point = point_.split(',').map(Number);
    

    assert(isMapName(map), `Invalid map name: ${map}`);
    assert(isValidPair(point) || isValidTriple(point), `Invalid point: ${point}`);
    const present = testCallout( point, map, calloutName);
    res.json({ map, point, calloutName, present });
});
router.get('/updateActivePosition', async (req, res) => {
    if (!LARGE_UPDATES) {
        return res.status(403).json({ message: 'Big effects endpoint disabled, turn on LARGE_UPDATES to use' });
    }
    try {
        await assignActivePositions();
        res.status(200).send("Updated active position values to be accurate.");
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Get instructions for a specific team and round
router.get('/:map/:team/:code', async (req, res) => {

});

/*
interface UtilThrow extends Document {
  team: Team;
  utility: Utility;
  throw: ThrowType;
  throwPosition: [number, number, number];
  activePosition: [number, number, number];
  content: any; // Use 'any' for flexible schema
  updatedAt: Date;
}*/

// Create new instructions
router.post('/', async (req, res) => {
    // check to make sure all most important nade utility throw props are present:
    for (let prop of REQUIRED_THROW_PROPS) {
        if (!req.body[prop]) {
            return res.status(400).json({ message: `Missing required property: ${prop}` });
        }
    }
   const throwData: UtilThrow = {
        map: req.body.map,
        team: req.body.team,
        utility: req.body.utility,
        throwPosition: req.body.throwPosition,
        throwAngle: req.body.throwAngle,
        strafe: req.body.strafe,
        speed: req.body.speed,
        doJump: req.body.doJump,
        doCrouch: req.body.doCrouch,
        throwType: req.body.throwType,
        video: req.body.video,
        lineup: req.body.lineup,
        activePosition: req.body.activePosition,
        content: req.body.content,
        updatedAt: new Date()
    }
    if (throwData.throwPosition) {
        throwData.throwPositionCallout = queryCallout(throwData.map, throwData.throwPosition);
    }
    const utilThrow = new UtilThrowModel(throwData);
   
    try {
        const newUtilThrow = await utilThrow.save();
        res.status(201).json(newUtilThrow);
    } catch (error) {
        if (error instanceof Error) {
            console.log("error: ", error);
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Update instructions
router.put('/', async (req, res) => {
    const id = req.body._id;
    try {
        const dataCheck = {
            team: req.body.team,
            utility: req.body.utility,
            throw: req.body.throw,
            throwPosition: req.body.throwPosition,
            activePosition: req.body.activePosition,
            throwPositionCallout: req.body.throwPositionCallout,
            activePositionCallout: req.body.activePositionCallout,
            throwAngle: req.body.throwAngle,
            strafe: req.body.strafe,
            content: req.body.content,
            updatedAt: new Date()
        }
        // Find the document by ID and update it with the request body
        const updatedUtilThrow = await UtilThrowModel.findByIdAndUpdate(id, req.body, { new: true }); // `new: true` returns the updated document

        if (!updatedUtilThrow) {
            return res.status(404).json({ message: 'UtilThrow not found' });
        }

        res.json(updatedUtilThrow);
    } catch (error) {
        if (error instanceof Error) {
            console.log("error: ", error);
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Delete instructions
router.delete('/:id', async (req, res) => {

});

export default router;
