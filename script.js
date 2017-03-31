    function initAutocomplete() {
        var zagreb = { lat: 45.815399, lng: 15.966568 };
        var map = new google.maps.Map(document.getElementById('map'), {
            center: zagreb,
            zoom: 14,
            mapTypeId: 'roadmap',
            mapTypeControl: true,
            streetViewControl: true
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
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                // var marker = new google.maps.Marker({
                //     map: map,
                //     animation: google.maps.Animation.DROP,
                //     title: place.name,
                //     position: place.geometry.location,
                //     placeId: place.place_id,
                // });

                // if (place.geometry.viewport) {
                //     // Only geocodes have viewport.
                //     bounds.union(place.geometry.viewport);
                // } else {
                //     bounds.extend(place.geometry.location);
                // }

                var addmarker = function(i) {
                    //Create marker
                    var marker = new google.maps.Marker({
                        map: map,
                        animation: google.maps.Animation.DROP,
                        title: place.name,
                        position: place.geometry.location,
                        placeId: place.place_id
                    });

                    markers.push(marker);

                    //Creating the closure
                    (function (i, marker) {
                        //Add infowindow
                        google.maps.event.addListener(marker, 'click', function(evt) {
                            service.getDetails({ // get place details via placeId (via reference is depreciated)
                            placeId: this.placeId
                            }, (function(marker) {
                                    return function(place, status) {
                                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                                            infowindow.setContent( // Set what to show in infowindow
                                                '<span style="padding: 0px; text-align:left" align="left"><h5>' +
                                                place.name + '<br></h5>' +
                                                'Avg. rating: ' + place.rating + '<br>' +
                                                place.formatted_address + '<br />' +
                                                place.formatted_phone_number + '<br />' +
                                                '<a  target="_blank" href=' + place.website + '>' + 'Website' + '</a>' + '<br>' +
                                                '<a  target="_blank" href=' + place.url + '>' + 'View on Google Maps' + '</a>'
                                        );
                                        infowindow.open(map, marker);
                                    }
                                }
                            }(marker)));
                        });
                    })(i, marker);

                    for (var i = 0; i < marker.length; i++) {
                        if(i++ < marker.length) {
                            setTimeout(function() {addmarker(i)}, 900);
                        }
                    }
                }
                addmarker(0);
            });
        });
    }
