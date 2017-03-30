    function initAutocomplete() {
        var zagreb = { lat: 45.815399, lng: 15.966568 };
        var map = new google.maps.Map(document.getElementById('map'), {
        center: zagreb,
        zoom: 14,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);


    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

    if (places.length == 0) {
        return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
        var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.

        var marker = new google.maps.Marker({
            map: map,

            title: place.name,
            position: place.geometry.location,
            placeId: place.place_id,

        });

        markers.push(marker);


        google.maps.event.addListener(marker, 'click', function(evt) {
            service.getDetails({
            placeId: this.placeId
        }, (function(marker) {
            return function(place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    infowindow.setContent(
                    '<div><strong>' + place.name + '</strong><br>' +
                    place.formatted_address + '<br>' +
                    'Avg. rating: ' + place.rating + '<br>' +
                    place.website + '<br>' +
                    place.formatted_phone_number + '</div>');
                    infowindow.open(map, marker);
                }
            }
        }(marker)));
    });

        if (place.geometry.location) {
            bounds.extend(place.geometry.location);
        }
    })
    });

}
