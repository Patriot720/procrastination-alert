var popup = {
    enabled: null,
    indulgeTime: null,
    digits: document.querySelector('span.da-digits'),
    inputDigits: document.querySelector('input.da-digits'),
    strMin: document.getElementsByClassName('da-str-min')[0],
    btnEdit: document.getElementById('da-edit'),
    btnOk: document.getElementById('da-ok'),
    btnEnable: document.getElementById('da-enable'),
    btnDisable: document.getElementById('da-disable'),
    init: null
};

popup.readEnabled = () => {
    chrome.storage.sync.get('enabled', (result)=>{
        popup.enabled = result.enabled;
        if (!popup.enabled){
            document.body.classList.add('da-popup-disabled');
        } else{
            document.body.classList.remove('da-popup-disabled');
        }
    });
};

popup.readIndulgeTime = () => {
    chrome.storage.sync.get('indulgeTime', (result)=>{
        if (result && result.indulgeTime && typeof(result.indulgeTime) === 'number'){
            popup.indulgeTime = result.indulgeTime;
        } else{
            popup.indulgeTime = 25;
        }
        popup.digits.innerHTML = popup.indulgeTime;
        popup.inputDigits.value = popup.indulgeTime;
    });
};

popup.init = () => {
    popup.readEnabled();
    popup.readIndulgeTime();

    popup.btnDisable.addEventListener('click', ()=>{
        chrome.storage.sync.set({"enabled": false}, ()=>{
            document.body.classList.add('da-popup-disabled');
        });
    });

    popup.btnEnable.addEventListener('click', ()=>{
        chrome.storage.sync.set({"enabled": true}, ()=>{
            document.body.classList.remove('da-popup-disabled');
        });
    });

    popup.btnEdit.addEventListener('click', ()=>{
        document.body.classList.add('da-popup-edit');
    });

    popup.btnOk.addEventListener('click', ()=>{
        var t = parseInt(popup.inputDigits.value);
        if (t<=0) t = 25;
        chrome.storage.sync.set({"indulgeTime": t}, ()=>{
            document.body.classList.remove('da-popup-edit');
            popup.readIndulgeTime();
        });
    });
};

popup.init();