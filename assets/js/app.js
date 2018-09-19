$("#get-recipes").on("click", function (event){
    console.log("ive been clicked");
    var foodInput = $("#food").val().trim();
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
}).catch(function(error){
    console.log(error);
});


});