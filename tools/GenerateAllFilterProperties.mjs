//------------------------------------------------------------------------------
// Author(s):   sliptrixx (Hibnu Hishath)
// Date:        2025-03-15
// License:     MIT License (for more info checkout License.md file)
//
// Description: Contains the source code to figure out all the filter options 
//              available for a given schedule and generate the 
//              filter.properties.json file
//------------------------------------------------------------------------------

/**
 * @typedef { Object } GDCEvent
 * @property { string } session_title
 * @property { string } start_time
 * @property { string } end_time
 * @property { string } duration
 * @property { string } day
 * @property { string } description
 * @property { string } takeaway
 * @property { string } intended_audience
 * @property { string } location
 * @property { string } tracks
 * @property { string } format
 * @property { string } passes
 * @property { string } speakers
 * @property { string } gdc_vault_recording
 */

import fs from 'fs';
fs.readFile( 'schedule.json', 'utf8', ( err, data ) => {
    if( err ) { console.error( err ); return; }
    
    /**
     * @type {GDCEvent[]}
     */
    let gdc_schedule = JSON.parse( data );
    var props = 
    {
        pass_types: [],
        tracks: [],
        formats: [],
        start_times: {},
        end_times: {},
        start_times_date: {},
        end_times_date: {},
    };

    gdc_schedule.forEach( ( event ) => { 
        event.passes.split( ',' ).forEach( ( pass ) => {
            pass = pass.trim();
            if( !props.pass_types.includes( pass ) ) { props.pass_types.push( pass ); }
        } );
        if( !props.tracks.includes( event.tracks ) ) { props.tracks.push( event.tracks ); }
        if( !props.formats.includes( event.format ) ) { props.formats.push( event.format ); }

        let day = new Date( event.start_time ).getDay();
        if( !isNaN(day) ) { 
            if( !props.start_times_date[ day ] ) { 
                props.start_times_date[ day ] = new Date( event.start_time );
                props.end_times_date[ day ] = new Date( event.end_time );
                props.start_times[ day ] = event.start_time;
                props.end_times[ day ] = event.end_time;
            }
            if( props.start_times_date[ day ] > new Date( event.start_time ) ) {
                props.start_times_date[ day ] = new Date( event.start_time );
                props.start_times[ day ] = event.start_time;
            }
            if( props.end_times_date[ day ] < new Date( event.end_time ) ) {
                props.end_times_date[ day ] = new Date( event.end_time );
                props.end_times[ day ] = event.end_time;
            }
        }
    } );

    // the properties start_times_date and end_times_date temporarily used to 
    // store the date as Date objects for comparison and they are no longer 
    // needed so we delete them
    delete props.start_times_date;
    delete props.end_times_date;

    fs.writeFile( 'filter.properties.json', JSON.stringify( props ), ( err ) => {
        if( err ) { console.error( err ); return; }
        console.log( 'Filter properties generated' );
    } );
 } );