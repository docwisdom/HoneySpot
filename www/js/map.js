$(document).ready(function (event) {
    max_height();
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        'enableHighAccuracy': true,
        'timeout': 20000
    });
    $('#mileSelect input:radio').change(function () {
        max_height();
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            'enableHighAccuracy': true,
            'timeout': 20000
        });
    });
});

//set max height of map block

function max_height() {
    var header = $.mobile.activePage.find("div[data-role='header']:visible");
    var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
    var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
    var viewport_height = $(window).height();

    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    if ((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
        content_height -= (content.outerHeight() - content.height());
    }
    $.mobile.activePage.find('[data-role="content"]').height(content_height);
}

//set current location

function onSuccess(position) {
    var minZoomLevel = 15;
    var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var bounds = new google.maps.LatLngBounds();

    var map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: minZoomLevel,
        center: myLatlng,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var mePinColor = "0000FF";
    var mePinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=home|" + mePinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));
    var mePinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));
    bounds.extend(myLatlng);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: mePinImage,
        shadow: mePinShadow,
        title: 'You'
    });

    var lat = myLatlng.lat();
    var lng = myLatlng.lng();

    var Place = StackMob.Model.extend({
        schemaName: 'locations'
    });
    var Places = StackMob.Collection.extend({
        model: Place
    });
    var distance = $("#mileSelect input:radio:checked").val();

    var q = new StackMob.Collection.Query();
    q.mustBeNearMi('lat_long', new StackMob.GeoPoint(lat, lng), distance);
    q.select('name', 'lat_long');

    var placesContainer = new Places();
    placesContainer.query(q, {
        success: function (model, locations) {
            var infowindow = new google.maps.InfoWindow({
                content: ''
            });
              //var image = {
              //  url: 'images/beachflag.png',
              //  size: new google.maps.Size(20, 32),
              //  origin: new google.maps.Point(0,0),
              //  anchor: new google.maps.Point(0, 32)
              //};

            for (var i = 0; i < locations.length; i++) {
                var myLatLng = new google.maps.LatLng(locations[i].lat_long.lat, locations[i].lat_long.lon);
                bounds.extend(myLatLng);
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    //icon: image,
                    title: locations[i].name,
                    zIndex: i
                });
                map.fitBounds(bounds);
                buildInfoWindow(infowindow, marker, map, locations[i]);
            }

        },
        error: function (model, response) {
            console.log(response);
        }
    });


}

function buildInfoWindow(infowindow, marker, map, locations) {
    var contentString = '<div id="infoWindow">' +
        '<a href="#details" data-transition="slide"><h3>' + locations.name + '</h3></a>' +
        '<div id="infoWindowBody">' +
        'Howdy' +
        '</div>' +
        '</div>';
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.content = contentString;
        infowindow.open(map, marker);
        console.log(marker);
    });
}

/*function queryLocations(lat, lng) {
    $.ajax({
        url: 'http://api.stackmob.com/locations?lat_long[near]=37.415515,-122.145989,.00379',
        headers:{
          'X-StackMob-API-Key': '45f9e7aa-22f3-43de-8935-95b80d345918', 
          'Accept': 'application/vnd.stackmob+json; version=0'
        }, 
        type: 'GET',
        success: function(data) {
            console.debug(data);
        },
        error: function(error) {
            console.debug(error);
        }
    });
}
*/

function onError() {
    alert('Please Enable Geolocation');
}