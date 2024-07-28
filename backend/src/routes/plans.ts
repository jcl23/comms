import { Router } from 'express';

import { REQUIRED_THROW_PROPS, UtilThrow } from '@shared/enums/utility.js';
import { queryCallout, testCallout } from '@shared/util/queryCallout.js';
import { updateLocationNames } from '../database/updateLocationNames';

import { isMapName, MapName } from '@shared/enums/maps.js';
import assert from 'assert';
import { isValidPair, isValidTriple } from '@shared/enums/position';
import { PlanModel } from '../models/plans';

const uri = process.env.MONGO_URI;

const router = Router();
const LARGE_UPDATES = true;


// Get all plans
router.get('/', async (req, res) => {
    try {
        const utilThrows = await PlanModel.find();
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
router.get('/newDefault', async (req, res) => {

});

export default router;
