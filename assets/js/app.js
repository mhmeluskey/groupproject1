function buildRecipeCard(responseObj) {
    var recipeContainer = $('<div class="col-sm-6 col-md-4 col-lg-3"><div class="ingredient-card">');
    var recipeCard = $('<div class="ingredient-card">');
    recipeContainer.append(recipeCard);
    var recipeContent = '<img class="mx-auto img-fluid d-block" src="'+responseObj.image+'"><h3>'+responseObj.title+'</h3>'
    recipeCard.append(recipeContent);

    return recipeContainer;

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



// var search = foodInput;
var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=" + foodInput + "&limitLicense=false&number=5&ranking=1";


$.ajax({
    url: queryURL,
    method: "GET",
    headers: {"Accept": "application/json", "X-Mashape-Key": "ZFmvhX3Np4mshkom23Cm7BKRqwYFp1LChSXjsnKEoMpsW5hD8n"}
}).then(function(response){
    console.log("hello");
    console.log(response);
    displayRecipes(response);
}).catch(function(error){
    console.log(error);
});


});

