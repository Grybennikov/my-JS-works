var map,
	icon,
	iconHover,
	map_ctrl = {},
	zoom = {
		marker: 16, // Здесь менять зум для маркера
		standart: 6, // Здесь менять обычный зум при инициализации
		kyiv: 13, // Зум для Киева
		zkp: 16 // Зум для Закарпатья
	},
	coords = {
		standart: { // Координаты центра при инициализации
			lat: 49.540788,
			lng: 28.389870
		},
		kyiv: { // Координаты центра на вкладке Киев
				lat: 50.433320,
				lng: 30.521548
			}, 
		zkp: { // Координаты центра на вкладке Закарпатье
				lat: 48.152990,
				lng: 24.280812
			}
	};
 
function initMap() {
	var styleArray = [{
		featureType: "all",
		stylers: [{
			saturation: -80
		},
		{ lightness: 50
			
		}]
	}, {
		featureType: "road.arterial",
		elementType: "geometry",
		stylers: [{
			hue: "#fff"
		}, {
			saturation: 50
		}]
	}, {
		featureType: "poi.business",
		elementType: "labels",
		stylers: [{
			visibility: "off"
		}]
	}];

	map = new google.maps.Map(document.getElementById('map'), {
		center: coords.standart,
		zoom: zoom.standart,
		styles: styleArray,
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		}
	});
	map.markers = [];
	icon = new google.maps.MarkerImage(
		"/images/karta/marker_karta_krasniy.svg",
		null,
		null,
		null,
		new google.maps.Size(34, 43));
	iconHover = new google.maps.MarkerImage(
		"/images/karta/marker_karta_seriy.svg",
		null,
		null,
		null,
		new google.maps.Size(34, 43));
	map_ctrl.changeCity()
			.setMarkers();
}


(function() {
	var geocoder;

	this.changeCity = function() {
		jQuery("li", ".cities").on("click", function() {
			jQuery("li", ".cities").removeClass("active");
			jQuery(this).addClass("active");
			if (jQuery(this).hasClass("kyiv")) {
				jQuery(".adress-block").hide();
				jQuery(".adress-block.kyiv").show();
				map.setCenter(coords.kyiv);
				map.setZoom(zoom.kyiv);
			} else if (jQuery(this).hasClass("zkp")) {
				jQuery(".adress-block").hide();
				jQuery(".adress-block.zkp").show();
				map.setCenter(coords.zkp);
				map.setZoom(zoom.zkp);
			} else {
				jQuery(".adress-block").show();
				map.setCenter(coords.standart);
				map.setZoom(zoom.standart);
			}
		});
		return this;
	};


	this.setMarkers = function() {
		geocoder = new google.maps.Geocoder();
		var adressesBlock = jQuery(".adress-block"),
			adress,
			data,
			coords,
			spl_coords;
		for (var i = 0; i < adressesBlock.length; i++) {
			console.log(i);
			adress = jQuery('.adress', adressesBlock.eq(i));
			data = adress.data();
			isCoords = (typeof data.coords != 'undefined');
			if(isCoords){
				spl_coords = data.coords.split(",");
				coords = {
					lat: parseFloat(spl_coords[0]),
					lng: parseFloat(spl_coords[1])
				};
				_addMarker(coords, adressesBlock.eq(i), data.zoom);
			} else {
				_geocoderAddMarker(adress.text(), adressesBlock.eq(i), data.zoom);
			}
		};
		return this;
	};

	var _geocoderAddMarker = function(adr, block, zoom) {
		console.log(adr);
		geocoder.geocode({
			'address': adr
		}, function(result, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				_addMarker({
					lat: result[0].geometry.location.lat(),
					lng: result[0].geometry.location.lng()
				}, block, zoom);
			} else {
				block.hide();
				console.log(block + "////// this block is hidden!");
			}
		});
	};

	var _addMarker = function(coords, jq, zoom) {
		console.log(coords);
		var content = (typeof jq != 'undefined') ? jq.find(".window-markup").html() : jq;
		var marker = new google.maps.Marker({
			position: coords,
			icon: icon,
			map: map,
			adress: jq,
			title: 'dc',
			infowindow: new google.maps.InfoWindow({
				content: content
			}),
			zoom: (typeof zoom !== 'undefined') ? zoom : window.zoom.marker
		});
		google.maps.event.addListener(marker, 'click', function() {
			_hideIW();
			this.infowindow.open(map, this);
			jQuery(".adress-block").removeClass("active");
			marker.adress.addClass("active");
			var pos = marker.position;
			map.setCenter(pos);
			map.setZoom(this.zoom);
		});
		google.maps.event.addListener(marker, 'mouseover', function() {
			this.setIcon(iconHover);
		});
		google.maps.event.addListener(marker, 'mouseout', function() {
			this.setIcon(icon);
		});
		_clickOnAdressBlock(jq, marker);
		map.markers.push(marker);
	};


	var _hideIW = function() {
		var i = 0,
			len1 = map.markers.length;
		for (; i < len1; i += 1) {
			map.markers[i].infowindow.close()
		}
	};


	var _clickOnAdressBlock = function(jq, marker) {
		jq.on("click", function(e) {
			var that = jQuery(this),
				pos = marker.position;
			if (jQuery(e.target).hasClass("link")) {
				window.location.href = jQuery(e.target).attr("href");
				return false;
			}
			_hideIW();
			map.setCenter(pos);
			map.setZoom(marker.zoom);
			jQuery(".adress-block").removeClass("active");
			that.addClass("active");
		});
	};
}).call(map_ctrl);