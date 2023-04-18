let api_key = 'AIzaSyCbI-zMjgqjt0Ml7C16VCghFj00pYKHUvo';
let g_table_id = '13B1j6q_Z60_JQ18EqBOBqyVtdiYzCv6q-rx4Ie-_fzg';

let styles = document.createElement('style');
styles.innerHTML = `
    .boba-proxy-widget {
        position: fixed;
        right: 0;
        top: 100px;
        background-color: #9CAFB7;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        z-index: 500;
        height: 370px;
        padding: 10px;
        text-align: center;
        width: 300px;
    }
    
    .boba-proxy-widget textarea {
        resize: none;
        width: 270px;
    }
`;

document.head.insertBefore(styles, null);

let widget = `
    ББИ Кокического Прокси
    <br>
    <br>
    <textarea id="deck-list-textarea" cols="40" rows="15"></textarea>
    <br>
    <button id="boba_load_images_button">ПОЕХАЛИ</button>
`;

let widget_element = document.createElement('div');
widget_element.classList.add('boba-proxy-widget');
widget_element.id = "boba-tcg-id";
widget_element.innerHTML = widget;

chrome.extension.sendRequest(chrome.runtime.id, {
    action: 'httpRequest',
    method: 'get',
    url: 'https://sheets.googleapis.com/v4/spreadsheets/' + g_table_id + '/values/Лист1?key=' + api_key,
    params: {}
}, function (response) {

    window.card_pool = {};

    window.races = [];
    window.elements = [];

    let response_cards = response.$result.data.values;

    let headers = ['Название', 'Картинка', 'Тип', 'Раса', 'Размер', 'Элемент'];

    for (let i = 1; i < response_cards.length; i++) {

        let response_card_data = response_cards[i];

        let card_name = response_card_data[0];

        let card_data = {};

        headers.forEach(function(header) {card_data[header] = ''});

        for (let j = 0; j < response_card_data.length; j++) {
            let header_iter = headers[j];
            card_data[header_iter] = response_card_data[j];
        }

        window.card_pool[card_name] = card_data;
    }

    document.body.insertBefore(widget_element, null);

    document.getElementById("boba_load_images_button").onclick=async ()=>{
        let deck_from_text = document.getElementById("deck-list-textarea").value.split('\n');

        document.getElementById("boba-tcg-id").remove();

        var style = document.createElement('style');
        style.innerHTML = '.card{border: 1.5px solid black;}';
        document.head.appendChild(style);

        for (const card_string of deck_from_text) {
            if (card_string) {
                let split_arr = card_string.split(' ');
                let amount = split_arr.shift();
                amount = parseInt(amount);
                let name = split_arr.join(' ');

                let image_url = '';

                if (name in window.card_pool) {
                    image_url = window.card_pool[name]['Картинка'];
                }

                for (let i = 0; i < amount; i++) {
                    document.getElementsByClassName("newcard")[0].click();
                    await new Promise(r => setTimeout(r, 150));
                    let card_inputs = document.getElementsByClassName("card_input");
                    let last_input = card_inputs[card_inputs.length - 1];
                    last_input.value = image_url;
                    let event = new Event('change');
                    last_input.dispatchEvent(event);
                    await new Promise(r => setTimeout(r, 150));
                }
            }
        }

        alert('ГОТОВО!');
    };
});