//------------------------------------------------------------------------------
// Author(s):   sliptrixx (Hibnu Hishath)
// Date:        2025-03-12
// License:     MIT License (for more info checkout License.md file)
//
// Description: Contains the source code for a web app called Gameplan, that 
//              helps devs plan out their GDC schedule.
//------------------------------------------------------------------------------

const APP_VERSION = "0.0";

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
    fa_ellipsis_vertical: [ "fa-solid", "fa-ellipsis-vertical" ],
    fa_filter: [ "fa-solid", "fa-filter" ],
    fa_floppy_disk: [ "fa-solid", "fa-floppy-disk" ],
    fa_hourglass: [ "fa-solid", "fa-hourglass" ],
    fa_location: [ "fa-solid", "fa-location-dot" ],
    fa_magnifying_glass: [ "fa-solid", "fa-magnifying-glass" ],
    fa_paper_plane: [ "fa-solid", "fa-paper-plane" ], 
    fa_plus: ["fa-solid", "fa-plus" ],
    fa_ticket: [ "fa-solid", "fa-ticket" ],
    fa_video: ["fa-solid", "fa-video" ],
};

const LAYOUT = { MOBILE: "mobile", DESKTOP: "desktop" };
const MOBILE_BREAKPOINT = 820;
var current_layout = window.innerWidth <= MOBILE_BREAKPOINT ? LAYOUT.MOBILE : LAYOUT.DESKTOP;

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

/** Get the time string in the format "hh:mm AM/PM"
 * @returns {string} time string in the format "hh:mm AM/PM"
 */
Date.prototype.getTimeStringHHMM12 = function() {
    return this.toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit', hour12: true } );
}

/** Get the hash of the string
 * @returns {number}
 */
String.prototype.getHash = function() 
{
    let hash = 0;
    if( this.length > 0 ) {
        for( let i = 0; i < this.length; i++ ) {
            let ch = this.charCodeAt( i );
            hash = ( ( hash << 5 ) - hash ) + ch;
            hash |= 0;
        }
    }
    return hash;
};

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

open_pane_right_button.addEventListener( 'click', function() { 
    pane_right.style.display = "block";
    pane_left.style.display = "none";

    if( last_loaded_event_idx == 0 ) {
        loadMoreEventCards();
    }
} );

var open_pane_left_button = document.createElement( 'div' );
open_pane_left_button.style.position = "absolute";
open_pane_left_button.style.bottom = "20px";
open_pane_left_button.style.left = "0";
open_pane_left_button.style.right = "0";
open_pane_left_button.style.margin = "auto";
open_pane_left_button.style.width = "66%";
open_pane_left_button.style.height = "60px";
open_pane_left_button.style.borderRadius = "30px";
open_pane_left_button.style.backgroundColor = COLORS.LIGHT_0;
open_pane_left_button.style.display = "flex";
open_pane_left_button.style.justifyContent = "center";
open_pane_left_button.style.alignItems = "center";
open_pane_left_button.style.boxShadow = "0px 0px 10px 0px rgba( 0, 0, 0, 0.5 )";
setHoverBgColor( open_pane_left_button, COLORS.PRIMARY_20 );
pane_right.appendChild( open_pane_left_button );

var open_pane_left_text = document.createElement( 'a' );
open_pane_left_text.style.color = COLORS.DARK_0;
open_pane_left_text.style.fontSize = "24px";
open_pane_left_text.textContent = "done";
open_pane_left_button.appendChild( open_pane_left_text );

open_pane_left_button.addEventListener( 'click', function() {
    pane_right.style.display = "none";
    pane_left.style.display = "block";
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

// #region Display header options menu when the header options button is clicked

const HEADER_OPTIONS_MENU_ITEMS = 
[
    { "text": "Save",   "icon": ICONS.fa_floppy_disk,           "action": function() { alert( "save" );     } },
    { "text": "Export", "icon": ICONS.fa_arrow_right_from_bracket, "action": function() { alert( "export" );   } },
];

var header_options_menu = document.createElement( 'div' );
header_options_menu.style.position = "absolute";
header_options_menu.style.display = "none";
header_options_menu.style.zIndex = "10";
header_options_menu.style.color = COLORS.LIGHT_0;
header_options_menu.style.backgroundColor = COLORS.SURFACE_10;
header_options_menu.style.boxShadow = "0px 0px 10px 0px rgba( 0, 0, 0, 0.5 )";
document.body.appendChild( header_options_menu );

header_options_button.addEventListener( 'click', function() { 
    header_options_menu.style.display = header_options_menu.style.display == "none" ? "block" : "none";
    if( header_options_menu.style.display == "block" ) {
        let options_button_rect = header_options_button.getBoundingClientRect();
        let options_menu_rect = header_options_menu.getBoundingClientRect();
        header_options_menu.style.top = options_button_rect.top + "px";
        header_options_menu.style.left = ( options_button_rect.left - options_menu_rect.width - 6 ) + "px";
    }
} );

HEADER_OPTIONS_MENU_ITEMS.forEach( item => { 
    let menu_item = document.createElement( 'div' );
    menu_item.style.padding = "10px 15px";
    menu_item.style.display = "flex";
    menu_item.style.alignItems = "center";
    menu_item.style.cursor = "pointer";
    setHoverColor( menu_item, COLORS.PRIMARY_0 );
    setHoverBgColor( menu_item, COLORS.SURFACE_20 );
    header_options_menu.appendChild( menu_item );

    let icon = document.createElement( 'i' );
    icon.classList.add( ...item.icon );
    icon.style.color = "inherit";
    icon.style.fontSize = "20px";
    menu_item.appendChild( icon );

    let text = document.createElement( 'a' );
    text.textContent = item.text;
    text.style.color = "inherit";
    text.style.fontSize = "16px";
    text.style.marginLeft = "20px";
    text.style.fontFamily = FONTS.IBM_PLEX_MONO;
    menu_item.appendChild( text );

    menu_item.addEventListener( 'click', item.action );
} );

document.addEventListener( 'click', function( e ) {
    if( header_options_menu.contains( e.target ) || header_options_button.contains( e.target ) ) {
        return;
    }
    header_options_menu.style.display = "none";
} );

// #endregion

// #region Add day selectors and manage current selected day

const DAYS = [ "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" ];
var current_selected_day = DAYS[ 0 ]; // @TODO: Automatically set this to the current day (based on the dates between 2025-03-17 to 2025-03-21)

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

DAYS.forEach( day => {
    const ELEMENT_SIZE = 40;

    let day_div = document.createElement( 'div' );
    day_div.id = day;
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
    day_text.textContent = day.charAt( 0 );
    day_text.style.color = COLORS.DARK_0;
    day_text.style.fontWeight = "500";
    day_div.appendChild( day_text );

    if( day == current_selected_day ) {
        day_div.appendChild( day_highlighter );
    }

    day_div.addEventListener( 'click', function() {
        if( day != current_selected_day ) {
            day_div.appendChild( day_highlighter );
            current_selected_day = day;
        }
    } );
});

// #endregion

// #region Add search bar to search for events

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

// #endregion

// #region create the layout for displaying events

var events_container = document.createElement( 'div' );
events_container.style.overflowY = "auto";
events_container.style.flex = "1";
pane_right_content.appendChild( events_container );

/**
 * 
 * @param {{"session title": string; "start time": string; "end time": string; duration: string; day: string; description: string; takeaway: string; "intended audience": string; location: string; tracks: string; format: string; passes: string; speakers: string; "gdc vault recording": string;}} event 
 */
function buildEventCard( event ) {
    let start_time = new Date( event[ "start time" ] );
    let end_time = new Date( event[ "end time" ] );

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
    event_title.textContent = event[ "session title" ];
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

    let event_time = document.createElement( 'a' );
    event_time.textContent = `${ event.day } [${ start_time.getTimeStringHHMM12() } - ${ end_time.getTimeStringHHMM12() }]`;
    event_time.style.color = COLORS.PRIMARY_50;
    event_time.style.fontSize = "13px";
    event_time.style.fontWeight = "400";
    event_time.style.textAlign = "left";
    event_time.style.marginTop = "6px";
    event_title_info_container.appendChild( event_time );

    let event_add_button = document.createElement('div');
    event_add_button.style.width = "30px";
    event_add_button.style.height = "30px";
    event_add_button.style.borderRadius = "50%";
    event_add_button.style.display = "flex";
    event_add_button.style.justifyContent = "center";
    event_add_button.style.alignItems = "center";
    event_add_button.style.cursor = "pointer";
    event_add_button.style.color = COLORS.LIGHT_0;
    event_add_button.style.backgroundColor = COLORS.TRANSPARENT;
    event_add_button.style.border = "2px solid " + COLORS.LIGHT_0;
    setHoverBgColor( event_add_button, COLORS.PRIMARY_0 );
    setHoverColor( event_add_button, COLORS.DARK_0 );
    setHoverBorder( event_add_button, 2, COLORS.PRIMARY_0 );
    event_primary_info_container.appendChild( event_add_button );

    let event_add_icon = document.createElement( 'i' );
    event_add_icon.classList.add( ...ICONS.fa_plus );
    event_add_icon.style.fontSize = "16px";
    event_add_button.appendChild( event_add_icon );

    let event_more_info_container = document.createElement( 'div' );
    event_more_info_container.style.padding = "20px 20px 20px 20px";
    event_more_info_container.style.display = "none";
    event_more_info_container.style.flexDirection = "column";
    event_card.appendChild( event_more_info_container );

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
    addMoreInfoTag( event[ "gdc vault recording" ], ICONS.fa_video );

    if ( event.description.length > 0 ) {
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

    if ( event.takeaway.length > 0 ) {
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

    if ( event[ "intended audience" ].length > 0 ) {
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
        event_intended_audience.textContent = event[ "intended audience" ];
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

    return event_card;
}

// #endregion

// #region Lazy load events when the user scrolls down

import gdc_schedule from "./schedule.json"

const BATCH_SIZE = 10;
let last_loaded_event_idx = 0;

function loadMoreEventCards() {
    let events_to_load = gdc_schedule.slice( last_loaded_event_idx, last_loaded_event_idx + BATCH_SIZE );
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
}, { root: events_container, rootMargin: "0px", threshold: 1.0 } );

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
        open_pane_right_button.style.display = "flex";
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
