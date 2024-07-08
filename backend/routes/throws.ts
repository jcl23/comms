import { Router } from 'express';
import { UtilThrow } from '../models/throws';
import connectDB from '../database';

const uri = process.env.MONGO_URI;

const router = Router();



// Get all instructions
router.get('/', async (req, res) => {
    try {
        const utilThrows = await UtilThrow.find();
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
    const utilThrow = new UtilThrow({
        map: req.body.map,
        team: req.body.team,
        utility: req.body.utility,
        throw: req.body.throw,
        throwPosition: req.body.throwPosition,
        throwAngle: req.body.throwAngle,
        strafe: req.body.strafe,
        activePosition: req.body.activePosition,
        content: req.body.content,
        updatedAt: new Date()
    });
    console.log("utilThrow: ", utilThrow);
    // individual props:
    console.log("team: ", req.body.team);
    console.log("utility: ", req.body.utility);
    console.log("throw: ", req.body.throw);
    console.log("throwPosition: ", req.body.throwPosition);
    console.log("throwAngle: ", req.body.throwAngle);
    console.log("strafe: ", req.body.strafe);
    console.log("activePosition: ", req.body.activePosition);
    console.log("content: ", req.body.content);
    console.log("updatedAt: ", new Date);

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
        // Find the document by ID and update it with the request body
        const updatedUtilThrow = await UtilThrow.findByIdAndUpdate(id, {
            team: req.body.team,
            utility: req.body.utility,
            throw: req.body.throw,
            throwPosition: req.body.throwPosition,
            throwAngle: req.body.throwAngle,
            strafe: req.body.strafe,
            activePosition: req.body.activePosition,
            content: req.body.content,
            updatedAt: new Date()
        }, { new: true }); // `new: true` returns the updated document

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
