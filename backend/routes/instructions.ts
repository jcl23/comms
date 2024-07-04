import { Router } from 'express';
import { Instruction } from '../models/instructions';

const router = Router();

// Get all instructions
router.get('/', async (req, res) => {
  try {
    const instructions = await Instruction.find();
    res.json(instructions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get instructions for a specific team and round
router.get('/:map/:team/:code', async (req, res) => {

});


// Create new instructions
router.post('/', async (req, res) => {
  const instruction = new Instruction({
    team: req.body.team,
    round: req.body.round,
    content: req.body.content,
    updatedAt: new Date()
  });

  try {
    const newInstruction = await instruction.save();
    res.status(201).json(newInstruction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update instructions
router.put('/:id', async (req, res) => {
  
});

// Delete instructions
router.delete('/:id', async (req, res) => {
 
});

export default router;
