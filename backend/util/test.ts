console.log("This is a test file.")

// cli.ts
import { Command } from 'commander';
import { updateLocationNames } from '../database/updateLocationNames';

const program = new Command();

program
  .command('test')
  .description('Test command')
  .action(async () => {
    try {
      console.log('Start of action');
      await updateLocationNames();
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
      console.log('End of action');
    } catch (error) {
      console.error('Error:', error);
    }
  });

program.parse(process.argv);