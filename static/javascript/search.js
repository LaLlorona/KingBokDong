console.log("search.js")

// function onchange_search(){
//     console.log($('#movie_title').val())
// }

let search_url = "http://ssal.sparcs.org:33219/api/search";
let movie_data;
let spinner = document.getElementById("loading");

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
                spinner.innerHTML = ''

            });
        } else {
            console.log("Looks like the response wasn't perfect, got status", res.status);
            spinner.innerHTML = ''
        }
    }, function(e) {
        console.log("Fetch failed!", e);
        spinner.innerHTML = ''
    });
}



function addContentsOnContainer(movie_data) {
    removeAllCards()
    let over_2000_UBD = '';
    let over_1000_UBD = '';
    let over_2_billion_dollar = '';

    for (let i = 0 ; (i< movie_data.length/3) && (i < 5); i++){
        let deck = document.createElement("div");
        deck.className = "card-deck";


        for (let j =0; j < 3; j ++){
            let card_form;
            over_2000_UBD = '';
            over_1000_UBD = '';
            over_2_billion_dollar = '';

            if (i*3+j >= movie_data.length){ //movie_data 보다 긴 경우
                card_form=
                    `<div class="card">
                    
                        <div class="hovereffect">
                            <img src="../img/ubd_1.png" class="card-img-top" alt="...">
                            <div class="overlay">
                               <h2>자세히 알아보기</h2>
                               <a class="info disabled" href=" "_blank" rel="noopener noreferrer" disabled>link not available</a>
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
                if(movie_data[i*3+j].gross/ubd_boxoffice > 2000){ //2000
                    over_2000_UBD = `
                        
                            <img src="../img/gold_trophy_num.png" width = 50em height = 50 em alt="trophy image">
                            
                        
                `
                }

                if(movie_data[i*3+j].gross/ubd_boxoffice > 1000){ //1000
                    over_1000_UBD = `
                        
                            <img src="../img/bronze_trophy_num.png" width = 50em height = 50 em alt="trophy image">
                            
                        
`
                }
                if (movie_data[i*3+j].gross > 2000000000){ //2000000000
                    over_2_billion_dollar = `
                        
                            <img src="../img/silver_trophy_num.png" width = 50em height = 50 em alt="trophy image">
                            
                        
                
                    `
                }
                card_form=
                    `<div class="card">
                    
                        <div class="hovereffect">
                            <img src="${movie_data[i*3+j].urlPoster}" class="card-img-top" alt="...">
                            <div class="overlay">
                               <h2>자세히 알아보기</h2>
                               <a class="info" href="${movie_data[i*3+j].movie_url}" target="_blank" rel="noopener noreferrer">link here</a>
                            </div>
                        </div>
                    
                       
                    <div class="card-body">
                        <h5 class="card-title">
                            ${movie_data[i*3+j].title}
                            <span style="float:right;cursor: pointer">
                                <img src="../img/question_mark.png" 
                                alt="question mark" data-toggle="modal" data-target="#explain_icons" width = 30px height = 30px>
                            </span>
                        </h5>
                        <p>
                        ${over_2000_UBD}
                        ${over_2_billion_dollar}
                        ${over_1000_UBD}
                        </p>
                        
                        
    
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
let timer;
function searchIfStopForOneSec(){
    spinner.innerHTML = `
    <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
    </div>`

    clearTimeout(timer)
    timer = setTimeout(onchange_search,2000);

}

function removeAllCards(){
    $('.card-deck').remove();
}