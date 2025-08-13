var ROR_API_URL = "https://api.ror.org/v2/organizations?query="


$('#basic .typeahead, #basic-department .typeahead, #addl-info .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 3
  },
  {
    limit: 50,
    async: true,
    source: function (query, processSync, processAsync) {
        url = ROR_API_URL + encodeURIComponent(query);
        return $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                orgs = json.items
                return processAsync(orgs);
            }
        });
    },

    
    templates: {
      pending: [
        '<div class="empty-message">',
          'Fetching organizations list',
        '</div>'
      ].join('\n'),

suggestion: function (data) {
    var displayName = data.names.find(name => name.types.includes('ror_display'))?.value || '';
    var orgType = data.types?.[0] ? data.types[0].charAt(0).toUpperCase() + data.types[0].slice(1) : '';
    var cityName = data.locations?.geonames_details?.name || '';
    var countryName = data.locations?.geonames_details?.country_name || '';
    
    // Build location string conditionally
    var locationStr = '';
    if (cityName && countryName) {
        locationStr = cityName + ', ' + countryName;
    } else if (countryName) {
        locationStr = countryName;
    } else if (cityName) {
        locationStr = cityName;
    }
    
    var secondLine = orgType;
    if (locationStr) {
        secondLine += (orgType ? ' • ' : '') + locationStr;
    }
    
    return '<p><strong>' + displayName + '</strong><br>' + secondLine + '</p>';
}
    },
    display: function (data) {
      return data.names?.find(name => name.types.includes('ror_display'))?.value || '';
    },
    value: function(data) {
      return data.id;
    }
});

$('#basic .typeahead').bind('typeahead:select', function(ev, suggestion) {
  console.log(suggestion)
  $('#ror-id-01').html(JSON.stringify(suggestion, undefined, 4));
});

$('#basic #name-01').bind('change', function() {
  $('#ror-id-01').html('');
});

$('#basic-department .typeahead').bind('typeahead:select', function(ev, suggestion) {
  console.log(suggestion)
  var cityName = suggestion.locations?.geonames_details?.name || '';
  var countryName = suggestion.locations?.geonames_details?.country_name || '';
  $('#city').val(cityName);
  $('#country').val(countryName);
  $('#ror-id-02').html(JSON.stringify(suggestion, undefined, 4));
});

$('#basic #name-02').bind('change', function() {
  $('#ror-id-02').html('');
});

$('#addl-info .typeahead').bind('typeahead:select', function(ev, suggestion) {
  console.log(suggestion)
  var cityName = suggestion.locations?.geonames_details?.name || '';
  var countryName = suggestion.locations?.geonames_details?.country_name || '';
  $('#city-03').val(cityName);
  $('#country-03').val(countryName);
  $('#ror-id-03').html(JSON.stringify(suggestion, undefined, 4));
});

$('#addl-info #name-03').bind('change', function() {
  $('#city-03').val('');
  $('#country-03').val('');
  $('#ror-id-03').html('');
});