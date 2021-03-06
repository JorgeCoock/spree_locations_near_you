//= require handlebars

$(document).ready(function(){
  if ($("#map")) {
    function GmapVenues () {
      this.venuesSearch = $("#searchVenues");
      this.rank = $(".rank");
      this.venuesNearBy =$("#venues-near-by")
      this.location = JSON.parse($("#locationSession").html());
      this.map = null;
    };
    GmapVenues.prototype = {
      init: function(){
        this.bindEvents();
        this.checkRank();
        this.checkDefaultStore()
        if (this.location) {
          this.setMap(this.location[0], this.location[1]);
        }
        this.setPinsOnload();

      },
      checkRank: function(){
        $('.rank:input:checkbox').attr('checked', 'checked')
      },
      recheckRank: function(){
        $(".rank-checkboxes label").addClass("checked")
        $(".rank-checkboxes label").removeClass("unchecked")
      },
      bindEvents: function(){
        this.venuesSearch.on('submit', function(e){
          this.getVenues(e);
        }.bind(this))
        this.rank.on("click", function(e){
          this.getFliteredVenues(e)
        }.bind(this))
        $(".venue-box input[type='checkbox']").on("click", this.setDefaultStore)
      },
      getVenues: function (e){
        e.preventDefault();
        var zip = $(e.target).children().first().val();
        if(zip ){
          $.ajax({
           url: "/venues.json",
           type: 'GET',
           data: $(e.target).serialize()
         })
          .success(function(data){
            this.recheckRank();
            if(data.venues.length > 0){
              this.setMap(data.user_location[0], data.user_location[1])
              this.createPins(data.venues);
              this.venuesTemplate(data.venues);
            } else if (!data.user_location == "") {
              this.setMap(data.user_location[0], data.user_location[1])
              this.resetVenues()
              this.venuesNearBy.append("<div class='no-store'>There are no stores in your area.</div>")
            }
          }.bind(this))
          .error(function(xhr) {
            console.log("error something happened with retrieving your venues near you ")
          }.bind())
        }
      },
      setPinsOnload: function(){
        $.ajax({
         url: "/venues/drop_pins_on_load",
         type: 'GET',
       })
        .success(function(data){
          if(data.venues.length > 0){
            this.createPins(data.venues);
          } else {
            this.resetVenues()
          }
        }.bind(this))
        .error(function(xhr) {
          console.log("error something happened with retrieving your venues near you ")
        }.bind())
      },
      getFliteredVenues: function (e){
        this.venuesNearBy.html('')
        $.ajax({
         url: "/venues/fliter_venues_near_by",
         type: 'GET',
         data: $('input:checkbox:checked').serialize()
       })
        .success(function(data){
          map.removeMarkers();
          if(data.venues.length > 0) {
            this.createPins(data.venues)
            this.venuesTemplate(data.venues)
            this.checkDefaultStore()
            $(".venue-box input[type='checkbox']").on("click", this.setDefaultStore)
          }
        }.bind(this))
        .error(function(xhr) {
          console.log("error something happened with retrieving your venues near you ")
        }.bind())
      },
      setMap: function(lat, lng){
        if (this.location) {
         map = new GMaps({
          el: '#map',
          lat: lat ,
          lng: lng,
          zoom: 10
        });
         map.removeMarkers();
       };
     },
     setPin: function (lat, lng, name) {
      if(custom_marker_path != "" || custom_marker_path != null){
        map.addMarker({
          lat: lat,
          lng: lng,
          icon: custom_marker_path
        });
      } else {
        map.addMarker({
          lat: lat,
          lng: lng
        });
      }
    },
    createPins: function(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        if(title_array != null){
          data[i].letter = title_array[i]
        }
        this.setPin(data[i].latitude, data[i].longitude, data[i].name )
      };
      map.removeOverlays();
      this.createOverLay(data)
      setTimeout('$(".overlay").parent().parent().css("z-index", "100000")', 1000);
      map.fitZoom();
    },
    setOverLay: function(lat, lng, letter) {
      map.drawOverlay({
        lat: lat,
        lng: lng,
        content: '<div class="overlay letters"><span>'+ letter + '</span></div>'
      });
    },
    createOverLay: function(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        this.setOverLay(data[i].latitude, data[i].longitude, title_array[i])
      };
    },
    resetVenues: function(){
      this.venuesNearBy.html("");
      map.removeOverlays();
    },
    venuesTemplate: function(data) {
      $("#venues-near-by").html("")
      var template = Handlebars.compile($("#venues-template").html());
      this.venuesNearBy.append(template(data))
    },
    resetForm: function() {
      this.venuesSearch[0].reset();
    },
    setDefaultStore: function(){
      store_code = $(this).val()
      if($(this).attr('checked') === "checked"){
        $.cookie('store_code', null)
        $(".venue-box input[type='checkbox']").attr('checked', false)
      } else {
        $.cookie('store_code', store_code)
        $(".venue-box input[type='checkbox']").not(this).attr('checked', false)
      }
    },
    checkDefaultStore: function(){
      store_code = $.cookie('store_code')
      $("input[type=checkbox][value=" + store_code +"]").attr('checked', 'true');
    }
  }
     // start
     var venuesController = new GmapVenues();
     venuesController.init();
   };
 })
