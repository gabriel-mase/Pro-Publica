var app = new Vue({
  el: '#app',
  data: {
    members: [],
    filteredMembers: [],
    states: []
  }
});


fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
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
    members = json.results[0].members
    filter();
    stateFilt();
})

function stateFilt() {
    //var tohtml = "";
    for (var i = 0; i < members.length; i++) {
        //tohtml += '<option value="' + members[i].state + '">' + country[members[i].state] + '</option>';
        app.states.push({state: members[i].state, country: country[members[i].state]});
    }
    //document.getElementById("stateFilter").innerHTML += tohtml;
}

function filter() {
    var filters = Array.from(document.querySelectorAll('input[name=party]:checked')).map(mapInput);
    //console.log(filters);

    var stateFilter = document.querySelector('#stateFilter').value;
    //

    //var html = "";
    app.filteredMembers = []
    for (i = 0; i < members.length; i++) {
        if (filters.indexOf(members[i].party) != -1 && (stateFilter == members[i].state || stateFilter == 'All')) {
            /*html = html + "<tr><td><a href='" + members[i].url + "'>" + members[i].first_name + " " + (members[i].middle_name || "") + members[i].last_name + "</a></td><td>" + members[i].party + "</td><td>" + members[i].state + "</td><td>" + members[i].seniority + "</td><td>" + members[i].votes_with_party_pct + "%</td></tr>";
            var url = members[i].url;*/
            app.filteredMembers.push(members[i]);
        }
    }
}


function mapInput(input) {
    return input.value;
}



