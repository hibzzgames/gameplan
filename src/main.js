//------------------------------------------------------------------------------
// Author(s):   sliptrixx (Hibnu Hishath)
// Date:        2025-03-12
// License:     MIT License (for more info checkout License.md file)
//
// Description: Contains the source code for a web app called Gameplan, that 
//              helps devs plan out their GDC schedule.
//------------------------------------------------------------------------------

const APP_VERSION = "1.2";

// #region JSDoc Type definitions - to make my life easier

/** This is the structure of the JSON file that gets converted from GDC's 
    full_schedule.csv to schedule.json by our tools/tool.cjs script
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

// #endregion

// #region Constants

const COLORS = 
{
    // Primary Colors
    DARK_0: "#000000",
    LIGHT_0: "#ffffff",
    TRANSPARENT: "transparent",

    // Dark Theme Primary Colors
    PRIMARY_0:  "#e09cb4",
    PRIMARY_10: "#e4a7bc",
    PRIMARY_20: "#e8b2c4",
    PRIMARY_30: "#ecbdcc",
    PRIMARY_40: "#efc8d5",
    PRIMARY_50: "#f3d3dd",

    // Dark theme surface colors
    SURFACE_0:  "#121212",
    SURFACE_10: "#282828",
    SURFACE_20: "#3f3f3f",
    SURFACE_30: "#575757",
    SURFACE_40: "#717171",
    SURFACE_50: "#8b8b8b",

    // Dark theme tonal surface colors
    SURFACE_TONAL_0:  "#241e20",
    SURFACE_TONAL_10: "#393335",
    SURFACE_TONAL_20: "#4e494b",
    SURFACE_TONAL_30: "#656062",
    SURFACE_TONAL_40: "#7d797a",
    SURFACE_TONAL_50: "#969293",
};

const FONTS = {
    DOTO: '"Doto", sans-serif',
    IBM_PLEX_MONO: '"IBM Plex Mono", monospace',
};

const ICONS = {
    fa_arrow_right_from_bracket: [ "fa-solid", "fa-arrow-up-from-bracket", "fa-rotate-90" ],
    fa_bluesky: [ "fa-brands", "fa-bluesky" ],
    fa_circle: [ "fa-solid", "fa-circle" ],
    fa_check: [ "fa-solid", "fa-check" ],
    fa_chevron_down: [ "fa-solid", "fa-chevron-down" ],
    fa_chevron_left: [ "fa-solid", "fa-chevron-down", "fa-rotate-90" ],
    fa_chevron_right: [ "fa-solid", "fa-chevron-down", "fa-rotate-270" ],
    fa_chevron_up: [ "fa-solid", "fa-chevron-down", "fa-rotate-180" ],
    fa_clock: [ "fa-solid", "fa-clock" ],
    fa_code: [ "fa-solid", "fa-code" ],
    fa_ellipsis_horizontal: [ "fa-solid", "fa-ellipsis-vertical", "fa-rotate-90" ],
    fa_ellipsis_vertical: [ "fa-solid", "fa-ellipsis-vertical" ],
    fa_eye: [ "fa-solid", "fa-eye" ],
    fa_eye_slash: [ "fa-solid", "fa-eye-slash" ],
    fa_filter: [ "fa-solid", "fa-filter" ],
    fa_floppy_disk: [ "fa-solid", "fa-floppy-disk" ],
    fa_hourglass: [ "fa-solid", "fa-hourglass" ],
    fa_info: [ "fa-solid", "fa-info" ],
    fa_link: [ "fa-solid", "fa-link" ],
    fa_location: [ "fa-solid", "fa-location-dot" ],
    fa_magnifying_glass: [ "fa-solid", "fa-magnifying-glass" ],
    fa_paper_plane: [ "fa-solid", "fa-paper-plane" ], 
    fa_plus: ["fa-solid", "fa-plus" ],
    fa_ticket: [ "fa-solid", "fa-ticket" ],
    fa_trash: [ "fa-solid", "fa-trash" ],
    fa_video: ["fa-solid", "fa-video" ],
};

const LAYOUT = { MOBILE: "mobile", DESKTOP: "desktop" };
const MOBILE_BREAKPOINT = 820;
var current_layout = window.innerWidth <= MOBILE_BREAKPOINT ? LAYOUT.MOBILE : LAYOUT.DESKTOP;

const EVENT_SOURCE = { GDC: "GDC", CUSTOM: "CUSTOM" };

// #endregion

// #region Base Utility Functions

/** Utility function to set hover color. Ensure to set the default color first before calling this function
 * @param {HTMLElement} element 
 * @param {string} hoveredColor 
 */
function setHoverColor( element, hoveredColor )
{
    const defaultColor = element.style.color;
    function setColorDefault() { element.style.color = defaultColor; };
    function setColorHovered() { element.style.color = hoveredColor; }

    element.removeEventListener( 'pointerenter', setColorHovered );
    element.removeEventListener( 'pointerleave', setColorDefault );
    element.addEventListener( 'pointerenter', setColorHovered );
    element.addEventListener( 'pointerleave', setColorDefault );
};

/** Utility function to set hovered background color. Ensure to set the default background color first before calling this function
 * @param {HTMLElement} element 
 * @param {string} hoveredColor 
 */
function setHoverBgColor( element, hoveredColor )
{
    const defaultColor = element.style.backgroundColor;
    function setColorDefault() { element.style.backgroundColor = defaultColor; };
    function setColorHovered() { element.style.backgroundColor = hoveredColor; }

    element.removeEventListener( 'pointerenter', setColorHovered );
    element.removeEventListener( 'pointerleave', setColorDefault );
    element.addEventListener( 'pointerenter', setColorHovered );
    element.addEventListener( 'pointerleave', setColorDefault );
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {number} borderWidth 
 * @param {string} borderColor 
 */
function setHoverBorder( element, borderWidth, borderColor )
{
    const defaultBorder = element.style.border;
    const hoveredBorder = `${borderWidth}px solid ${borderColor}`;
    function setBorderDefault() { element.style.border = defaultBorder; };
    function setBorderHovered() { element.style.border = hoveredBorder; }

    element.removeEventListener( 'pointerenter', setBorderHovered );
    element.removeEventListener( 'pointerleave', setBorderDefault );
    element.addEventListener( 'pointerenter', setBorderHovered );
    element.addEventListener( 'pointerleave', setBorderDefault );
}

/** Get the duration between two dates in the specified units
 * @param {Date}   start_date The start date
 * @param {Date}   end_date   The end date
 * @param {string} units      The units in which the duration is required. Valid values are "s", "m", "h", "d"
 * @returns Duration between the two dates in the specified units
 */
function getDateDuration( start_date, end_date, units = "s" ) {
    const duration = end_date - start_date;
    switch( units ) {
        case "s": return duration / 1000;
        case "m": return duration / ( 1000 * 60 );
        case "h": return duration / ( 1000 * 60 * 60 );
        case "d": return duration / ( 1000 * 60 * 60 * 24 );
    }
    console.error( "Invalid units specified")
    return NaN;
}

/** Get the hash of the given string
 * @param {string} str The string to hash
 * @returns The hash of the string
 */
function getStringHash( str ) {
    let hash = 0;
    if( str.length > 0 ) {
        for( let i = 0; i < str.length; i++ ) {
            let ch = str.charCodeAt( i );
            hash = ( ( hash << 5 ) - hash ) + ch;
            hash |= 0;
        }
    }
    return hash;
}

/** Get the time string in the format "hh:mm AM/PM"
 * @returns {string} time string in the format "hh:mm AM/PM"
 */
Date.prototype.getTimeStringHHMM12 = function() {
    return this.toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit', hour12: true } );
}

/** Combine the date of the first argument with the time of the second argument
 * @param { Date } date 
 * @param { Date } time 
 * @returns { Date } The combined date and time
 */
function combineDateAndTime( date, time ) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    return new Date( year, month, day, hours, minutes, seconds );
}

/** Convert the date to a string in the standard format "YYYY-MM-DD HH:MM:SS"
 * @param {Date} date the date to convert to string
 * @returns {string} the date string in the format "YYYY-MM-DD HH:MM:SS"
 */
function dateToStringStandard( date ) {
    const year    = date.getFullYear();
    const month   = String( date.getMonth() + 1 ).padStart( 2, '0' );
    const day     = String( date.getDate() ).padStart( 2, '0' );
    const hours   = String( date.getHours() ).padStart( 2, '0' );
    const minutes = String( date.getMinutes() ).padStart( 2, '0' );
    const seconds = String( date.getSeconds() ).padStart( 2, '0' );

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// #endregion

// #region Gameplan Event

/** This is the structure that gameplan uses to represent an event as event may come from different sources
 * @typedef  { Object }  GameplanEvent
 * @property { string }  title
 * @property { string }  description
 * @property { string }  speakers
 * @property { string }  location
 * @property { Date }    start_time
 * @property { Date }    end_time
 * @property { string }  takeaway
 * @property { string }  intended_audience
 * @property { string }  tracks
 * @property { string }  format
 * @property { string }  passes
 * @property { boolean } gdc_vault_recording
 * @property { string }  source
 * @property { number }  hash
 */

var GameplanUtils = {

    /** Convert the GDC event to a gameplan event
     * 
     * @param {GDCEvent} gdc_event The GDC event to convert
     * @returns {GameplanEvent} The converted gameplan event
     */
    fromGDCEvent: function( gdc_event ) {
        /**
         * @type {GameplanEvent}
         */
        let gameplan_event = {};
        gameplan_event.title = gdc_event.session_title;
        gameplan_event.description = gdc_event.description;
        gameplan_event.speakers = gdc_event.speakers;
        gameplan_event.location = gdc_event.location;
        gameplan_event.start_time = new Date( gdc_event.start_time );
        gameplan_event.end_time = new Date( gdc_event.end_time );
        gameplan_event.takeaway = gdc_event.takeaway;
        gameplan_event.intended_audience = gdc_event.intended_audience;
        gameplan_event.tracks = gdc_event.tracks;
        gameplan_event.format = gdc_event.format;
        gameplan_event.passes = gdc_event.passes;
        gameplan_event.gdc_vault_recording = gdc_event.gdc_vault_recording == "Recorded";
        gameplan_event.source = EVENT_SOURCE.GDC;
        gameplan_event.hash = getStringHash( gameplan_event.title );
        return gameplan_event
    },

    /** Get the duration of the gameplan event
     * @param {GameplanEvent} event 
     * @param {string} units
     */
    getDuration: function( event, units ) {
        return getDateDuration( event.start_time, event.end_time, units );
    },

    /** Did the event get cancelled
     * @param { GameplanEvent } event 
     * @returns True if the event got cancelled, false otherwise
     */
    didGetCancelled: function( event ) {
        return isNaN( event.start_time.getTime() );
    },

    /** Get the gameplan event from the hash
     * @param {number} hash 
     * @returns {GameplanEvent} returns the gameplan event from the hash
     */
    getFromHash: function( hash ) {
        return all_gameplan_events[ gameplan_events_hashmap.get( hash ) ];
    },

    /** Get the time remaining to the event start in seconds
     * 
     * @param {GameplanEvent} event 
     * @returns The time remaining to the event start in seconds
     */
    getTimeToThisEvent: function( event ) {
        return ( event.start_time - new Date() ) / 1000;
    },

    /** Get the time remaining to the event start in the format "hh:mm:ss"
     * 
     * @param {GameplanEvent} event 
     * @returns A formatted string representing the time remaining to the event start
     */
    getTimeToThisEventString: function( event ) {
        const time_remaining = GameplanUtils.getTimeToThisEvent( event );
        if( time_remaining <= 0 ) {
            const time_to_end = ( event.end_time - new Date() ) / 1000;
            if( time_to_end <= 0 ) {
                return "Ended";
            }
            return "Now";
        }

        const days = Math.floor( time_remaining / ( 3600 * 24 ) );
        if( days > 0 ) {
            return `${ days }d`;
        }

        const hours = Math.floor( time_remaining / 3600 );
        if( hours > 0 ) {
            return `${ hours }h`;
        }

        const minutes = Math.floor( time_remaining / 60 );
        if( minutes > 0 ) {
            return `${ minutes }m`;
        }

        return `${ Math.floor( time_remaining ) }s`;
    },
};

// convert all the GDC events to gameplan events
import gdc_schedule from "./schedule.json";

/** All gameplan events are stored here
 * @type {GameplanEvent[]}
 */
var all_gameplan_events = [];

/** A structure to quickly find the index of a gameplan event stored in all_gameplan_events
 * @type {Map<number, number>}
 */
var gameplan_events_hashmap = new Map();
gdc_schedule.forEach( gdc_event => {
    let gameplan_event = GameplanUtils.fromGDCEvent( gdc_event );
    all_gameplan_events.push( gameplan_event );
    gameplan_events_hashmap.set( gameplan_event.hash, all_gameplan_events.length - 1 );
} );

// #endregion

// #region User data management

/** The hashes of the events that the user has saved
 * @type { number[] }
 */
var planned_events = [];

// Load the planned events from the browser's local data storage
if( localStorage.getItem( 'planned_events' ) != null ) {
    planned_events = JSON.parse( localStorage.getItem( 'planned_events' ) );
}

// A proxy is used to monitor changes made to the planned_events array and fire an event when the array is updated
const  plannedEventsUpdatedEvent = new Event( 'plannedEventsUpdated' );
var planned_events_proxy = new Proxy( planned_events, { 
    set( target, property, value ) {
        target[ property ] = value;
        document.dispatchEvent( plannedEventsUpdatedEvent );
        return true;
    }, 
    deleteProperty( target, property ) {
        delete target[ property ];
        document.dispatchEvent( plannedEventsUpdatedEvent );
        return true;
    }
} );
planned_events = planned_events_proxy; // All future operations must used push, pop, splice etc. NO DIRECT ASSIGNMENTS

// Save the planned events to the browser's local data storage
document.addEventListener( 'plannedEventsUpdated', function() { 
    localStorage.setItem( 'planned_events', JSON.stringify( planned_events ) );
} );

var hide_find_events = false;
if( localStorage.getItem( 'hide_find_events' ) != null ) {
    hide_find_events = JSON.parse( localStorage.getItem( 'hide_find_events' ) );
}

/** Check if the given event has any conflict with the planned events
 * 
 * @param {GameplanEvent} event The event to check if it has any conflict with the planned events
 * @returns {boolean} True if the event has any conflict with the planned events, false otherwise
 */
function HasAnyConflict( event ) {
    return planned_events.some( hash => {
        if( hash == event.hash ) { return false; } // Can't conflict with yourself
        let planned_event = GameplanUtils.getFromHash( hash );
        return planned_event.start_time < event.end_time && planned_event.end_time > event.start_time;
    } );
}

/** Get all the hashes of the planned events that conflicts with the given event
 * 
 * @param {GameplanEvent} event The event to check if it has a conflict with other planned events
 * @returns A list of hashes of planned events that conflicts with the given event
 */
function GetAllConflicts( event ) {
    return planned_events.filter( hash => {
        if( hash == event.hash ) { return false; } // Can't conflict with yourself
        let planned_event = GameplanUtils.getFromHash( hash );
        return planned_event.start_time < event.end_time && planned_event.end_time > event.start_time;
    } );
}


// #endregion

// #region Build Base UI Layout

var body = document.body;
body.style.backgroundColor = COLORS.SURFACE_0;

var root = document.createElement( 'div' );
root.style.width = "100%";
root.style.height = "100%";
root.style.display = "flex";
root.style.fontFamily = FONTS.IBM_PLEX_MONO;
body.appendChild( root );

var pane_left = document.createElement( 'div' );
pane_left.style.width = "35%";
pane_left.style.height = "100%";
pane_left.style.backgroundColor = COLORS.SURFACE_10;
pane_left.style.overflowY = "auto";
pane_left.style.position = "relative";
root.appendChild( pane_left );

var pane_resizer = document.createElement( 'div' );
pane_resizer.style.width = "5px";
pane_resizer.style.cursor = "ew-resize";
pane_resizer.style.backgroundColor = COLORS.TRANSPARENT;
pane_resizer.style.height = "100%";
root.appendChild( pane_resizer );

var pane_right = document.createElement( 'div' );
pane_right.style.flex = "1";
pane_right.style.height = "100%";
pane_right.style.overflowY = "hidden";
pane_right.style.position = "relative";
root.appendChild( pane_right );

var pane_left_content = document.createElement( 'div' );
pane_left_content.style.padding = "20px";
pane_left.appendChild( pane_left_content );

var header = document.createElement( 'div' );
header.style.display = "flex";
header.style.justifyContent = "space-between";
header.style.alignItems = "center";
pane_left_content.appendChild( header );

var title = document.createElement( 'a' );
title.style.color = COLORS.PRIMARY_50;
title.style.fontSize = "40px";
title.textContent = "Gameplan";
title.style.fontFamily = FONTS.DOTO;
title.style.textAlign = "left";
header.appendChild( title );

var header_options_button = document.createElement( 'i' );
header_options_button.classList.add( ...ICONS.fa_ellipsis_vertical );
header_options_button.style.cursor = "pointer";
header_options_button.style.fontSize = "24px";
header_options_button.style.color = COLORS.LIGHT_0;
setHoverColor( header_options_button, COLORS.PRIMARY_0 );
header.appendChild( header_options_button );

var header_separator = document.createElement( 'hr' );
header_separator.style.border = "none";
header_separator.style.borderTop = "1px solid " + COLORS.SURFACE_20;
header_separator.style.margin = "20px 0px";
pane_left_content.appendChild( header_separator );

var pane_right_content = document.createElement( 'div' );
pane_right_content.style.padding = "20px 20px 0px 20px";
pane_right_content.style.display = "flex";
pane_right_content.style.flexDirection = "column";
pane_right_content.style.height = "100%";
pane_right_content.style.overflow = "hidden";
pane_right.appendChild( pane_right_content );

var right_header = document.createElement( 'div' );
right_header.style.display = "flex";
right_header.style.alignItems = "center";
right_header.style.justifyContent = "center";
right_header.style.height = "48px";
pane_right_content.appendChild( right_header );

var right_title = document.createElement( 'a' ); // used by mobile layout only
right_title.style.color = COLORS.PRIMARY_50;
right_title.style.fontSize = "30px";
right_title.textContent = "Gameplan";
right_title.style.fontFamily = FONTS.DOTO;
right_title.style.textAlign = "left";
right_title.style.marginRight = "24px"
right_header.appendChild( right_title );

var right_header_separator = document.createElement( 'hr' );
right_header_separator.style.border = "none";
right_header_separator.style.borderTop = "1px solid " + COLORS.SURFACE_10;
right_header_separator.style.margin = "20px 0px";
pane_right_content.appendChild( right_header_separator );

// #endregion

// #region Mobile Layout specific UI elements

var open_pane_right_button = document.createElement( 'div' );
open_pane_right_button.style.position = "absolute";
open_pane_right_button.style.bottom = "20px";
open_pane_right_button.style.left = "0";
open_pane_right_button.style.right = "0";
open_pane_right_button.style.margin = "auto";
open_pane_right_button.style.width = "66%";
open_pane_right_button.style.height = "60px";
open_pane_right_button.style.borderRadius = "30px";
open_pane_right_button.style.backgroundColor = COLORS.LIGHT_0;
open_pane_right_button.style.display = "flex";
open_pane_right_button.style.justifyContent = "center";
open_pane_right_button.style.alignItems = "center";
open_pane_right_button.style.boxShadow = "0px 0px 10px 0px rgba( 0, 0, 0, 0.5 )";
setHoverBgColor( open_pane_right_button, COLORS.PRIMARY_20 );
pane_left.appendChild( open_pane_right_button );

var open_pane_right_text = document.createElement( 'a' );
open_pane_right_text.style.color = COLORS.DARK_0;
open_pane_right_text.style.fontSize = "24px";
open_pane_right_text.textContent = "find events";
open_pane_right_button.appendChild( open_pane_right_text );

function openPaneRight() {
    if( current_layout == LAYOUT.MOBILE ) {
        pane_right.style.display = "block";
        pane_left.style.display = "none";

        if( last_loaded_event_idx == 0 ) {
            loadMoreEventCards();
        }
    }
}

open_pane_right_button.addEventListener( 'click', openPaneRight );

var dynamic_bottom_nav = document.createElement( 'div' );
dynamic_bottom_nav.style.position = "absolute";
dynamic_bottom_nav.style.bottom = "20px";
dynamic_bottom_nav.style.left = "0";
dynamic_bottom_nav.style.right = "0";
dynamic_bottom_nav.style.margin = "auto";
dynamic_bottom_nav.style.width = "100%";
dynamic_bottom_nav.style.display = "flex";
dynamic_bottom_nav.style.justifyContent = "center";
dynamic_bottom_nav.style.alignItems = "center";
dynamic_bottom_nav.style.gap = "20px";
pane_right.appendChild( dynamic_bottom_nav );

var open_pane_left_button = document.createElement( 'div' );
//open_pane_left_button.style.width = "66%";
open_pane_left_button.style.height = "60px";
open_pane_left_button.style.borderRadius = "30px";
open_pane_left_button.style.backgroundColor = COLORS.LIGHT_0;
open_pane_left_button.style.display = "flex";
open_pane_left_button.style.maxWidth = "66%";
open_pane_left_button.style.flex = "1";
open_pane_left_button.style.justifyContent = "center";
open_pane_left_button.style.alignItems = "center";
open_pane_left_button.style.boxShadow = "0px 0px 10px 0px rgba( 0, 0, 0, 0.5 )";
setHoverBgColor( open_pane_left_button, COLORS.PRIMARY_20 );
dynamic_bottom_nav.appendChild( open_pane_left_button );

var open_pane_left_text = document.createElement( 'a' );
open_pane_left_text.style.color = COLORS.DARK_0;
open_pane_left_text.style.fontSize = "24px";
open_pane_left_text.textContent = "done";
open_pane_left_button.appendChild( open_pane_left_text );

function openPaneLeft() {
    if( current_layout == LAYOUT.MOBILE ) {
        pane_right.style.display = "none";
        pane_left.style.display = "block";
    }
}

open_pane_left_button.addEventListener( 'click', openPaneLeft );

var time_slot_buttons_container = document.createElement( 'div' );
time_slot_buttons_container.style.display = "none";
time_slot_buttons_container.style.alignItems = "center";
time_slot_buttons_container.style.justifyContent = "start";
time_slot_buttons_container.style.backgroundColor = COLORS.LIGHT_0;
time_slot_buttons_container.style.boxShadow = "0px 0px 10px 0px rgba( 0, 0, 0, 0.5 )";
time_slot_buttons_container.style.borderRadius = "30px";
dynamic_bottom_nav.appendChild( time_slot_buttons_container );

var prev_time_slot_button = document.createElement( 'div' );
prev_time_slot_button.style.width = "60px";
prev_time_slot_button.style.height = "60px";
prev_time_slot_button.style.borderRadius = "30px 0px 0px 30px";
prev_time_slot_button.style.backgroundColor = COLORS.LIGHT_0;
prev_time_slot_button.style.color = COLORS.DARK_0;
prev_time_slot_button.style.display = "flex";
prev_time_slot_button.style.justifyContent = "center";
prev_time_slot_button.style.alignItems = "center";
setHoverColor( prev_time_slot_button, COLORS.PRIMARY_0 );
time_slot_buttons_container.appendChild( prev_time_slot_button );

var prev_time_slot_icon = document.createElement( 'i' );
prev_time_slot_icon.classList.add( ...ICONS.fa_chevron_left );
prev_time_slot_icon.style.fontSize = "24px";
prev_time_slot_button.appendChild( prev_time_slot_icon );

var current_time_slot_text = document.createElement( 'a' );
current_time_slot_text.style.color = COLORS.DARK_0;
current_time_slot_text.style.fontSize = "14px";
current_time_slot_text.style.fontWeight = "400";
current_time_slot_text.style.margin = "0px 2px";
current_time_slot_text.textContent = "9:30am - 10:30am";
time_slot_buttons_container.appendChild( current_time_slot_text );

var next_time_slot_button = document.createElement( 'div' );
next_time_slot_button.style.width = "60px";
next_time_slot_button.style.height = "60px";
next_time_slot_button.style.borderRadius = "0px 30px 30px 0px";
next_time_slot_button.style.backgroundColor = COLORS.LIGHT_0;
next_time_slot_button.style.color = COLORS.DARK_0;
next_time_slot_button.style.display = "flex";
next_time_slot_button.style.justifyContent = "center";
next_time_slot_button.style.alignItems = "center";
setHoverColor( next_time_slot_button, COLORS.PRIMARY_0 );
time_slot_buttons_container.appendChild( next_time_slot_button );

var next_time_slot_icon = document.createElement( 'i' );
next_time_slot_icon.classList.add( ...ICONS.fa_chevron_right );
next_time_slot_icon.style.fontSize = "24px";
next_time_slot_button.appendChild( next_time_slot_icon );

prev_time_slot_button.addEventListener( 'click', function() {
    let filters = applied_search_filter;
    filters.start_datetime = new Date( filters.start_datetime.getTime() - 1000 * 60 * 60 );
    filters.end_datetime = new Date( filters.end_datetime.getTime() - 1000 * 60 * 60 );
    applyFilters( filters );
} );

next_time_slot_button.addEventListener( 'click', function() { 
    let filters = applied_search_filter;
    filters.start_datetime = new Date( filters.start_datetime.getTime() + 1000 * 60 * 60 );
    filters.end_datetime = new Date( filters.end_datetime.getTime() + 1000 * 60 * 60 );
    applyFilters( filters );
} );

// #endregion

// #region Resize Pane Logic
pane_resizer.addEventListener( 'mousedown', function( e ) {
    e.preventDefault();
    document.body.style.cursor = "ew-resize";
    document.addEventListener( 'mousemove', resizePane );
    document.addEventListener( 'mouseup', stopResizePane );
} );

/** 
 * @param {MouseEvent} e */
function resizePane( e )
{
    let clientX = e.clientX;
    let rootWidth = root.getBoundingClientRect().width;
    let newLeftWidth = ( clientX / rootWidth ) * 100;
    if( newLeftWidth >= 25 && newLeftWidth <= 45 )
    {
        pane_left.style.width = newLeftWidth + "%";
    }
}

function stopResizePane()
{
    document.body.style.cursor = "default";
    document.removeEventListener( 'mousemove', resizePane );
    document.removeEventListener( 'mouseup', stopResizePane );
}

// #endregion

// #region Options Menu

/**
 * @typedef  { Object }   OptionsMenuItem
 * @property { string }   text
 * @property { string[] } icon
 * @property { function } action
 */

var last_options_menu_instigator = null;

var options_menu = document.createElement( 'div' );
options_menu.style.position = "absolute";
options_menu.style.display = "none";
options_menu.style.zIndex = "20";
options_menu.style.color = COLORS.LIGHT_0;
options_menu.style.backgroundColor = COLORS.SURFACE_10;
options_menu.style.boxShadow = "0px 0px 10px 0px rgba( 0, 0, 0, 0.5 )";
document.body.appendChild( options_menu );

/**
 * 
 * @param { OptionsMenuItem[] } options     The list of menu items to display
 * @param { HTMLElement }       instigator  The element that triggered the options menu
 */
function openOptionsMenu( options, instigator ) {
    const instigator_rect = instigator.getBoundingClientRect(); // in case instigator was part of the last options menu
    options_menu.innerHTML = ""; // clear any existing menu items
    
    options.forEach( item => { 
        let menu_item = document.createElement( 'div' );
        menu_item.style.padding = "10px 15px";
        menu_item.style.display = "flex";
        menu_item.style.alignItems = "center";
        menu_item.style.cursor = "pointer";
        setHoverColor( menu_item, COLORS.PRIMARY_0 );
        setHoverBgColor( menu_item, COLORS.SURFACE_20 );
        options_menu.appendChild( menu_item );

        let icon_centering = document.createElement( 'div' );
        icon_centering.style.width = "20px";
        icon_centering.style.height = "20px";
        icon_centering.style.display = "flex";
        icon_centering.style.justifyContent = "center";
        icon_centering.style.alignItems = "center";
        menu_item.appendChild( icon_centering );

        let icon = document.createElement( 'i' );
        icon.classList.add( ...item.icon );
        icon.style.color = "inherit";
        icon.style.fontSize = "20px";
        icon_centering.appendChild( icon );

        let text = document.createElement( 'a' );
        text.textContent = item.text;
        text.style.color = "inherit";
        text.style.fontSize = "16px";
        text.style.marginLeft = "20px";
        text.style.fontFamily = FONTS.IBM_PLEX_MONO;
        menu_item.appendChild( text );

        menu_item.addEventListener( 'click', function() { item.action( menu_item ); } );
    } );

    options_menu.style.display = "block";
    let menu_rect = options_menu.getBoundingClientRect();
    options_menu.style.top = instigator_rect.top + "px";
    if ( instigator && document.body.contains( instigator ) )
    {
        options_menu.style.left = ( instigator_rect.left - menu_rect.width - 6 ) + "px";
    } else {
        options_menu.style.left = instigator_rect.left + "px";
    }


    last_options_menu_instigator = instigator;
}

document.addEventListener( 'click', function( e ) {
    if( options_menu.style.display != "none" && last_options_menu_instigator != null && !last_options_menu_instigator.contains( e.target ) ) {
        options_menu.style.display = "none";
        last_options_menu_instigator = null;
    }
} );

// #endregion

// #region Header Options Menu

/** A list of menu items that can be used by the header options button
 * @type { OptionsMenuItem[] }
 */
const HEADER_OPTIONS_MENU_ITEMS = 
[
    { text: "Save",   icon: ICONS.fa_floppy_disk,               action: function() { SavePlannedEvents();     } },
    { text: "Import", icon: ICONS.fa_arrow_right_from_bracket,  action: function() { ImportPlannedEvents();   } },
    { text: "Links",  icon: ICONS.fa_link,                      action: function( menu_item ) { OpenLinksMenu( menu_item ) } },
];

/** A list of menu items that can be used to show the social links
 * @type { OptionsMenuItem[] }
 */
const LINKS_MENU_ITEMS =
[
    { text: "Source Code", icon: ICONS.fa_code, action: function() { window.open( "https://github.com/hibzzgames/gameplan" ) } },
    { text: "Bsky", icon: ICONS.fa_bluesky, action: function() { window.open( "https://bsky.app/profile/slip.hibzz.games" ) } },
];

// add the event listener to the header options button to open the options menu
header_options_button.addEventListener( 'click', function() {
    var options = [...HEADER_OPTIONS_MENU_ITEMS];
    if( current_layout == LAYOUT.MOBILE ) {
        options.push( { 
            text: hide_find_events ? "Show Find Events" : "Hide Find Events", 
            icon: hide_find_events ? ICONS.fa_eye : ICONS.fa_eye_slash,
            action: function() { ToggleFindEvents(); } 
        } );
    }

    openOptionsMenu( options, header_options_button );
} );

function SavePlannedEvents() {
    var save_data = {};
    save_data[ "planned_events" ] = planned_events;
    var blob = new Blob( [ JSON.stringify( save_data ) ], { type: "application/json" } );
    var url = URL.createObjectURL( blob );
    var a = document.createElement( 'a' );
    a.href = url;
    a.download = "gameplan.json";
    document.body.appendChild( a );
    a.click();
    document.body.removeChild( a );
    URL.revokeObjectURL( url );
}

function ImportPlannedEvents() {
    var input = document.createElement( 'input' );
    input.type = "file";
    input.accept = ".json";
    input.style.display = "none";
    document.body.appendChild( input );
    input.addEventListener( 'change', function() {
        var file = input.files[ 0 ];
        var reader = new FileReader();
        reader.onload = function() {
            if( planned_events.length == 0 || confirm( "It appears you have some saved plans here. Are you sure you want to overwrite it with the imported file?" ) ) {
                planned_events.splice( 0, planned_events.length );
                JSON.parse( reader.result )[ "planned_events" ].forEach( hash => {
                    planned_events.push( hash );
                } );
            }
        };
        reader.readAsText( file );
        document.body.removeChild( input );
    } );
    input.click();
}

function OpenLinksMenu( menu_item ) {
    openOptionsMenu( LINKS_MENU_ITEMS, menu_item );
}

function ToggleFindEvents() {
    hide_find_events = !hide_find_events;
    localStorage.setItem( 'hide_find_events', hide_find_events );
    open_pane_right_button.style.display = hide_find_events ? "none" : "flex";
}

// #endregion

// #region Add day selectors and manage current selected day

const DAYS = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
const DATES = [ new Date("2025-03-16"), new Date("2025-03-17"), new Date("2025-03-18"), new Date("2025-03-19"), new Date("2025-03-20"), new Date("2025-03-21"), new Date("2025-03-22") ];
const today = new Date();
var current_selected_day = today < DATES[ 1 ] ? 1 : today > DATES[ 6 ] ? 6 : today.getDay();

var days_container = document.createElement( 'div' );
days_container.style.display = "flex";
days_container.style.justifyContent = "center";
days_container.style.gap = "20px";
pane_left_content.appendChild( days_container );

var day_highlighter = document.createElement( 'div' );
day_highlighter.style.position = "absolute";
day_highlighter.style.bottom = "-10px";
day_highlighter.style.width = "60%";
day_highlighter.style.height = "3px";
day_highlighter.style.backgroundColor = "inherit";

for( let i = 1; i <= 5; i++ ) {
    const ELEMENT_SIZE = 40;

    let day_div = document.createElement( 'div' );
    day_div.style.backgroundColor = COLORS.LIGHT_0;
    day_div.style.width = ELEMENT_SIZE + "px";
    day_div.style.height = ELEMENT_SIZE + "px";
    day_div.style.borderRadius = "50%";
    day_div.style.display = "flex";
    day_div.style.justifyContent = "center";
    day_div.style.alignItems = "center";
    day_div.style.position = "relative";
    day_div.style.cursor = "pointer";
    setHoverBgColor( day_div, COLORS.PRIMARY_20 );
    days_container.appendChild( day_div );

    let day_text = document.createElement( 'a' );
    day_text.textContent = DAYS[ i ].charAt( 0 );
    day_text.style.color = COLORS.DARK_0;
    day_text.style.fontWeight = "500";
    day_div.appendChild( day_text );

    if( i == current_selected_day ) {
        day_div.appendChild( day_highlighter );
    }

    day_div.addEventListener( 'click', function() {
        if( i != current_selected_day ) {
            day_div.appendChild( day_highlighter );
            current_selected_day = i;
            rebuildPlannedEvents();
        }
    } );
};

// #endregion

// #region Define search bar and filter layout

var right_header_search_elements = document.createElement( 'div' );
right_header_search_elements.style.display = "flex";
right_header_search_elements.style.gap = "20px";
right_header_search_elements.style.alignItems = "center";
right_header_search_elements.style.justifyContent = "center";
right_header_search_elements.style.width = "80%";
right_header.appendChild( right_header_search_elements );

var search_bar = document.createElement( 'div' );
search_bar.style.position = "relative";
search_bar.style.width = "100%";
search_bar.style.height = "40px";
right_header_search_elements.appendChild( search_bar );

var search_bar_input = document.createElement( 'input' );
search_bar_input.type = "text";
search_bar_input.placeholder = "Search events...";
search_bar_input.style.width = "100%";
search_bar_input.style.height = "100%";
search_bar_input.style.border = "none";
search_bar_input.style.borderRadius = "20px";
search_bar_input.style.padding = "0px 20px";
search_bar_input.style.backgroundColor = COLORS.SURFACE_20;
search_bar_input.style.color = COLORS.LIGHT_0;
search_bar_input.style.fontSize = "16px";
search_bar_input.style.outline = "none";
search_bar_input.style.fontFamily = FONTS.IBM_PLEX_MONO;
search_bar.appendChild( search_bar_input );

var search_bar_button = document.createElement( 'i' );
search_bar_button.classList.add( ...ICONS.fa_magnifying_glass );
search_bar_button.style.cursor = "pointer";
search_bar_button.style.fontSize = "20px";
search_bar_button.style.position = "absolute";
search_bar_button.style.right = "20px";
search_bar_button.style.top = "10px";
search_bar_button.style.color = COLORS.LIGHT_0;
setHoverColor( search_bar_button, COLORS.PRIMARY_0 );
search_bar.appendChild( search_bar_button );

var filter_button = document.createElement( 'i' );
filter_button.classList.add( ...ICONS.fa_filter );
filter_button.style.cursor = "pointer";
filter_button.style.fontSize = "20px";
filter_button.style.color = COLORS.LIGHT_0;
setHoverColor( filter_button, COLORS.PRIMARY_0 );
right_header_search_elements.appendChild( filter_button );

search_bar_input.addEventListener( 'input', function() {
    if( search_bar_input.value.length > 0 ) {
        search_bar_button.classList.remove( ...ICONS.fa_magnifying_glass );
        search_bar_button.classList.add( ...ICONS.fa_paper_plane );
        search_bar_button.style.color = COLORS.PRIMARY_50;
        setHoverColor( search_bar_button, COLORS.PRIMARY_0 );
    } else {
        search_bar_button.classList.remove( ...ICONS.fa_paper_plane );
        search_bar_button.classList.add( ...ICONS.fa_magnifying_glass );
        search_bar_button.style.color = COLORS.LIGHT_0;
        setHoverColor( search_bar_button, COLORS.PRIMARY_0 );
    }
} );

search_bar_input.addEventListener( 'focus', function() {
    if( current_layout == LAYOUT.MOBILE ) {
        right_title.style.display = "none";
        right_header.style.justifyContent = "center";
    }
} );

search_bar_input.addEventListener( 'blur', function() {
    if( current_layout == LAYOUT.MOBILE ) {
        right_title.style.display = "block";
        right_header.style.justifyContent = "space-between";
    }
} );

search_bar_input.addEventListener( 'keyup', function( e ) {
    if( e.key == "Enter" ) {
        search_bar_input.blur(); 
        SearchEventsAndApplyFiltersFromSearchBar();
    }
} );

search_bar_button.addEventListener( 'click', SearchEventsAndApplyFiltersFromSearchBar );

filter_button.addEventListener( 'click', function() { toggleOpenFilterMenu( filter_button ) } );

// #endregion

// #region create the layout for displaying events

/** Event hashes of events that are have their details pane open upon event pane getting rebuilt
 * @type { number[] }
 */
var force_open_these_events = [];

var events_container = document.createElement( 'div' );
events_container.style.overflowY = "auto";
events_container.style.flex = "1";
pane_right_content.appendChild( events_container );

/**
 * 
 * @param {GameplanEvent} event 
 */
function buildEventCard( event ) {
    let event_card = document.createElement( 'div' );
    event_card.style.margin = "20px 0px";
    event_card.style.display = "flex";
    event_card.style.flexDirection = "column";
    event_card.style.backgroundColor = COLORS.SURFACE_10;

    let event_primary_info_container = document.createElement( 'div' );
    event_primary_info_container.style.padding = "20px";
    event_primary_info_container.style.display = "flex";
    event_primary_info_container.style.justifyContent = "space-between";
    event_primary_info_container.style.backgroundColor = COLORS.SURFACE_10;
    setHoverBgColor( event_primary_info_container, COLORS.SURFACE_20 );
    event_primary_info_container.style.cursor = "pointer";
    event_card.appendChild( event_primary_info_container );

    let event_title_info_container = document.createElement( 'div' );
    event_title_info_container.style.width = "70%";
    event_title_info_container.style.display = "flex";
    event_title_info_container.style.flexDirection = "column";
    event_primary_info_container.appendChild( event_title_info_container );

    let event_tags_container = document.createElement( 'div' );
    event_tags_container.style.display = "flex";
    event_tags_container.style.gap = "8px";
    event_tags_container.style.alignItems = "center";
    event_tags_container.style.justifyContent = "left";
    event_title_info_container.appendChild( event_tags_container );

    let event_format = document.createElement( 'a' );
    event_format.textContent = event.format;
    event_format.style.color = COLORS.PRIMARY_50;
    event_format.style.fontSize = "12px";
    event_format.style.fontWeight = "300";
    event_format.style.textAlign = "left";
    event_tags_container.appendChild( event_format );

    let event_tag_separator = document.createElement( 'i' );
    event_tag_separator.classList.add( ...ICONS.fa_circle );
    event_tag_separator.style.color = COLORS.PRIMARY_50;
    event_tag_separator.style.fontSize = "4px";
    event_tags_container.appendChild( event_tag_separator );

    let event_track = document.createElement( 'a' );
    event_track.textContent = event.tracks;
    event_track.style.color = COLORS.PRIMARY_50;
    event_track.style.fontSize = "12px";
    event_track.style.fontWeight = "300";
    event_track.style.textAlign = "left";
    event_tags_container.appendChild( event_track );

    let event_title = document.createElement( 'a' );
    event_title.textContent = event.title;
    event_title.style.color = COLORS.LIGHT_0;
    event_title.style.fontSize = "16px";
    event_title.style.fontWeight = "500";
    event_title.style.textAlign = "left";
    event_title_info_container.appendChild( event_title );

    let event_speakers = document.createElement( 'a' );
    event_speakers.textContent = event.speakers;
    event_speakers.style.color = COLORS.LIGHT_0;
    event_speakers.style.fontSize = "13px";
    event_speakers.style.fontWeight = "400";
    event_speakers.style.textAlign = "left";
    event_speakers.style.marginTop = "6px";
    event_title_info_container.appendChild( event_speakers );

    let event_time_and_conflicts_container = document.createElement( 'div' );
    event_time_and_conflicts_container.style.display = "flex";
    event_time_and_conflicts_container.style.gap = "8px";
    event_time_and_conflicts_container.style.alignItems = "center";
    event_time_and_conflicts_container.style.justifyContent = "left";
    event_time_and_conflicts_container.style.marginTop = "6px";
    event_title_info_container.appendChild( event_time_and_conflicts_container );

    let event_time = document.createElement( 'a' );
    event_time.textContent = `${ DAYS[ event.start_time.getDay() ] } [${ event.start_time.getTimeStringHHMM12() } - ${ event.end_time.getTimeStringHHMM12() }]`;
    event_time.style.color = COLORS.PRIMARY_50;
    event_time.style.fontSize = "13px";
    event_time.style.fontWeight = "400";
    event_time.style.textAlign = "left";
    event_time_and_conflicts_container.appendChild( event_time );

    let event_conflicts = document.createElement( 'a' );
    event_conflicts.style.display = HasAnyConflict( event ) ? "block" : "none"; 
    event_conflicts.textContent = "- has conflicts";
    event_conflicts.style.color = COLORS.PRIMARY_50;
    event_conflicts.style.fontSize = "13px";
    event_conflicts.style.fontWeight = "400";
    event_conflicts.style.textAlign = "left";
    event_time_and_conflicts_container.appendChild( event_conflicts );

    function updateConflictStatus() 
    {
        if( document.body.contains( event_conflicts ) ) {
            event_conflicts.style.display = HasAnyConflict( event ) ? "block" : "none"; 
        } else {
            document.removeEventListener( 'plannedEventsUpdated', updateConflictStatus );
        }
    }
    document.addEventListener( 'plannedEventsUpdated', updateConflictStatus );

    let event_subscribe_button = document.createElement('div');
    event_subscribe_button.style.width = "30px";
    event_subscribe_button.style.height = "30px";
    event_subscribe_button.style.borderRadius = "50%";
    event_subscribe_button.style.display = "flex";
    event_subscribe_button.style.justifyContent = "center";
    event_subscribe_button.style.alignItems = "center";
    event_subscribe_button.style.cursor = "pointer";
    event_primary_info_container.appendChild( event_subscribe_button );

    let event_add_icon = document.createElement( 'i' ); // icon class list is added in the updateSubscribeButton function
    event_add_icon.style.fontSize = "16px";
    event_subscribe_button.appendChild( event_add_icon );

    let event_more_info_container = document.createElement( 'div' );
    event_more_info_container.style.padding = "20px 20px 20px 20px";
    event_more_info_container.style.display = "none";
    event_more_info_container.style.flexDirection = "column";
    event_card.appendChild( event_more_info_container );
    if( force_open_these_events.includes( event.hash ) ) {
        event_more_info_container.style.display = "flex";
    }

    let event_more_info_tags_container = document.createElement( 'div' );
    event_more_info_tags_container.style.display = "flex";
    event_more_info_tags_container.style.gap = "8px";
    event_more_info_tags_container.style.alignItems = "center";
    event_more_info_tags_container.style.justifyContent = "left"; 
    event_more_info_tags_container.style.marginBottom = "20px";
    event_more_info_container.appendChild( event_more_info_tags_container );

    /**
     * @param {string} text 
     * @param {string[]} icon 
     */
    function addMoreInfoTag( text, icon ) {
        let tag_icon = document.createElement( 'i' );
        tag_icon.classList.add( ...icon );
        tag_icon.style.color = COLORS.PRIMARY_50;
        tag_icon.style.fontSize = "14px";
        event_more_info_tags_container.appendChild( tag_icon );

        let tag_text = document.createElement( 'a' );
        tag_text.textContent = text;
        tag_text.style.color = COLORS.LIGHT_0;
        tag_text.style.fontSize = "14px";
        tag_text.style.fontWeight = "300";
        tag_text.style.textAlign = "left";
        tag_text.style.marginRight = "10px";
        event_more_info_tags_container.appendChild( tag_text );
    }
    addMoreInfoTag( event.location, ICONS.fa_location );
    addMoreInfoTag( event.passes, ICONS.fa_ticket );
    if( event.gdc_vault_recording ) {
        addMoreInfoTag( "Recorded", ICONS.fa_video );
    }

    if ( event.description.trim().length > 0 ) {
        let event_description_title = document.createElement( 'a' );
        event_description_title.textContent = "Description";
        event_description_title.style.color = COLORS.PRIMARY_50;
        event_description_title.style.fontSize = "14px";
        event_description_title.style.fontWeight = "500";
        event_description_title.style.textAlign = "left";
        event_description_title.style.marginBottom = "5px";
        event_more_info_container.appendChild( event_description_title );

        let event_description = document.createElement( 'a' );
        event_description.textContent = event.description;
        event_description.style.color = COLORS.LIGHT_0;
        event_description.style.fontSize = "14px";
        event_description.style.fontWeight = "400";
        event_description.style.textAlign = "left";
        event_more_info_container.appendChild( event_description );
    }

    if ( event.takeaway.trim().length > 0 ) {
        let event_takeaway_title = document.createElement( 'a' );
        event_takeaway_title.textContent = "~ Takeaways";
        event_takeaway_title.style.color = COLORS.PRIMARY_50;
        event_takeaway_title.style.fontSize = "14px";
        event_takeaway_title.style.fontWeight = "500";
        event_takeaway_title.style.textAlign = "left";
        event_takeaway_title.style.marginTop = "15px";
        event_takeaway_title.style.marginBottom = "5px";
        event_more_info_container.appendChild( event_takeaway_title );

        let event_takeaway = document.createElement( 'a' );
        event_takeaway.textContent = event.takeaway;
        event_takeaway.style.color = COLORS.LIGHT_0;
        event_takeaway.style.fontSize = "14px";
        event_takeaway.style.fontWeight = "400";
        event_takeaway.style.textAlign = "left";
        event_takeaway.style.marginLeft = "20px";
        event_more_info_container.appendChild( event_takeaway );
    }

    if ( event.intended_audience.trim().length > 0 ) {
        let event_intended_audience_title = document.createElement( 'a' );
        event_intended_audience_title.textContent = "~ Intended Audience";
        event_intended_audience_title.style.color = COLORS.PRIMARY_50;
        event_intended_audience_title.style.fontSize = "14px";
        event_intended_audience_title.style.fontWeight = "500";
        event_intended_audience_title.style.textAlign = "left";
        event_intended_audience_title.style.marginTop = "15px";
        event_intended_audience_title.style.marginBottom = "5px";
        event_more_info_container.appendChild( event_intended_audience_title );

        let event_intended_audience = document.createElement( 'a' );
        event_intended_audience.textContent = event.intended_audience;
        event_intended_audience.style.color = COLORS.LIGHT_0;
        event_intended_audience.style.fontSize = "14px";
        event_intended_audience.style.fontWeight = "400";
        event_intended_audience.style.textAlign = "left";
        event_intended_audience.style.marginLeft = "20px";
        event_more_info_container.appendChild( event_intended_audience );
    }

    event_primary_info_container.addEventListener( 'click', function () {
        event_more_info_container.style.display = event_more_info_container.style.display == "none" ? "flex" : "none";
    } );

    function updateSubscribeButton() {
        if( planned_events.includes( event.hash ) ) {
            event_add_icon.classList.remove( ...ICONS.fa_plus );
            event_add_icon.classList.add( ...ICONS.fa_check );
            event_subscribe_button.style.backgroundColor = COLORS.PRIMARY_0;
            event_subscribe_button.style.color = COLORS.DARK_0;
            event_subscribe_button.style.borderColor = "2px solid" + COLORS.PRIMARY_0;
            setHoverBgColor( event_subscribe_button, COLORS.PRIMARY_10 );
            setHoverColor( event_subscribe_button, COLORS.DARK_0 );
            setHoverBorder( event_subscribe_button, 2, COLORS.PRIMARY_10 );
        }
        else {
            event_add_icon.classList.remove( ...ICONS.fa_check );
            event_add_icon.classList.add( ...ICONS.fa_plus );
            event_subscribe_button.style.color = COLORS.LIGHT_0;
            event_subscribe_button.style.backgroundColor = COLORS.TRANSPARENT;
            event_subscribe_button.style.border = "2px solid " + COLORS.LIGHT_0;
            setHoverBgColor( event_subscribe_button, COLORS.PRIMARY_0 );
            setHoverColor( event_subscribe_button, COLORS.DARK_0 );
            setHoverBorder( event_subscribe_button, 2, COLORS.PRIMARY_0 );
        }
    }

    event_subscribe_button.addEventListener( 'click', function( e ) { 
        e.stopPropagation();
        // has the user already subscribed to this event?
        if( planned_events.includes( event.hash ) ) {
            // remove the event from the list of saved events
            const idx = planned_events.indexOf( event.hash );
            if( idx > -1 ) {
                planned_events.splice( idx, 1 );
            }
        }
        else {
            // add the event to the list of saved events
            planned_events.push( event.hash );
        }
    } );

    document.addEventListener( 'plannedEventsUpdated', updateSubscribeButton );

    updateSubscribeButton(); // set initial state

    return event_card;
}

// #endregion

// #region Display planned events for the selected day

var planned_events_container = document.createElement( 'div' );
planned_events_container.style.overflowY = "auto";
planned_events_container.style.flex = "1";
planned_events_container.style.marginTop = "20px";
pane_left_content.appendChild( planned_events_container );

/** Build the card for a given saved events
 * @param { number } event_hash
 * @returns { HTMLDivElement } The card for the saved event
 */
function buildPlannedEventCard ( event_hash ) {
    let event = GameplanUtils.getFromHash( event_hash );

    let card = document.createElement( 'div' );
    card.style.margin = "20px 0px";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.backgroundColor = COLORS.SURFACE_20;

    let card_header = document.createElement( 'div' );
    card_header.style.padding = "20px";
    card_header.style.display = "flex";
    card_header.style.justifyContent = "space-between";
    card_header.style.backgroundColor = COLORS.SURFACE_20;
    setHoverBgColor( card_header, COLORS.SURFACE_30 );
    card_header.style.cursor = "pointer";
    card.appendChild( card_header );

    let card_header_left = document.createElement( 'div' );
    card_header_left.style.display = "flex";
    card_header_left.style.flexDirection = "column";
    card_header_left.style.alignItems = "left";
    card_header_left.style.justifyContent = "center";
    card_header_left.style.width = "70%";
    card_header.appendChild( card_header_left );

    let card_header_right = document.createElement( 'div' );
    card_header_right.style.display = "flex";
    card_header_right.style.flexDirection = "column";
    card_header_right.style.alignItems = "center";
    card_header_right.style.justifyContent = "center";
    card_header.appendChild( card_header_right );

    let card_more_container = document.createElement( 'div' );
    card_more_container.style.display = "none";
    card_more_container.style.justifyContent = "space-between";
    card_more_container.style.padding = "20px";
    card.appendChild( card_more_container );

    let card_more_left_container = document.createElement( 'div' );
    card_more_left_container.style.display = "flex";
    card_more_left_container.style.flexDirection = "column";
    card_more_left_container.style.alignItems = "left";
    card_more_left_container.style.justifyContent = "center";
    card_more_container.appendChild( card_more_left_container );

    let card_more_right_container = document.createElement( 'div' );
    card_more_right_container.style.display = "flex";
    card_more_right_container.style.flexDirection = "column";
    card_more_right_container.style.alignItems = "right";
    card_more_right_container.style.justifyContent = "center";
    card_more_container.appendChild( card_more_right_container );

    let card_title = document.createElement( 'a' );
    card_title.textContent = event.title.trim();
    card_title.style.color = COLORS.LIGHT_0;
    card_title.style.fontSize = "18px";
    card_title.style.fontWeight = "400";
    card_title.style.textAlign = "left";
    card_header_left.appendChild( card_title );

    let card_conflict = document.createElement( 'a' );
    card_conflict.style.display = "none";
    card_conflict.textContent = "Conflicts detected";
    card_conflict.style.color = COLORS.PRIMARY_50;
    card_conflict.style.fontSize = "14px";
    card_conflict.style.fontWeight = "400";
    card_conflict.style.textAlign = "left";
    card_conflict.style.marginTop = "6px";
    card_header_left.appendChild( card_conflict );

    let card_time_to_go = document.createElement( 'a' );
    card_time_to_go.textContent = GameplanUtils.getTimeToThisEventString( event );
    card_time_to_go.style.color = COLORS.PRIMARY_50;
    card_time_to_go.style.fontSize = "29px"; // golden ratio
    card_time_to_go.style.fontWeight = "400";
    card_header_right.appendChild( card_time_to_go );

    // update the time to go every minute
    let interval_id = setInterval( function() {
        if( !document.body.contains( card_time_to_go ) ) {
            clearInterval( interval_id );
            interval_id = null;
            return;
        }
        card_time_to_go.textContent = GameplanUtils.getTimeToThisEventString( event );
     }, 60000 );

    function addIconAndTextToMoreInfo( icon, text) 
    {
        let container = document.createElement( 'div' );
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.gap = "8px";
        container.style.marginTop = "10px";
        card_more_left_container.appendChild( container );

        let icon_element = document.createElement( 'i' );
        icon_element.classList.add( ...icon );
        icon_element.style.color = COLORS.PRIMARY_50;
        icon_element.style.fontSize = "14px";
        container.appendChild( icon_element );

        let text_element = document.createElement( 'a' );
        text_element.textContent = text;
        text_element.style.color = COLORS.PRIMARY_50;
        text_element.style.fontSize = "14px";
        text_element.style.fontWeight = "400";
        container.appendChild( text_element );
    }

    addIconAndTextToMoreInfo( ICONS.fa_location, event.location );
    addIconAndTextToMoreInfo( ICONS.fa_hourglass, `${ event.start_time.getTimeStringHHMM12() } - ${ event.end_time.getTimeStringHHMM12() }` );

    let card_conflict_separator = document.createElement( 'hr' );
    card_conflict_separator.style.width = "100%";
    card_conflict_separator.style.border = "none";
    card_conflict_separator.style.borderTop = "1px solid " + COLORS.SURFACE_30;
    card_conflict_separator.style.marginTop = "20px";
    card_conflict_separator.style.display = "none";
    card_more_left_container.appendChild( card_conflict_separator );

    let card_conflict_list_title = document.createElement( 'a' );
    card_conflict_list_title.textContent = "Conflicts:";
    card_conflict_list_title.style.color = COLORS.LIGHT_0;
    card_conflict_list_title.style.fontSize = "14px";
    card_conflict_list_title.style.fontWeight = "500";
    card_conflict_list_title.style.marginTop = "10px";
    card_conflict_list_title.style.display = "none";
    card_more_left_container.appendChild( card_conflict_list_title );

    let card_conflict_list = document.createElement( 'div' );
    card_conflict_list.style.display = "none";
    card_conflict_list.style.flexDirection = "column";
    card_conflict_list.style.alignItems = "left";
    card_conflict_list.style.justifyContent = "center";
    card_conflict_list.style.marginTop = "10px";
    card_more_left_container.appendChild( card_conflict_list );

    function refreshConflicts() {
        card_conflict_list.innerHTML = "";
        let conflicts = GetAllConflicts( event );
        if( conflicts.length <= 0 ) {
            card_conflict.style.display = "none";
            card_conflict_list_title.style.display = "none";
            card_conflict_list.style.display = "none";
            card_conflict_separator.style.display = "none";
        } else {
            card_conflict_separator.style.display = "block";
            card_conflict.style.display = "block";
            card_conflict.textContent = `${ conflicts.length } conflict${ conflicts.length > 1 ? "s" : "" } detected`;
            card_conflict_list_title.style.display = "block";
            card_conflict_list.style.display = "flex";
            card_conflict_list.innerHTML = "";
            conflicts.forEach( conflict => { 
                let conflict_event = GameplanUtils.getFromHash( conflict );
                let conflict_info = document.createElement( 'a' );
                conflict_info.textContent = `> ${ conflict_event.title.trim() }`;
                conflict_info.style.color = COLORS.PRIMARY_50;
                conflict_info.style.fontSize = "14px";
                conflict_info.style.fontWeight = "400";
                conflict_info.style.textAlign = "left";
                conflict_info.style.display = "block";
                conflict_info.style.textIndent = "-1.5em";
                conflict_info.style.paddingLeft = "1.5em";
                conflict_info.style.marginTop = "5px";
                card_conflict_list.appendChild( conflict_info );
            } );
        }
        
    }
    refreshConflicts();
    document.addEventListener( 'plannedEventsUpdated', refreshConflicts );

    let card_learn_more_button = document.createElement( 'i' );
    card_learn_more_button.classList.add( ...ICONS.fa_ellipsis_horizontal );
    card_learn_more_button.style.color = COLORS.LIGHT_0;
    card_learn_more_button.style.fontSize = "20px";
    card_learn_more_button.style.cursor = "pointer";

    // align to the top of the container
    card_learn_more_button.style.margin = "0px 0px auto 0px";

    setHoverColor( card_learn_more_button, COLORS.PRIMARY_0 );
    card_more_right_container.appendChild( card_learn_more_button );

    function deletePlannedEvent() {
        const idx = planned_events.indexOf( event_hash );
        if( idx > -1 ) {
            planned_events.splice( idx, 1 );
        }
    }

    function openInEventPage() {
        force_open_these_events.push( event_hash );
        SearchEventsAndApplyFilters( "id:" + event_hash, default_search_filter );
        force_open_these_events.splice( force_open_these_events.indexOf( event_hash ), 1 );
        openPaneRight();
    }

    card_header.addEventListener( 'click', function() {
        card_more_container.style.display = card_more_container.style.display == "none" ? "flex" : "none";
    } );

    card_learn_more_button.addEventListener( 'click', function( e ) {
        e.stopPropagation();
        let options = [];
        options.push( { text: "Open in Event Page", icon: ICONS.fa_info, action: openInEventPage } );
        options.push( { text: "Delete", icon: ICONS.fa_trash, action: deletePlannedEvent } );
        openOptionsMenu( options, card_learn_more_button );
    } );

    return card;
}

/** Clears all UI elements and rebuilds them. Usually called when the planned_events list is updated
 * 
 */
function rebuildPlannedEvents() {
    planned_events_container.innerHTML = "";
    planned_events.filter( event_hash => { 
        let event = GameplanUtils.getFromHash( event_hash );
        return event.start_time.getDay() == current_selected_day;
    }).sort( ( a, b ) => {
        let event_a = GameplanUtils.getFromHash( a );
        let event_b = GameplanUtils.getFromHash( b );
        return event_a.start_time - event_b.start_time;
    } ).forEach( event_hash => {
        let event_card = buildPlannedEventCard( event_hash );
        planned_events_container.appendChild( event_card );
    } );
};

// fire an event when the planned events list is updated + initial build
document.addEventListener( 'plannedEventsUpdated', rebuildPlannedEvents );
rebuildPlannedEvents();

// #endregion

// #region Search and Filter Logic

// The list of all events that are displayed in the events container
var filtered_events = all_gameplan_events;

/**
 * 
 * @param { string } search_query 
 * @param { SearchFilter } filters 
 */
function SearchEventsAndApplyFilters( search_query, filters ) {
    if( search_query.length > 0 ) {
        let search_terms = search_query.split( " " );
        let id_search_terms = search_terms.filter( term => term.startsWith( "id:" ) );
        search_terms = search_terms.filter( term => id_search_terms.indexOf( term ) == -1 );

        filtered_events = all_gameplan_events.filter( event => {
            let found = false;

            // search by hash if any of the search query terms starts with id:#
            if( id_search_terms.length > 0 ) {
                found = id_search_terms.find( id_search => id_search.substring( 3 ) == event.hash ) != undefined;
            }

            if( !found ) { // search by the title
                let event_title = event.title.toLowerCase();
                found = search_terms.find( term => event_title.includes( term ) ) != undefined;
            }
            if( !found ) {  // search by the speakers
                let event_speakers = event.speakers.toLowerCase();
                found = search_terms.find( term => event_speakers.includes( term ) ) != undefined;
            }

            return found;
         } );
    } else {
        filtered_events = all_gameplan_events;
    }

    // done filtering by search query, now apply filters
    filtered_events = filtered_events.filter( event => {
        let event_tracks = event.tracks.split( "," );
        let passes = filters.pass_types.length == 0 || filters.pass_types.some( pass => event.passes.includes( pass ) );
        let tracks = filters.tracks.length == 0 || filters.tracks.some( track => event_tracks.some( event_track => event_track.trim() == track ) );
        let formats = filters.formats.length == 0 || filters.formats.some( format => event.format === format );
        
        // any overlapping time between the event range and the filter time range will be included
        let time_check = event.start_time < filters.end_datetime && event.end_time > filters.start_datetime;
         
        return passes && tracks && formats && time_check;
    } ).sort( ( a, b ) => GameplanUtils.getDuration( a, "s" ) - GameplanUtils.getDuration( b, "s" ) );

    reloadEvents();
}

// reads from the search_bar_input field and applies filters to the events
function SearchEventsAndApplyFiltersFromSearchBar() {
    let search_query = search_bar_input.value.toLowerCase();
    SearchEventsAndApplyFilters( search_query, applied_search_filter );
};

// #endregion

// #region Filter Menu 

// It's getting late and I'm getting delirious. Not sure what the hell I'm 
// doing here anymore. I'm gonna get so confused with the variables I have 
// named and shit being all over the place 
import filter_props from "./filter.properties.json"

/** 
 * @typedef { Object } SearchFilter
 * @property { number } selected_day
 * @property { Date } start_datetime
 * @property { Date } end_datetime
 * @property { String[] } pass_types
 * @property { String[] } tracks
 * @property { String[] } formats
 * @property { boolean } in_time_slot_mode
 */

/**
 * @type { SearchFilter }
 */
var default_search_filter = { selected_day: -1, start_datetime: new Date( "2025-03-16 00:00:00" ), end_datetime: new Date( "2025-03-22 23:59:59" ), pass_types: [], tracks: [], formats: [], in_time_slot_mode: false };
var applied_search_filter = default_search_filter;

/** Items to be displayed in the filter menu
 * @typedef { Object } FilterMenuItem
 * @property { string } id
 * @property { string } name
 * @property { string } type
 * @property { boolean } isEnabled
 * @property { string[]? } options
 */

const FILTER_TYPES = { DATE_TIME: "date_time", MULTI_SELECT: "multi_select" };

/** The list of filter menu items
 * @type { FilterMenuItem[] }
 */
var SEARCH_FILTERS = 
[ 
    { name: "Date & Time", id: "date_time",  type: FILTER_TYPES.DATE_TIME,    isEnabled: true },
    { name: "Pass Type",   id: "pass_types", type: FILTER_TYPES.MULTI_SELECT, isEnabled: true, options: filter_props.pass_types },  // the list is auto generated from /tools
    { name: "Tracks",      id: "tracks",     type: FILTER_TYPES.MULTI_SELECT, isEnabled: true, options: filter_props.tracks },      // the list is auto generated from /tools
    { name: "Format",      id: "formats",    type: FILTER_TYPES.MULTI_SELECT, isEnabled: true, options: filter_props.formats },     // the list is auto generated from /tools
];

var last_filter_menu_instigator = null;

var filter_menu = document.createElement( 'div' );
filter_menu.style.position = "absolute";
filter_menu.style.display = "none";
filter_menu.style.zIndex = "20";
filter_menu.style.color = COLORS.LIGHT_0;
filter_menu.style.backgroundColor = COLORS.SURFACE_10;
filter_menu.style.boxShadow = "0px 0px 10px 0px rgba( 0, 0, 0, 0.5 )";
filter_menu.style.fontFamily = FONTS.IBM_PLEX_MONO;
filter_menu.style.width = "300px";
document.body.appendChild( filter_menu );

/** Refresh the filter menu with the given items
 * @param {FilterMenuItem[]} items 
 */
function refreshFilterMenu( items ) {
    filter_menu.innerHTML = "";

    /**
     * @type { SearchFilter }
     */
    var temp_search_filters = applied_search_filter;

    items.forEach( item => {
        let filter_item = document.createElement( 'div' );
        filter_item.style.display = "flex";
        filter_item.style.flexDirection = "column";
        filter_item.style.alignItems = "left";
        filter_menu.appendChild( filter_item );

        let filter_header = document.createElement( 'div' );
        filter_header.style.padding = "10px 15px";
        filter_header.style.display = "flex";
        filter_header.style.justifyContent = "start";
        filter_header.style.alignItems = "center";
        filter_header.style.cursor = "pointer";
        setHoverBgColor( filter_header, COLORS.SURFACE_20 );
        filter_item.appendChild( filter_header );

        let filter_toggle_icon = document.createElement( 'i' );
        filter_toggle_icon.classList.add( ...ICONS.fa_chevron_right );
        filter_toggle_icon.style.color = COLORS.LIGHT_0;
        filter_toggle_icon.style.fontSize = "16px";
        filter_header.appendChild( filter_toggle_icon );

        let filter_name = document.createElement( 'a' );
        filter_name.textContent = item.name;
        filter_name.style.color = COLORS.LIGHT_0;
        filter_name.style.fontSize = "16px";
        filter_name.style.fontWeight = "400";
        filter_name.style.textAlign = "left";
        filter_name.style.marginLeft = "10px";
        filter_header.appendChild( filter_name );

        let filter_details_container = document.createElement( 'div' );
        filter_details_container.style.display = "none";
        filter_details_container.style.flexDirection = "column";
        filter_details_container.style.alignItems = "left";
        filter_details_container.style.padding = "20px 15px";
        filter_item.appendChild( filter_details_container );

        if( item.type == FILTER_TYPES.DATE_TIME ) {
            // select a day first (M, T, W, Th, F)
            // then a time range menu appears to fine tune the range
            // additionally, a button to start using the time-slot mode appears

            function refreshThisDetailsContainer() {
                filter_details_container.innerHTML = "";

                let day_select_container = document.createElement( 'div' );
                day_select_container.style.display = "flex";
                day_select_container.style.alignItems = "center";
                day_select_container.style.justifyContent = "center";
                day_select_container.style.gap = "10px";
                day_select_container.style.padding = "5px 0px";
                filter_details_container.appendChild( day_select_container );
    
                for( let i = 1; i <= 5; i++ ) {
                    let day_button = document.createElement( 'div' );
                    day_button.style.width = "30px";
                    day_button.style.height = "30px";
                    day_button.style.borderRadius = "50%";
                    day_button.style.display = "flex";
                    day_button.style.justifyContent = "center";
                    day_button.style.alignItems = "center";
                    day_button.style.cursor = "pointer";
                    day_button.style.backgroundColor = i == temp_search_filters.selected_day ? COLORS.PRIMARY_0 : COLORS.SURFACE_20;
                    day_button.style.color = i == temp_search_filters.selected_day ? COLORS.DARK_0 : COLORS.LIGHT_0;
                    setHoverBgColor( day_button, COLORS.PRIMARY_20 );
                    setHoverColor( day_button, COLORS.DARK_0 );
                    day_select_container.appendChild( day_button );
    
                    let day_text = document.createElement( 'a' );
                    day_text.textContent = DAYS[ i ].charAt( 0 );
                    day_text.style.fontSize = "14px";
                    day_text.style.fontWeight = "400";
                    day_button.appendChild( day_text );
    
                    day_button.addEventListener( 'click', function( e ) {
                        e.stopPropagation(); // not the best fix and might cause other issues, but due to time constraints, this will do
                        if( temp_search_filters.selected_day == i ) {
                            temp_search_filters.selected_day = -1;
                        }
                        else {
                            temp_search_filters.selected_day = i;
                        }
                        refreshThisDetailsContainer();
                    } );
                }

                // Show the time range selection if a day is selected
                if( temp_search_filters.selected_day != -1 ) {
                    let time_range_container = document.createElement( 'div' );
                    time_range_container.style.display = "flex";
                    time_range_container.style.alignItems = "center";
                    time_range_container.style.justifyContent = "space-evenly";
                    time_range_container.style.padding = "10px 0px";
                    filter_details_container.appendChild( time_range_container );

                    let start_time_container = document.createElement( 'div' );
                    start_time_container.style.display = "flex";
                    start_time_container.style.flexDirection = "column";
                    start_time_container.style.alignItems = "left";
                    time_range_container.appendChild( start_time_container );

                    let range_min_time = filter_props.start_times[ temp_search_filters.selected_day ].substring( 11, 16 );
                    let range_max_time = filter_props.end_times[ temp_search_filters.selected_day ].substring( 11, 16 );
                    
                    // Add 59 minutes to the min time to get the next time slot
                    let range_next_time = new Date( "2025-03-12 " + range_min_time );
                    range_next_time = new Date( range_next_time.getTime() + 59 * 60000 );
                    range_next_time = dateToStringStandard( range_next_time ).substring( 11, 16 );

                    let start_time = document.createElement( 'input' );
                    start_time.type = "time";
                    start_time.value = range_min_time
                    start_time.min = range_min_time;
                    start_time.max = range_max_time;
                    start_time.step = "900"; // 15 minutes
                    start_time.style.flex = "1";
                    start_time.style.height = "30px";
                    start_time.style.fontSize = "16px";
                    start_time.style.fontWeight = "400";
                    start_time.style.textAlign = "center";
                    start_time.style.marginRight = "10px";
                    start_time.style.backgroundColor = temp_search_filters.in_time_slot_mode ? COLORS.SURFACE_10 : COLORS.SURFACE_20;
                    start_time.style.color = temp_search_filters.in_time_slot_mode ? COLORS.LIGHT_0 + "80" : COLORS.LIGHT_0;
                    start_time.style.border = "none";
                    start_time.style.padding = "5px";
                    start_time.style.outline = "none";
                    start_time.disabled = temp_search_filters.in_time_slot_mode;
                    start_time_container.appendChild( start_time );
                    start_time.addEventListener( 'change', function() {
                        temp_search_filters.start_datetime = new Date( "2025-03-12 " + start_time.value + ":00" ); // the date is arbitrary, only the time is important - will be processed correctly during the apply filter function
                    } );
                    temp_search_filters.start_datetime = new Date( "2025-03-12 " + start_time.value + ":00" );

                    let start_time_text = document.createElement( 'a' );
                    start_time_text.textContent = "Start Time";
                    start_time_text.style.color = COLORS.LIGHT_0;
                    start_time_text.style.fontSize = "12px";
                    start_time_text.style.fontWeight = "400";
                    start_time_text.style.textAlign = "left";
                    start_time_container.appendChild( start_time_text );

                    let end_time_container = document.createElement( 'div' );
                    end_time_container.style.display = "flex";
                    end_time_container.style.flexDirection = "column";
                    end_time_container.style.alignItems = "left";
                    time_range_container.appendChild( end_time_container );

                    let end_time = document.createElement( 'input' );
                    end_time.type = "time";
                    end_time.value = temp_search_filters.in_time_slot_mode ? range_next_time : range_max_time;
                    end_time.min = range_min_time;
                    end_time.max = range_max_time;
                    end_time.step = "900"; // 15 minutes
                    end_time.style.flex = "1";
                    end_time.style.height = "30px";
                    end_time.style.fontSize = "16px";
                    end_time.style.fontWeight = "400";
                    end_time.style.textAlign = "center";
                    end_time.style.backgroundColor = temp_search_filters.in_time_slot_mode ? COLORS.SURFACE_10 : COLORS.SURFACE_20;
                    end_time.style.color = temp_search_filters.in_time_slot_mode ? COLORS.LIGHT_0 + "80" : COLORS.LIGHT_0;
                    end_time.style.border = "none";
                    end_time.style.padding = "5px";
                    end_time.style.outline = "none";
                    end_time.disabled = temp_search_filters.in_time_slot_mode
                    end_time_container.appendChild( end_time );
                    end_time.addEventListener( 'change', function() {
                        temp_search_filters.end_datetime =  new Date( "2025-03-12 " + end_time.value + ":00" ); // the date is arbitrary, only the time is important - will be processed correctly during the apply filter function
                    } );
                    temp_search_filters.end_datetime = new Date( "2025-03-12 " + end_time.value + ":00" );

                    let end_time_text = document.createElement( 'a' );
                    end_time_text.textContent = "End Time";
                    end_time_text.style.color = COLORS.LIGHT_0;
                    end_time_text.style.fontSize = "12px";
                    end_time_text.style.fontWeight = "400";
                    end_time_text.style.textAlign = "left";
                    end_time_container.appendChild( end_time_text );
                }

                // Show the enable time slot mode toggle if a day is selected
                if( temp_search_filters.selected_day != -1 ) {
                    let time_slot_mode_container = document.createElement( 'div' );
                    time_slot_mode_container.style.display = "flex";
                    time_slot_mode_container.style.alignItems = "center";
                    time_slot_mode_container.style.justifyContent = "center";
                    time_slot_mode_container.style.padding = "10px 0px";
                    filter_details_container.appendChild( time_slot_mode_container );

                    let time_slot_mode_toggle = document.createElement( 'input' );
                    time_slot_mode_toggle.type = "checkbox";
                    time_slot_mode_toggle.style.width = "20px";
                    time_slot_mode_toggle.style.height = "20px";
                    time_slot_mode_toggle.style.cursor = "pointer";
                    time_slot_mode_toggle.style.alignSelf = "center";
                    time_slot_mode_toggle.checked = temp_search_filters.in_time_slot_mode;
                    time_slot_mode_container.appendChild( time_slot_mode_toggle );

                    let time_slot_mode_text = document.createElement( 'a' );
                    time_slot_mode_text.textContent = "Enable Time Slot Mode";
                    time_slot_mode_text.style.color = COLORS.LIGHT_0;
                    time_slot_mode_text.style.fontSize = "16px";
                    time_slot_mode_text.style.fontWeight = "400";
                    time_slot_mode_text.style.textAlign = "left";
                    time_slot_mode_text.style.marginLeft = "5px";
                    time_slot_mode_container.appendChild( time_slot_mode_text );

                    time_slot_mode_toggle.addEventListener( 'click', function( e ) {
                        e.stopPropagation();
                        temp_search_filters.in_time_slot_mode = !temp_search_filters.in_time_slot_mode;
                        refreshThisDetailsContainer();
                    } );
                }
            }
            refreshThisDetailsContainer(); // initial build
        } 
        else if( item.type == FILTER_TYPES.MULTI_SELECT ) {
            item.options.forEach( option => {
                let option_container = document.createElement( 'div' );
                option_container.style.display = "flex";
                option_container.style.alignItems = "center";
                option_container.style.gap = "8px";
                option_container.style.padding = "5px 0px";
                option_container.style.cursor = "pointer";
                setHoverBgColor( option_container, COLORS.SURFACE_20 );
                filter_details_container.appendChild( option_container );

                let option_checkbox_container = document.createElement( 'div' );
                option_checkbox_container.style.width = "20px";
                option_checkbox_container.style.flexShrink = "0";
                option_container.appendChild( option_checkbox_container );

                let option_checkbox = document.createElement( 'input' );
                option_checkbox.type = "checkbox";
                option_checkbox.style.width = "20px";
                option_checkbox.style.height = "20px";
                option_checkbox.style.cursor = "pointer";
                option_checkbox.style.alignSelf = "flex-start";
                option_checkbox_container.appendChild( option_checkbox );
                option_checkbox.addEventListener( 'click', function( e ) { 
                    e.stopPropagation();
                    onValueChange();
                } );

                let option_text = document.createElement( 'a' );
                option_text.textContent = option;
                option_text.style.color = COLORS.LIGHT_0;
                option_text.style.fontSize = "16px";
                option_text.style.fontWeight = "400";
                option_text.style.textAlign = "left";
                option_text.style.marginLeft = "5px";
                option_container.appendChild( option_text );

                option_container.addEventListener( 'click', function( e ) {
                    option_checkbox.checked = !option_checkbox.checked; 
                    onValueChange();
                } );

                function onValueChange() {
                    if( option_checkbox.checked ) {
                        if( !temp_search_filters[ item.id ] ) {
                            temp_search_filters[ item.id ] = [];
                        }
                        temp_search_filters[ item.id ].push( option );
                    } else {
                        temp_search_filters[ item.id ].splice( temp_search_filters[ item.id ].indexOf( option ), 1 );
                    }
                };
            } );
        }
        
        filter_header.addEventListener( 'click', function() {
            filter_details_container.style.display = filter_details_container.style.display == "none" ? "flex" : "none";
            if( filter_details_container.style.display == "flex" ) {
                filter_toggle_icon.classList.remove( ...ICONS.fa_chevron_right );
                filter_toggle_icon.classList.add( ...ICONS.fa_chevron_down );
            } else {
                filter_toggle_icon.classList.remove( ...ICONS.fa_chevron_down );
                filter_toggle_icon.classList.add( ...ICONS.fa_chevron_right );
            }
        } );
    } );

    let apply_filters_button = document.createElement( 'div' );
    apply_filters_button.style.margin = "10px auto";
    apply_filters_button.style.padding = "10px";
    apply_filters_button.style.width = "80%";
    apply_filters_button.style.cursor = "pointer";
    apply_filters_button.style.backgroundColor = COLORS.LIGHT_0;
    apply_filters_button.style.color = COLORS.DARK_0;
    apply_filters_button.style.display = "flex";
    apply_filters_button.style.justifyContent = "center";
    apply_filters_button.style.alignItems = "center";
    setHoverBgColor( apply_filters_button, COLORS.PRIMARY_0 );
    filter_menu.appendChild( apply_filters_button );
    
    let apply_filters_text = document.createElement( 'a' );
    apply_filters_text.textContent = "Apply Filters";
    apply_filters_text.style.fontSize = "14px";
    apply_filters_text.style.fontWeight = "400";
    apply_filters_text.style.textAlign = "center";
    apply_filters_button.appendChild( apply_filters_text );

    apply_filters_button.addEventListener( 'click', function() {
        applyFilters( temp_search_filters );
     } );
}

/** Opens the filter menu relative to the instigator element
 * 
 * @param {HTMLElement} instigator 
 */
function openFilterMenu( instigator ) { 
    filter_menu.style.display = "block";
    let instigator_rect = instigator.getBoundingClientRect();
    let menu_rect = filter_menu.getBoundingClientRect();
    filter_menu.style.top = ( instigator_rect.bottom + 10 ) + "px";
    filter_menu.style.left = ( instigator_rect.left - menu_rect.width + instigator_rect.width ) + "px";
    last_filter_menu_instigator = instigator;
}

function hideFilterMenu() {
    filter_menu.style.display = "none";
    last_filter_menu_instigator = null;
}

function toggleOpenFilterMenu( instigator ) {
    if( filter_menu.style.display == "block" && last_filter_menu_instigator == instigator ) {
        hideFilterMenu();
    } else {
        openFilterMenu( instigator );
    }
 }

refreshFilterMenu( SEARCH_FILTERS );

document.addEventListener( 'click', function( e ) {
    if( filter_menu.display != "none" && !filter_menu.contains( e.target ) && e.target != last_filter_menu_instigator ) {
        hideFilterMenu();
    }
} );

/**
 * @param { SearchFilter } filters 
 */
function applyFilters( filters ) {
    if( filters.selected_day != -1 ) {
        filters.start_datetime = combineDateAndTime( DATES[ filters.selected_day + 1 ], filters.start_datetime );
        filters.end_datetime = combineDateAndTime( DATES[ filters.selected_day + 1 ], filters.end_datetime );
    } else {
        filters.start_datetime = new Date( "2025-03-16 00:00:00" );
        filters.end_datetime = new Date( "2025-03-22 23:59:59" );
    }
    
    if( filters.in_time_slot_mode ) {
        time_slot_buttons_container.style.display = "flex";
        current_time_slot_text.textContent = `${ filters.start_datetime.getTimeStringHHMM12() } - ${ filters.end_datetime.getTimeStringHHMM12() }`;
    }
    else {
        time_slot_buttons_container.style.display = "none";
    }

    applied_search_filter = filters;
    hideFilterMenu();
    SearchEventsAndApplyFiltersFromSearchBar();
}

// #endregion

// #region Lazy load events when the user scrolls down

const BATCH_SIZE = 10;
let last_loaded_event_idx = 0;

function loadMoreEventCards() {
    let events_to_load = filtered_events.slice( last_loaded_event_idx, last_loaded_event_idx + BATCH_SIZE );
    events_to_load.forEach( event => {
        let event_card = buildEventCard( event );
        events_container.insertBefore( event_card, sentinel );
    } );
    last_loaded_event_idx += BATCH_SIZE;
};

// Create an observer to load more events when the user scrolls down
var observer = new IntersectionObserver( ( entries ) => { 
    if( entries[ 0 ].isIntersecting ) {
        loadMoreEventCards();
    };
}, { root: events_container, rootMargin: "100px", threshold: 1.0 } );

// Add a sentinel element at the bottom of the events container to trigger the observer
var sentinel = document.createElement( 'div' );
sentinel.style.width = "100%";
sentinel.style.height = "1px";
events_container.appendChild( sentinel );

observer.observe( sentinel );

// Load the initial batch of events only for desktop layout
// This right pane which hosts the events is hidden initially in the mobile layout
if( current_layout == LAYOUT.DESKTOP ) {
    loadMoreEventCards();
}

function reloadEvents() {
    last_loaded_event_idx = 0;
    while( events_container.firstChild && events_container.firstChild != sentinel ) {
        events_container.removeChild( events_container.firstChild );
    }
    loadMoreEventCards();
}

//#endregion

// #region Handle layout changes based on window width

window.addEventListener( 'resize', function( e ) {
    if( current_layout == LAYOUT.DESKTOP && window.innerWidth <= MOBILE_BREAKPOINT ) {
        current_layout = LAYOUT.MOBILE;
        updateLayoutElements();
    }
    else if( current_layout == LAYOUT.MOBILE && window.innerWidth > MOBILE_BREAKPOINT ) {
        current_layout = LAYOUT.DESKTOP;
        updateLayoutElements();
    }
} );

function updateLayoutElements()
{
    if( current_layout == LAYOUT.MOBILE ) {
        pane_left.style.width = "100%";
        pane_right.style.display = "none";
        pane_resizer.style.display = "none";
        open_pane_right_button.style.display = hide_find_events ? "none" : "flex";
        open_pane_left_button.style.display = "flex";
        right_header.style.justifyContent = "space-between";
        right_title.style.display = "block";
    } else {
        pane_left.style.width = "35%";
        pane_left.style.display = "block";
        pane_right.style.display = "block";
        pane_resizer.style.display = "block";
        open_pane_right_button.style.display = "none";
        open_pane_left_button.style.display = "none";
        right_header.style.justifyContent = "center";
        right_title.style.display = "none";
    }
}

// Initial layout setup
updateLayoutElements();

//#endregion
