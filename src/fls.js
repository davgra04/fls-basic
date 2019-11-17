// using some ES6 features here, no jquery or other libs

////////////////////////////////////////////////////////////////////////////////////////////////////
////    globals
////////////////////////////////////////////////////////////////////////////////////////////////////

// let flsCoreEndpoint = "http://localhost:8001"       // local dev
let flsCoreEndpoint = "https://fls-api.davgra.com"       // dgserv3 deployment
let debug = false;
let new_threshold = 7 * 24 * 60 * 60;               // max age of a "new" show

////////////////////////////////////////////////////////////////////////////////////////////////////
////    on DOMContentLoaded
////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("debug")) {
        console.log("debug set");
        debug = true;
    }

    GetUpcomingShows();
    GetArtistList();
    GetRegionList();
    GetFooter();
}, false)

////////////////////////////////////////////////////////////////////////////////////////////////////
////    querying fls-core
////////////////////////////////////////////////////////////////////////////////////////////////////

function QueryFLSCore(url, callback) {
    fetch(flsCoreEndpoint + url)
        .then(function (response) {
            return response.json();
        }).then(function (json_data) {
            callback(json_data);
        }).catch(function () {
            console.log("ERROR! Could not fetch json from " + url + ".");
            document.getElementById("errormsg").textContent += `ERROR! Could not fetch json from ` + url + `.\n\n`
        });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////    upcoming shows
////////////////////////////////////////////////////////////////////////////////////////////////////

// queries fls-core for upcoming shows and inserts them into the upcoming shows div
function GetUpcomingShows() {
    console.log("calling GetUpcomingShows()");

    urlParams = getUrlParams(window.location.search);

    if(!("region" in urlParams)) {
        urlParams = {"region": "TX"};
    }
    
    console.log("urlParams: " + urlParams);
    QueryFLSCore("/v1/shows?region=" + urlParams["region"], InsertUpcomingShowsTable);
}


function InsertUpcomingShowsTable(showlist) {

    console.log(JSON.stringify(showlist));
    let tableUpcomingShows = document.getElementById("table-upcoming-shows");
    let table_html = "";

    if (showlist.shows == null) {
        showlist.shows = [];
    }

    // start the show list section, depending on if debug urlparam is set
    if (debug) {
        table_html += `<h3>raw json</h3>
        <small class="extra-small">` + JSON.stringify(showlist) + `</small>
        <h3>table</h3>`
    }

    table_html += `
    <div id="showtable">
        <div class="showtable-header"></div>
        <div class="showtable-header">Date</div>
        <div class="showtable-header">Artist</div>
        <div class="showtable-header">Location</div>
        <div class="showtable-header">Venue</div>`;

    // finish off show list table
    showlist.shows.forEach(function (show, index) {
        let newLabel = "";
        let show_age = showlist.query_date - show.date_added;
        if (show_age < new_threshold) {
            newLabel = "<small><b>NEW!</b><br>added " + secondsToAgeString(show_age) + " ago</small>";
        }

        formatted_date = (new Date(show.date)).toLocaleDateString();
        formatted_time = (new Date(show.date)).toLocaleTimeString();

        table_html += `
            <div class="showtable-new">` + newLabel + `</div>
            <div class="showtable-date"><time datetime="` + show.date + `">` + formatted_date + `<br>` + formatted_time + `</div>
            <div class="showtable-artist">` + show.artist + `</div>
            <div class="showtable-city">` + show.city + `,` + show.region + `</div>
            <div class="showtable-venue">` + show.venue + `</div>`;
    })

    table_html += `</div>`;

    tableUpcomingShows.innerHTML = table_html;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////    newly added shows
////////////////////////////////////////////////////////////////////////////////////////////////////

// TODO

////////////////////////////////////////////////////////////////////////////////////////////////////
////    followed artists
////////////////////////////////////////////////////////////////////////////////////////////////////

// queries fls-core for followed artists and inserts them into the followed artists div
function GetArtistList() {
    console.log("calling GetArtistList()");
    QueryFLSCore("/v1/artists", InsertArtistList);
}

function InsertArtistList(artistlist) {

    console.log(JSON.stringify(artistlist));
    let tableArtistList = document.getElementById("table-followed-artists");
    let table_html = "";

    // start the show list section, depending on if debug urlparam is set
    if (debug) {
        table_html += `<h3>raw json</h3>
            <small class="extra-small">` + JSON.stringify(artistlist) + `</small>
            <h3>list</h3>`;

    } else {
        // table_html += `<ul>`;
    }


    artistlist.forEach(function (artist, index) {
        table_html += `<div class="artist">` + artist + `</div>`;
    });

    // table_html += `</ul>`;

    // // start the show list section, depending on if debug urlparam is set
    // if (debug) {
    //     table_html += `<h3>raw json</h3>
    //         <small class="extra-small">` + JSON.stringify(artistlist) + `</small>
    //         <h3>list</h3>
    //         <div>`;

    // } else {
    //     table_html += `<div>`;
    // }
    // // table_html += `<div>` + artistlist.join(" | ") + `</div>`

    // artistlist.forEach(function (artist, index) {
    //     artist = artist.replace(/ /g, '\u00a0')
    //     table_html += `<small class="artist-list-item extra-small">` + artist + `</small>`;
    // })


    // table_html += `</div>`;

    tableArtistList.innerHTML = table_html;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////    regions
////////////////////////////////////////////////////////////////////////////////////////////////////


// queries fls-core for followed artists and inserts them into the followed artists div
function GetRegionList() {
    console.log("calling InsertRegionList()");
    InsertRegionList(["all", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "AS", "DC", "FM", "GU", "MH", "MP", "PW", "PR", "VI"]);
}

function InsertRegionList(regionlist) {

    console.log(JSON.stringify(regionlist));
    let tableRegionList = document.getElementById("table-regions");
    let table_html = "";

    // table_html += `<ul>`;

    regionlist.forEach(function (region, index) {
        table_html += `<div> <a href="fls.html?region=` + region + `">` + region + `</a> </div>`;
    });

    // table_html += `</ul>`;

    tableRegionList.innerHTML = table_html;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////    ALL shows
////////////////////////////////////////////////////////////////////////////////////////////////////

// TODO

////////////////////////////////////////////////////////////////////////////////////////////////////
////    footer
////////////////////////////////////////////////////////////////////////////////////////////////////

function GetFooter() {
    let footerDiv = document.getElementById("footer");
    footerDiv.innerHTML = `<small>fls-basic v0.1</small>
    <br>
    <small>2019</small>`;
}


////////////////////////////////////////////////////////////////////////////////////////////////////
////    misc
////////////////////////////////////////////////////////////////////////////////////////////////////

function getUrlParams(search) {
    let hashes = search.slice(search.indexOf('?') + 1).split('&');
    let params = {}
    hashes.map(hash => {
        let [key, val] = hash.split('=');
        params[key] = decodeURIComponent(val);
    });

    return params;
}


function secondsToAgeString(seconds) {
    console.log("called secondsToAgeString on seconds: " + seconds);
    console.log("typeof seconds " + (typeof seconds));
    console.log("seconds % (5*2) = " + (seconds % (5*2)));

    let days = Math.floor(seconds / (24 * 60 * 60));
    console.log("days: " + days);
    if(days != 0) {
        if(days > 1) {
            return days + " days";
        } else {
            return days + " day";
        }
    }

    let hours = Math.floor(seconds / (60 * 60));
    console.log("hours: " + hours);
    if(hours != 0) {
        if(hours > 1) {
            return hours + " hours";
        } else {
            return hours + " hour";
        }
    }

    let minutes = Math.floor(seconds / 60);
    console.log("minutes: " + minutes);
    if(minutes != 0) {
        if(minutes > 1) {
            return minutes + " minutes";
        } else {
            return minutes + " minute";
        }
    }

    console.log("seconds: " + seconds);
    return seconds + " seconds";
}
