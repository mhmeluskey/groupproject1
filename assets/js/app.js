// ====== GLOBAL VARIABLES ====== //
// Initial Google Maps settings
var map;
var userPos;
var zipPos;
var currentLocation;
var firstCarouselItemSet = false;

// ====== FUNCTIONS ====== //

// Builds recipe card for initial search results
function buildLocationCard(responseObj) {
    console.log(responseObj);

    var carouselItem;

    if (firstCarouselItemSet) {
        carouselItem = $('<div class="carousel-item">')
    } else {
        carouselItem = $('<div class="carousel-item active">');
    }

    carouselItem.append('<h1>'+responseObj.name+'</h1>');

    $("#locations-carousel").append(carouselItem);
}

function buildRecipeCard(responseObj) {

    var recipeContainer = $('<div class="col-sm-6 col-md-4 col-lg-3 mb-lg-5 mb-3">');

    var recipeContent = '<div class="recipe-card">';
    recipeContent += '<img class="mx-auto img-fluid d-block" src="' + responseObj.image + '">';
    recipeContent += '<div class="recipe-details-container p-lg-3 p-1">';
    recipeContent += '<h4 class="mb-4">' + responseObj.title + '</h4>';
    recipeContent += '<div class="text-center">'
    recipeContent += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#recipe-' + Number(responseObj.id) + '">See Recipe</button>';
    recipeContent += '</div>';
    recipeContent += '</div>';
    recipeContent += '</div>';

    recipeContainer.append(recipeContent);
    return recipeContainer;

}

// Build URL Query for the second AJAX request
function createRecipeQuery(responseObj) {

    var bulkRecipes = "";
    for (var i = 0; i < responseObj.length; i++) {
        if (i === responseObj.length - 1) {
            bulkRecipes += responseObj[i].id
        }

        else {
            bulkRecipes += responseObj[i].id + "%2C";
        }
    }
    return bulkRecipes;
}

// Build the modal for the entire recipe (occurs after the second Spoonacular API call)
function buildRecipeModal(responseObj) {
    console.log(responseObj);

    console.log(responseObj);

    for (var i = 0; i < responseObj.length; i++) {

        // creates an #id for the modal using the responseObj's id number
        // this 'recipe-ID' value is the same as the buildRecipeCard()'s "data-target"
        var modalId = "recipe-" + responseObj[i].id;

        var recipeModal = '<div class="modal fade bd-example-modal-lg" id="' + modalId + '" tabindex="-1" role="dialog">';
        recipeModal += '<div class="modal-dialog" role="document">';
        recipeModal += '<div class="modal-content">'
        recipeModal += '<div class="modal-header">';
        recipeModal += '<h5 class="modal-title">' + responseObj[i].title + '</h5>';
        recipeModal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
        recipeModal += '</div>';
        recipeModal += '<div class="modal-body">';
        recipeModal += '<div class="container">';
        recipeModal += '<div class="row">';
        recipeModal += '<div class="col-sm-4">';
        recipeModal += '<img class="img-fluid d-block" src="' + responseObj[i].image + '">';
        recipeModal += '<div class="ingredients-list">' + ingredientsBuild(responseObj[i].extendedIngredients) + '</div>';
        recipeModal += '</div>';
        recipeModal += '<div class="col-sm-8">';
        recipeModal += '<p>';
        if (responseObj[i].analyzedInstructions.length > 0) {
            recipeModal += instructionsBuild(responseObj[i].analyzedInstructions[0].steps);
         } else {
             recipeModal += '<div class="btn-container"><a href="'+responseObj[i].sourceUrl+'" target="_blank" class="btn btn-primary btn-lg">See Instructions</a></div>';
         }
        recipeModal += '</p>';
        recipeModal += '</div>';
        recipeModal += '</div>';
        // recipeModal += '<div class="row my-4">';
        // recipeModal += '<div class="col-sm-12 text-center">';
        // recipeModal += '</div>';
        // recipeModal += '</div>';
        // recipeModal += '<div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div>';
        // recipeModal += '</div>';
        // recipeModal += '</div>';
        // recipeModal += '</div>';
        // recipeModal += '<div class="col-sm-8">';
        // recipeModal += '<p>' + instructionsBuild(responseObj[i].analyzedInstructions[0].steps) + '</p>';

$("#recipe-modal").append(recipeModal);

    }



}

// After the first AJAX request to Spoonacular, build preview columns with the response
function displayRecipes(response) {

    var display = $('<div class="row">');

    for (var i = 0; i < response.length; i++) {
        var singleRecipe = buildRecipeCard(response[i]);
        // console.log(singleRecipe);
        display.append(singleRecipe);
    }

    // console.log(display);
    $("#ingredient-search-results").append(display);

}

// In the Recipe Modal: builds the list of ingredients and their measurements
function ingredientsBuild(responseArr) {
    retval = "";
    for (var i = 0; i < responseArr.length; i++) {
        var ingredient = '<p>';
        ingredient += responseArr[i].measures.us.amount;
        if (responseArr[i].measures.us.unitLong !== "") {
            ingredient += ' ' + responseArr[i].measures.us.unitLong;
        }
        ingredient += ' ' + responseArr[i].name;
        ingredient += '</p>';
        retval += ingredient;

    

    }
    return retval;
}

// In the Recipe Modal: builds the list of instructions
function instructionsBuild(responseArr) {
    console.log(responseArr);
    retval = "";
    for (var i = 0; i < responseArr.length; i++) {
        var instruction = '<p>';
        instruction += responseArr[i].number + '.) ';
        instruction += '<span class="recipe-instruction">' + responseArr[i].step + '</span>';
        instruction += '</p>';
        retval += instruction;
    }
    return retval;

}

$(document).ready(function () {

    // Setup 'Lazy Mode' hover tooltip
    $('#deliveryMode').tooltip({ 'trigger': 'hover', 'title': 'Lazy Mode' });


    // Initialize Google Map
    var mapSettings = {
        zoom: 3,
        center: new google.maps.LatLng(35.2259178, -93.2095093),
        panControl: false,
    }

    // Load map
    map = new google.maps.Map(document.getElementById('map-canvas'), mapSettings);

    $("#zipCode").on("click", function () {
        console.log("zip clicked");
    });


    // Zip Code button text input reveal
    $("#zipCode").on('click', function () {
        $("#zipCode").toggleClass('checked');
        $(".main-input").animate({
            marginBottom: '1rem'
        });
        $(".zipSearch-hide").toggle("slow");
    });


    // Current Location button click Event
    $("#currentLocation").on('click', function () {
        $("#currentLocation").toggleClass('checked');
        if (navigator.geolocation) {

            function error(err) {
                console.log(err.code + " " + err.message);
            }

            function success(pos) {
                userPos = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                console.log(userPos);
                //   infoWindow.setContent('Location found.');
                //   infoWindow.open(map);
                // map.setCenter(userPos);
                // map.setZoom(8);   

                $("#currentLocation").addClass
            }

            navigator.geolocation.getCurrentPosition(success, error);

        } else {
            // Browser doelsn't support Geolocation
            alert('Geolocation not supported in your browser');
        }
    });

    $("#get-recipes").on("click", function (event) {

        //takes away button default behavior 
        event.preventDefault();

        // get zip value from the text input
        zipPos = $("#user-zip").val().trim();

        if (userPos || zipPos) {

            $("#ingredient-search-section").animate({
                marginTop: "66px",
                marginBottom: "10px",
                paddingTop: "20px",
                paddingBottom: "20px"
            }, 1000);

            $(".search-text").toggle("slow");
            $(".zipSearch-hide").animate({
                marginBottom: "16px"
            })

            $("#load-more").toggle("slow");
            // $("#ingredient-search-section").animate("margin-bottom", "10px");
            // $("#ingredient-search-section").animate("padding", "5px");
            // $("#ingredient-search-section").css("width", "500px");
            // $("#ingredient-search-section").css("height", "50px");
            // $("#ingredient-search-section").css("color", "black");
            // $("#form-div").css("font-size" , "11px");
            // $("#get-recipes").css("font-size", "11px");
            // $("#box-display").hide();

            // assign food and location input to variable
            var foodInput = $("#ingredient-search-input").val().trim();

            // if foodInput on the event, not empty, empty out the search results section 
            // (in prep for incoming results)
            if (foodInput !== "") {
                $("#ingredient-search-results").empty();
            }

            // If the userPos isn't set, get the Latitude and Longitude coordinates from the Zip Input
            if (zipPos) {

                // build Geocode Query;
                var geoCodeQuery = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + zipPos + '&key=AIzaSyAQss1t9x7lNBkYaeGQQCQLZuY-gT6BmSw';

                console.log(zipPos);
                console.log(geoCodeQuery);

                $.ajax({

                    url: geoCodeQuery,
                    method: "GET",

                }).then(function (response) {

                    userPos = {
                        lat: response.results[0].geometry.location.lat,
                        lng: response.results[0].geometry.location.lng
                    }

                    map.setCenter(userPos);
                    map.setZoom(14);

                    var infoWindow = new google.maps.InfoWindow();

                    var service = new google.maps.places.PlacesService(map);
                    service.nearbySearch({
                        location: userPos,
                        keyword: foodInput,
                        radius: 1000,
                        type: "restaurant"
                    }, callback);

                    function callback(results, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            for (var i = 0; i < results.length; i++) {
                                createMarker(results[i]);
                                buildLocationCard(results[i]);
                            }
                        }
                    }
                
                    function createMarker(place) {
                        var placeLoc = place.geometry.location;
                        var marker = new google.maps.Marker({ map: map, position: placeLoc});

                        google.maps.event.addListener(marker, 'click', function() {
                            infoWindow.setContent(place.name);
                            infoWindow.open(map, this);
                        });
                    }


                }).catch(function (error) {
                    console.log(error);
                });

            } else if (userPos) {

                // Set Center and Zoom Levels to location input
                map.setCenter(userPos);
                map.setZoom(14);


                // Initialize infowindows for Places
                var infoWindow = new google.maps.InfoWindow();


                // Create Places Services Layer with user's position and food keyword, place markers on response
                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch({
                    location: userPos,
                    keyword: foodInput,
                    radius: 5000,
                    type: "restaurant"
                }, callback);

                
                function callback(results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                      for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                      }
                    }
                  }
            
                function createMarker(place) {
                    var placeLoc = place.geometry.location;
                    var marker = new google.maps.Marker({ map: map, position: placeLoc});

                    google.maps.event.addListener(marker, 'click', function() {
                        infoWindow.setContent(place.name);
                        infoWindow.open(map, this);
                    });
                }

            }


            // Spoonacular Recipes API Call
            var spoonQueryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=" + foodInput + "&limitLicense=false&number=12&ranking=1";
            
            $.ajax({

                url: spoonQueryURL,
                method: "GET",
                headers: { "Accept": "application/json", "X-Mashape-Key": "ZFmvhX3Np4mshkom23Cm7BKRqwYFp1LChSXjsnKEoMpsW5hD8n" }

            }).then(function (response) {

                displayRecipes(response);

                var bulkRecipes = createRecipeQuery(response);
                var recipeQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk?ids=" + bulkRecipes + "&includeNutrition=false";

                $.ajax({

                    url: recipeQuery,
                    method: "GET",
                    headers: { "Accept": 'application/json', "X-Mashape-Key": "ZFmvhX3Np4mshkom23Cm7BKRqwYFp1LChSXjsnKEoMpsW5hD8n" }

                }).then(function (response) {

                    buildRecipeModal(response);

                });

            }).catch(function (error) {
                console.log(error);
            });


        }

    });
});


