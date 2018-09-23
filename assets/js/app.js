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


function buildRecipeModal(responseObj) {

    for (var i = 0; i < responseObj.length; i++) {

        console.log(responseObj[i]);

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
        recipeModal += '<p>' + instructionsBuild(responseObj[i]) + '</p>';


        recipeModal += '</div>';
        recipeModal += '</div>';
        recipeModal += '<div class="row my-4">';
        recipeModal += '<div class="col-sm-12 text-center">';
        // New Button
        recipeModal += '<a href="' + responseObj[i].sourceUrl + '"target="_blank" class="btn btn-primary btn-lg" role="button" aria-disabled="false">See Instructions</a>'
        //
        /* CLEARING OUT THESE BUTTONS FOR CLARITY 
                                      recipeModal += '<button class="btn btn-primary btn-lg" data-nutrition-val="#">Eat it On</button><button class="btn btn-warning btn-lg ml-4">Work It Off</button>'
                              recipeModal += '</div>';
                          recipeModal += '</div>';
                          CLEARING OUT BUTTONS FOR CLARITY*/
        recipeModal += '<div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div>';
        recipeModal += '</div>';
        recipeModal += '</div>';
        recipeModal += '</div>';
       

        $("#recipe-modal").append(recipeModal);

    }



}

function displayRecipes(response) {

    var display = $('<div class="row">');

    for (var i = 0; i < response.length; i++) {
        var singleRecipe = buildRecipeCard(response[i]);
        console.log(singleRecipe);
        display.append(singleRecipe);
    }

    console.log(display);
    $("#ingredient-search-results").append(display);

}

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

function instructionsBuild(responseObj) {
    console.log("instructionsBuild");
    //--------Display instructions and external source URL
    console.log(responseObj);
    console.log(responseObj.sourceUrl);
    console.log(responseObj.instructions);



    retval = "";
    for (var i = 0; i < responseObj.length; i++) {
        var instruction = '<p>';
        instruction += responseObj[i].number + '.) ';
        instruction += '<span class="recipe-instruction">' + responseObj[i].step + '</span>';
        instruction += '</p>';
        retval += instruction;


/*
        $("#external").on("click", function(){
            alert("hit");
        });
*/
    }
    return retval;



}




$("#get-recipes").on("click", function (event) {
    $("#ingredient-search-results").empty();
    var foodInput = $("#ingredient-search-input").val().trim();
    //takes away button default behavior 
    event.preventDefault();
    //empty out the value after clicking
    $("#ingredient-search-input").on("#get-recipes").val("");

    var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=" + foodInput + "&limitLicense=false&number=12&ranking=1";

    $.ajax({

        url: queryURL,
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

});




