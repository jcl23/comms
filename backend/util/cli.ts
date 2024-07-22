import { Command } from 'commander';
import { updateLocationNames } from '../database/updateLocationNames';

const program = new Command();

program
    .command('updateLocNames')
    .description('Update location names for all utility throws')
    .action(async () => {
        try {
            console.log("Updating location names for all utility throws...");
            await updateLocationNames();
            console.log("Updated location names for all utility throws.");
        } catch (e) {
            console.log("An error occurred while updating location names.")
            // console.error(e);

        }
    });