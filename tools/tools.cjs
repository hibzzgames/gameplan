//------------------------------------------------------------------------------
// Author(s):   sliptrixx (Hibnu Hishath)
// Date:        2025-03-14
// License:     MIT License (for more info checkout License.md file)
//
// Description: Contains the source code for converting data to different json, 
//              so that the result can be cached and used by main.js
//------------------------------------------------------------------------------

// Note: Run `node .\tools.js` to convert the full_schedule.csv to schedule.json
//       Make sure to have the full_schedule.csv in the same directory as this file
//       The output will be written to schedule.json on the same directory

const fs = require( 'fs' );
fs.readFile( 'full_schedule.csv', 'utf8', ( err, data ) => {
    if( err ) { console.error( err ); return; }
    let json = convertCSVToJSON( data );
    fs.writeFile( 'schedule.json', JSON.stringify( json ), ( err ) => {
        if( err ) { console.error( err ); return; }
        console.log( 'Conversion complete' );
    } );
} );

// #region Utility Functions

/** Converts a CSV string to a JSON object
 * 
 * @param {string} csv
 */
function convertCSVToJSON( csv ) {
    let result = [];
    
    let lines = [];
    
    // lines are split by new line characters, but only if the line does end with a quote
    let currentLine = '';
    let splitLines = csv.split( '\n' );
    for ( let i = 0; i < splitLines.length; i++ ) {
        currentLine += splitLines[ i ];
        if ( splitLines[ i ].trim().endsWith( '"' ) ) {
            lines.push( currentLine );
            currentLine = '';
        } else {
            currentLine += '\n';
        }
    }
    if ( currentLine.length > 0 ) {
        lines.push( currentLine );
    }

    if( lines.length < 2 ) { return result; }

    let headers = lines[ 0 ].split( ',' );
    headers = headers.map( ( header ) => { 
        // Trimming and replacing spaces with underscores for header values, so
        // it's easier to access with the dot operator
        header = header.trim();
        header = header.replace(/ /g, '_'); // replace all spaces with underscores
        if( header.startsWith( '"' ) && header.endsWith( '"' ) ) {
            header = header.substring( 1, header.length - 1 );
        }
        return header; 
    } );

    for( let i = 1; i < lines.length; i++ ) {
        if( lines[ i ].trim().length == 0 ) { continue; }
        let obj = {};
        let tokens = splitCSVLine( lines[ i ] );
        for( let j = 0; j < headers.length; j++ ) {
            obj[ headers[ j ] ] = j < tokens.length ? tokens[ j ] : '';
        }
        result.push( obj );
    }
    return result;
}

/** Splits a line of CSV data into individual tokens with some special 
 * handling like quoted commas and double quotes inside quoted strings
 * 
 * @param {string} str The line of CSV data to split
 * @returns a list of tokens
 */
function splitCSVLine( str ) {
    let result = [];

    let tokens = str.split( ',' );
    let value = '';
    let isQuoted = false;
    for( let i = 0; i < tokens.length; i++ ) {
        var token = tokens[ i ];
        if( token.length == 0 ) { continue; }

        if( value == '' && !isQuoted && token.trim().startsWith( '"' ) ) {
            isQuoted = true;
            token = token.trim().substring( 1 );
        }
        if( isQuoted && token.endsWith( '"' ) ) {
            isQuoted = false;
            token = token.substring( 0, token.length - 1 );
        }
        
        if( isQuoted ) {
            value += token + ',';
        }
        else {
            value += token;
            result.push( value );
            value = '';
        }
    }
    return result;
}

// #endregion