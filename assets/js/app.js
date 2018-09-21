function buildRecipeCard(responseObj) {

    var recipeContainer = $('<div class="col-sm-6 col-md-4 col-lg-3"><div class="ingredient-card">');
    var recipeCard = $('<div class="ingredient-card">');
    recipeContainer.append(recipeCard);
    var recipeContent = '<img class="mx-auto img-fluid d-block" src="'+responseObj.image+'"><h3>'+responseObj.title+'</h3><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#recipe-'+Number(responseObj.id)+'">See Recipe</button>';  
    recipeCard.append(recipeContent);
    return recipeContainer;

}

function buildRecipeModal(responseObj) {
    for (var i=0; i<responseObj.length; i++){

        var modalId = "recipe-" + responseObj[i].id;

        var recipeModal = '<div class="modal fade bd-example-modal-lg" id="'+modalId+'" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">'+responseObj[i].title+'</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><p>'+responseObj[i].instructions+'</p></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div></div>';

        $("#recipe-modal").append(recipeModal);

    }
}

function displayRecipes(response) {

    var display = $('<div class="row">');

    for (var i=0; i<response.length; i++) {
        var singleRecipe = buildRecipeCard(response[i]);
        console.log(singleRecipe);
        display.append(singleRecipe);
    }

    console.log(display);
    $("#ingredient-search-results").append(display);

}


$("#get-recipes").on("click", function (event){
    console.log("ive been clicked");
    $("#ingredient-search-results").empty();
    var foodInput = $("#ingredient-search-input").val().trim();
    console.log(foodInput);
    //takes away button default behavior 
    event.preventDefault();
    //empty out the value after clicking
    $("#food").on("#get-recipes").val("");

    var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=" + foodInput + "&limitLicense=false&number=12&ranking=1";


    $.ajax({

        url: queryURL,
        method: "GET",
        headers: {"Accept": "application/json", "X-Mashape-Key": "ZFmvhX3Np4mshkom23Cm7BKRqwYFp1LChSXjsnKEoMpsW5hD8n"}

    }).then(function(response){
        console.log(response);
        displayRecipes(response);

        // create bulk recipe query based on response recipe ID
        var bulkRecipes = ""
        for(var i= 0; i<response.length; i++){
            if (i === response.length-1) {
                bulkRecipes += response[i].id
            } else {
                bulkRecipes += response[i].id + "%2C";
            }
        }

        var recipeQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk?ids="+bulkRecipes+"&includeNutrition=false";

        $.ajax({

            url: recipeQuery,
            method: "GET",
            headers: {"Accept": 'application/json',"X-Mashape-Key": "ZFmvhX3Np4mshkom23Cm7BKRqwYFp1LChSXjsnKEoMpsW5hD8n"}

        }).then(function(response){

            buildRecipeModal(response);

        });

    }).catch(function(error){

        console.log(error);

    });

});




