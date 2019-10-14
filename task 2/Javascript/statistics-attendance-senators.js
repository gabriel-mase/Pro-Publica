var app = new Vue({
    el: '#app',
    data: {
        members: [],
        statistics: {
            "numberOfDemocrats": 0,
            "numberOfRepublicans": 0,
            "numberOfIndependents": 0,

            "averageVotesWithPartyForDemocrats": 0,
            "averageVotesWithPartyForRepublicans": 0,
            "averageVotesWithPartyForIndependents": 0,

            "leastEngagedNames": 0,
            "mostEngagedNames": 0,

            "leastLoyalNames": 0,
            "mostLoyalNames": 0,

        },
        democrat: [],
        independent:[],
        republican: [],
        diezPercent: 0,
    }
});


fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
    method: "GET",
    headers: new Headers({
        "X-API-Key": 'adZUIoKPgkk0ecKXE0ztm9ErLNJgARlsKHBhTBYa'
    })
}).then(function (response) {
    if (response.ok)
        return response.json();
    throw new Error(response.statusText);
}).then(function (json) {
    console.log(json);
    app.members = json.results[0].members
    app.diezPercent = Math.round(app.members.length * 0.10);
    app.republican = app.members.filter(cantidadPartyR);
    app.democrat = app.members.filter(cantidadPartyD);
    app.independent = app.members.filter(cantidadPartyI);
    allMyStats();
    //htmlSenatorsFunction();
    //htmlLeastEngFunction();
    //htmlMostEngFunction();

})


function cantidadPartyR(member) {
    return member.party == "R";
}

function cantidadPartyD(member) {
    return member.party == "D";
}

function cantidadPartyI(member) {
    return member.party == "I";
}

function averageVotes(party) {
    var sum = 0;
    for (i = 0; i < party.length; i++) {
        sum += party[i].votes_with_party_pct;
    }
    var average = Math.round(sum / party.length * 100) / 100;
    if (party.length == 0) {
        return 0;
    } else {
        return average;
    }
}

function lowestTenPercentOfVoters(array, percent) {
    var votes = [];
    array.sort(function (a, b) {
        return b.missed_votes_pct - a.missed_votes_pct;
    });

    votes = array.slice(0, percent);

    console.log(array);
    return votes;
}

function highestTenPercentOfVoters(array, percent) {
    var votes = [];
    array.sort(function (a, b) {
        return a.missed_votes_pct - b.missed_votes_pct;
    });
    votes = array.slice(0, percent);

    console.log(array);
    return votes;

}


function mostLoyal(array, percent) {
    var votes = [];
    array.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
    });
    votes = array.slice(0, percent);

    console.log(array);
    return votes;
}

function lessLoyal(array, percent) {
    var votes = [];
    array.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct;
    });
    votes = array.slice(0, percent);

    console.log(array);
    return votes;
}

function allMyStats() {
    app.statistics.numberOfDemocrats = app.democrat.length;
    app.statistics.numberOfRepublicans = app.republican.length;
    app.statistics.numberOfIndependents = app.independent.length;

    app.statistics.averageVotesWithPartyForDemocrats = averageVotes(app.democrat);
    app.statistics.averageVotesWithPartyForRepublicans = averageVotes(app.republican);
    app.statistics.averageVotesWithPartyForIndependents = averageVotes(app.independent);

    app.statistics.leastEngagedNames = lowestTenPercentOfVoters(app.members, app.diezPercent);
    app.statistics.mostEngagedNames = highestTenPercentOfVoters(app.members, app.diezPercent);

    app.statistics.leastLoyalNames = lessLoyal(app.members, app.diezPercent);
    app.statistics.mostLoyalNames = mostLoyal(app.members, app.diezPercent);

}

//function htmlSenatorsFunction() {

    //   var htmlSenator = "";

    // htmlSenator = htmlSenator + "<tr><td>Democrats</td><td>" + democrat.length + "</td><td>" + statistics.averageVotesWithPartyForDemocrats + "%</td></tr>" + "<tr><td>Republicans</td><td>" + republican.length + "</td><td>" + statistics.averageVotesWithPartyForRepublicans +
    //   "%</td></tr>" + "<tr><td>Independents</td><td>" + independent.length + "</td><td>" + statistics.averageVotesWithPartyForIndependents + "%</td></tr>";


    //document.getElementById("senate-data-at-a-glance").innerHTML = htmlSenator;
//}

function htmlLeastEngFunction() {
    var htmlLeastEngaged = "";
    for (i = 0; i < statistics.leastEngagedNames.length; i++) {

        htmlLeastEngaged = htmlLeastEngaged + "<tr><td><a href='" + statistics.leastEngagedNames[i].url + "'>" + statistics.leastEngagedNames[i].first_name + " " + (statistics.leastEngagedNames[i].middle_name || "") + statistics.leastEngagedNames[i].last_name + "</a></td><td>" + statistics.leastEngagedNames[i].missed_votes + "</td><td>" + statistics.leastEngagedNames[i].missed_votes_pct + "%</td></tr>";
        var url = statistics.leastEngagedNames[i].url;

    }
    document.getElementById("senate-data-least-engaged").innerHTML = htmlLeastEngaged;

}

function htmlMostEngFunction() {
    var htmlMostEngaged = "";

    for (i = 0; i < statistics.mostEngagedNames.length; i++) {

        htmlMostEngaged = htmlMostEngaged + "<tr><td><a href='" + statistics.mostEngagedNames[i].url + "'>" + statistics.mostEngagedNames[i].first_name + " " + (statistics.mostEngagedNames[i].middle_name || "") + statistics.mostEngagedNames[i].last_name + "</a></td><td>" + statistics.mostEngagedNames[i].missed_votes + "</td><td>" + statistics.mostEngagedNames[i].votes_with_party_pct + "%</td></tr>";
        var url = statistics.mostEngagedNames[i].url;
    }

    document.getElementById("senate-data-most-engaged").innerHTML = htmlMostEngaged;



}
