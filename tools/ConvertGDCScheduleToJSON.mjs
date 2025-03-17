//------------------------------------------------------------------------------
// Author(s):   sliptrixx (Hibnu Hishath)
// Date:        2025-03-14
// License:     MIT License (for more info checkout License.md file)
//
// Description: Contains the source code for converting the 'full_schedule.csv' 
//              representing the gdc schedule to 'schedule.json'
//------------------------------------------------------------------------------

// Note: Run `node .\tools.js` to convert the full_schedule.csv to schedule.json
//       Make sure to have the full_schedule.csv in the same directory as this file
//       The output will be written to schedule.json on the same directory

import { convertCSVToJSON } from './CSVTools.mjs';

import fs from 'fs';
fs.readFile( 'full_schedule.csv', 'utf8', ( err, data ) => {
    if( err ) { console.error( err ); return; }
    let json = convertCSVToJSON( data );
    fs.writeFile( 'schedule.json', JSON.stringify( json ), ( err ) => {
        if( err ) { console.error( err ); return; }
        console.log( 'Conversion complete' );
    } );
} );
