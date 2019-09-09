// using some ES6 features here, no jquery or other libs

////////////////////////////////////////////////////////////////////////////////////////////////////
////    globals
////////////////////////////////////////////////////////////////////////////////////////////////////

let flsCoreEndpoint = "http://localhost:8001"        // local dev
let debug = false;

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
    QueryFLSCore("/v1/shows", InsertUpcomingShowsTable);
}

function InsertUpcomingShowsTable(showlist) {

    console.log(JSON.stringify(showlist));
    let tableUpcomingShows = document.getElementById("table-upcoming-shows");
    let table_html = ""

    // start the show list section, depending on if debug urlparam is set
    if (debug) {
        table_html += `<h3>raw json</h3>
        <small class="extra-small">` + JSON.stringify(showlist) + `</small>
        <h3>table</h3>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Date</th>
                    <th>Artist</th>
                    <th>Location</th>
                    <th>Venue</th>
                </tr>
            </thead>
            <tbody>`;

    } else {
        table_html += `
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Date</th>
                    <th>Artist</th>
                    <th>Location</th>
                    <th>Venue</th>
                </tr>
            </thead>
            <tbody>`;
    }

    // finish off show list table
    showlist.shows.forEach(function (show, index) {
        let newLabel = "";
        if (showlist.query_date - show.date_added < 7 * 24 * 60 * 60) {
            newLabel = "<small><b>NEW!</b></small>";
        }

        table_html += `<tr>
            <td>` + newLabel + `</td>
            <td>` + show.date + `</td>
            <td>` + show.artist + `</td>
            <td>` + show.city + `,` + show.region + `</td>
            <td>` + show.venue + `</td>
        </tr>`;
    })

    table_html += `
        </tbody>
    </table>`;

    tableUpcomingShows.innerHTML = table_html
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
    let table_html = ""

    // start the show list section, depending on if debug urlparam is set
    if (debug) {
        table_html += `<h3>raw json</h3>
            <small class="extra-small">` + JSON.stringify(artistlist) + `</small>
            <h3>list</h3>
            <ul>`;

    } else {
        table_html += `<ul>`;
    }


    artistlist.forEach(function (artist, index) {
        table_html += `<li>` + artist + `</li>`;
    })

    table_html += `</ul>`;

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

    tableArtistList.innerHTML = table_html
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////    regions
////////////////////////////////////////////////////////////////////////////////////////////////////

// TODO

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
    <small>2019</small>`
}
