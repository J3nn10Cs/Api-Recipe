function startApp(){    
    const selectCategories = document.querySelector('#categorias');
    const result = document.querySelector('#resultado')
    const modal = new bootstrap.Modal('#modal',{})
    selectCategories.addEventListener('change', selectCategorie);    
    getCategories();    
    function getCategories(){
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
        
        fetch(url)
        .then( request => {
            return request.json()
        } )
        .then( result => {
            showCargategories(result.categories);
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    //mostrarCategoria
    function showCargategories(categories = []){
        categories.forEach( categorie => {
            const showOption = document.createElement('option');
            const {strCategory} = categorie;
            showOption.textContent = strCategory
            showOption.value = strCategory
            selectCategories.appendChild(showOption)
        })
    }
    
    function selectCategorie(e){
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${e.target.value}`
        console.log(url)
        fetch(url)
            .then(request => {
                return request.json();
            })
            .then(result => {
                filterCategories(result.meals);
            })
    }

    function filterCategories(categories){

        const heading = document.createElement('h2')
        heading.classList.add('text-center','text-black','my-5')
        heading.textContent = categories.length ? 'Results' : 'No results'
        result.appendChild(heading)

        deleteHtml(result);
        categories.forEach(categorie => {            
            const {idMeal,strMeal,strMealThumb} = categorie;
            
            const containerRecipe = document.createElement('div');
            containerRecipe.classList.add('col-md-4');

            const recipeCard = document.createElement('div');
            recipeCard.classList.add('card','mb-4');

            const recipeImg = document.createElement('img')
            recipeImg.classList.add('card-img-top');
            recipeImg.alt = `Imagen de la receta ${strMeal}`
            recipeImg.src = strMealThumb;

            const recipeBody = document.createElement('div');
            recipeBody.classList.add('card-body')

            const recipeHeading = document.createElement('H3');
            recipeHeading.classList.add('card-title','mb-3')
            recipeHeading.textContent = strMeal;

            const recipeButton = document.createElement('button');
            recipeButton.classList.add('btn','btn-danger','w-100');
            recipeButton.textContent = 'Ver receta'
            // recipeButton.dataset.bsTarget = "#modal"
            // recipeButton.dataset.bsToggle = "modal"

            recipeButton.onclick = function () {
                selectRecipe(idMeal);
            }

            //Inyectar
            recipeBody.appendChild(recipeHeading);
            recipeBody.appendChild(recipeButton);

            recipeCard.appendChild(recipeImg);
            recipeCard.appendChild(recipeBody);

            containerRecipe.appendChild(recipeCard)


            result.appendChild(containerRecipe);
        })
    }

    function selectRecipe(id){
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

        fetch(url)
            .then(request => {
                return request.json()
            })
            .then(result => {
                showRecipe(result.meals[0]);
            })
    }

    function showRecipe(recipe){
        const {idMeal,strMeal,strInstructions,strMealThumb} = recipe;

        //Añadir contenido al modal
        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');

        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="recerta ${strMeal}"/>
            <h3 class="my-3">Instucciones</h3>
            <p> ${strInstructions} </p>
            <h3 class="my-3"> Ingredients and quantities </h3>
        `

        const ingredientUl = document.createElement('UL');
        ingredientUl.classList.add('list-group');


        //Mostrar cantidades e ingredientes
        for(let i = 1; i<=20;i++ ){
            if(recipe[`strIngredient${i}`]){
                const ingredient = recipe[`strIngredient${i}`];
                const cant = recipe[`strIngredient${i}`];

                const ingredientLI = document.createElement('LI');
                ingredientLI.classList.add('list-group-item');
                ingredientLI.textContent = `${ingredient} - ${cant}`

                ingredientUl.appendChild(ingredientLI)
            }
        }

        modalBody.appendChild(ingredientUl);

        //Mostrar modal
        modal.show();

    }

    function deleteHtml(selector){
        while(selector.firstChild){
            selector.removeChild(selector.firstChild)
        }
    }
}

document.addEventListener('DOMContentLoaded', startApp )