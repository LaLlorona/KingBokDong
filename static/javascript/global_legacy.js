

let movie_data = imdb_top_movies.data.movies;

function addContentsOnContainer() {

    for (let i = 0 ; i<imdb_top_movies.data.movies.length/3; i++){
        let deck = document.createElement("div");
        deck.className = "card-deck";
        console.log("deck created")
        for (let j =0; j < 3; j ++){
            let card_form=
                `<div class="card">
                    
                        <div class="hovereffect">
                            <img src="${movie_data[i*3+j].urlPoster}" class="card-img-top" alt="...">
                            <div class="overlay">
                               <h2>자세히 알아보기</h2>
                               <a class="info" href="https://www.imdb.com/title/${movie_data[i*3+j].idIMDB}" target="_blank" rel="noopener noreferrer" >link here</a>
                            </div>
                        </div>
                    
                       
                    <div class="card-body">
                        <h5 class="card-title">
                            ${movie_data[i*3+j].title}
                        </h5>
                        <span class = "img_container">
                            <img src = "../img/medal.png" width = 50em height = 50 em>
                            <div class = "centered">${movie_data[i*3+j].ranking}</div>
                        </span>
    
                        <span class = "card-text ubd_score"><span data-toggle="tooltip" data-placement="right" title="엄복동의 박스오피스 결과를 기준으로 한 결과값 입니다."  class="badge badge-secondary">25.1UBD</span></span>
                    </div>
                </div>`

            deck.insertAdjacentHTML('beforeend',
                card_form

            );
        }
        $(".container").append(deck);

    }
}
addContentsOnContainer();