let mojo_top100_url = "http://localhost:8000/api/get_mojo_top_100";
let movie_data;

const ubd_boxoffice = 1147171

function getTopImdb(){
    console.log("getTopImdb");

    fetch(mojo_top100_url).then(function(res) {
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
getTopImdb()


function addContentsOnContainer(movie_data) {
    let over_2000_UBD = '';
    let over_1000_UBD = '';
    let over_2_billion_dollar = '';

    for (let i = 0 ; i<movie_data.length/3; i++){
        let deck = document.createElement("div");
        deck.className = "card-deck";

        for (let j =0; j < 3; j ++){
            over_2000_UBD = '';
            over_1000_UBD = '';
            over_2_billion_dollar = '';
            if(movie_data[i*3+j].gross*1000000/ubd_boxoffice > 2000){
                over_2000_UBD = "wow 2000"
            }

            if(movie_data[i*3+j].gross*1000000/ubd_boxoffice > 1000){
                over_1000_UBD = "wow 1000"
            }
            if (movie_data[i*3+j].gross > 2000){
                over_2_billion_dollar = "wow 2 billion"
            }

            let card_form=
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
                        <span class = "img_container">
                            <img src = "../img/medal.png" width = 50em height = 50 em>
                            <div class = "centered">${movie_data[i*3+j].ranking}</div>
                        </span>
                        
                        ${over_2000_UBD}
                        ${over_1000_UBD}
                        ${over_2_billion_dollar}
    
                        <span class = "card-text ubd_score"><span data-toggle="tooltip" data-placement="right" title="엄복동의 박스오피스 결과를 기준으로 한 결과값 입니다."  class="badge badge-secondary">
                        ${Math.floor(movie_data[i*3+j].gross*1000000/ubd_boxoffice)}UBD</span></span>
                    </div>
                </div>
                <br>`

            deck.insertAdjacentHTML('beforeend',
                card_form

            );
        }
        $(".container").append(deck);

    }
}
//addContentsOnContainer();
