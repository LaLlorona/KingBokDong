console.log("search.js")

// function onchange_search(){
//     console.log($('#movie_title').val())
// }

let search_url = "http://localhost:8000/api/search";
let movie_data;

const ubd_boxoffice = 1147171

function onchange_search(){
    console.log("getTopImdb");
    console.log(JSON.stringify({
        query_string:$('#movie_title').val()
    }))

    fetch(search_url,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query_string:$('#movie_title').val()
        })
    }).then(function(res) {
        // res instanceof Response == true.
        if (res.ok) {
            res.json().then(function(data) {
                console.log(data)

                addContentsOnContainer(data);

            });
        } else {
            console.log("Looks like the response wasn't perfect, got status", res.status);
        }
    }, function(e) {
        console.log("Fetch failed!", e);
    });
}



function addContentsOnContainer(movie_data) {
    removeAllCards()

    for (let i = 0 ; i<movie_data.length/3; i++){
        let deck = document.createElement("div");
        deck.className = "card-deck";

        for (let j =0; j < 3; j ++){
            let card_form;
            if (i*3+j >= movie_data.length){
                card_form=
                    `<div class="card">
                    
                        <div class="hovereffect">
                            <img src="../img/ubd_1.png" class="card-img-top" alt="...">
                            <div class="overlay">
                               <h2>자세히 알아보기</h2>
                               <a class="info" href=" "_blank" rel="noopener noreferrer" >link not available</a>
                            </div>
                        </div>
                    
                       
                    <div class="card-body">
                        <h5 class="card-title">
                            No title
                        </h5>
                        
    
                        <span class = "card-text ubd_score"><span data-toggle="tooltip" data-placement="right" title="엄복동의 박스오피스 결과를 기준으로 한 결과값 입니다."  class="badge badge-secondary">
                        No data</span></span>
                    </div>
                </div>
                <br>`
                }
            else{
                card_form=
                    `<div class="card">
                    
                        <div class="hovereffect">
                            <img src="${movie_data[i*3+j].urlPoster}" class="card-img-top" alt="...">
                            <div class="overlay">
                               <h2>자세히 알아보기</h2>
                               <a class="info" href="${movie_data[i*3+j].movie_url}" target="_blank" rel="noopener noreferrer" >link here</a>
                            </div>
                        </div>
                    
                       
                    <div class="card-body">
                        <h5 class="card-title">
                            ${movie_data[i*3+j].title}
                        </h5>
                        
    
                        <span class = "card-text ubd_score"><span data-toggle="tooltip" data-placement="right" title="엄복동의 박스오피스 결과를 기준으로 한 결과값 입니다."  class="badge badge-secondary">
                        ${(movie_data[i*3+j].gross/ubd_boxoffice).toFixed(3)}UBD</span></span>
                    </div>
                </div>
                <br>`
            }


            deck.insertAdjacentHTML('beforeend',
                card_form

            );
        }
        $(".container").append(deck);

    }
}

function removeAllCards(){
    $('.card-deck').remove();
}