
var popup = {
    enabled: null,
    indulgeTime: null,
    digits: document.querySelector('span.da-digits'),
    inputDigits: document.querySelector('input.da-digits'),
    strMin: document.getElementsByClassName('da-str-min')[0],
    btnEdit: document.getElementById('da-edit'),
    btnEditWebsites: document.getElementById('da-edit-blocked-websites'),
    btnOk: document.getElementById('da-ok'),
    btnEnable: document.getElementById('da-enable'),
    btnDisable: document.getElementById('da-disable'),
    indulgingTimeMenu: document.getElementById('da-indulging-time-menu'),
    indulgingSitesEditContainer: document.getElementById('da-indulging-sites-edit-container'),
    indulgingSitesAddBtn: document.getElementById('da-indulging-sites-add-btn'),
    indulgingSitesInput: document.getElementById('da-indulging-sites-input'),
    indulgingSitesLinksContainer: document.getElementById('da-indulging-sites-links-container'),
    backFromIndulgingWebsitesBtn: document.getElementById('da-back-from-indulging-websites-btn'),
    init: null
};

popup.readEnabled = () => {
    chrome.storage.sync.get('enabled', (result) => {
        popup.enabled = result.enabled;
        if (!popup.enabled) {
            document.body.classList.add('da-popup-disabled');
        } else {
            document.body.classList.remove('da-popup-disabled');
        }
    });
};

popup.readIndulgeTime = () => {
    chrome.storage.sync.get('indulgeTime', (result) => {
        if (result && result.indulgeTime && typeof (result.indulgeTime) === 'number') {
            popup.indulgeTime = result.indulgeTime;
        } else {
            popup.indulgeTime = 25;
        }
        popup.digits.innerHTML = popup.indulgeTime;
        popup.inputDigits.value = popup.indulgeTime;
    });
};
popup.refreshBlockedWebsites = () => {
    chrome.storage.sync.get('blockedWebsites', ({ blockedWebsites }) => {
        console.log(blockedWebsites);
        popup.indulgingSitesLinksContainer.innerHTML = "";
        for (const website of blockedWebsites) {
            var p = document.createElement('p');
            p.innerHTML = website + "<span class='da-remove-blocked-website-btn'>   X</span>";
            popup.indulgingSitesLinksContainer.prepend(p);
        }
    })
}

popup.init = () => {
    popup.readEnabled();
    popup.readIndulgeTime();

    popup.btnDisable.addEventListener('click', () => {
        chrome.storage.sync.set({ "enabled": false }, () => {
            document.body.classList.add('da-popup-disabled');
        });
    });

    popup.btnEnable.addEventListener('click', () => {
        chrome.storage.sync.set({ "enabled": true }, () => {
            document.body.classList.remove('da-popup-disabled');
        });
    });

    popup.btnEdit.addEventListener('click', () => {
        document.body.classList.add('da-popup-edit');
    });

    popup.btnEditWebsites.addEventListener('click', () => {
        popup.refreshBlockedWebsites();
        popup.indulgingTimeMenu.classList.add("da-disabled");
        popup.indulgingSitesEditContainer.classList.remove("da-disabled");
    });

    popup.indulgingSitesEditContainer.addEventListener('click', (e) => {
        if (e.target.className === "da-remove-blocked-website-btn") {
            const parent = e.target.parentElement;
            const websiteName = parent.innerText.split(" ")[0];
            chrome.storage.sync.get('blockedWebsites', ({ blockedWebsites }) => {
                chrome.storage.sync.set({ "blockedWebsites": blockedWebsites.filter(item => item !== websiteName) },
                                        popup.refreshBlockedWebsites)
            })
        }
    });

    popup.backFromIndulgingWebsitesBtn.addEventListener('click', () => {
        popup.indulgingTimeMenu.classList.remove("da-disabled");
        popup.indulgingSitesEditContainer.classList.add("da-disabled");
    })

    popup.indulgingSitesAddBtn.addEventListener('click', () => {
        chrome.storage.sync.get('blockedWebsites', ({ blockedWebsites }) => {
            const value = popup.indulgingSitesInput.value;
            if (blockedWebsites && blockedWebsites.length)
                chrome.storage.sync.set({ "blockedWebsites": [...blockedWebsites, value] }, popup.refreshBlockedWebsites)
            else
                chrome.storage.sync.set({ "blockedWebsites": [value] }, popup.refreshBlockedWebsites)
        })
    })


    popup.btnOk.addEventListener('click', () => {
        var t = parseInt(popup.inputDigits.value);
        if (t <= 0) t = 25;
        chrome.storage.sync.set({ "indulgeTime": t }, () => {
            document.body.classList.remove('da-popup-edit');
            popup.readIndulgeTime();
        });
    });
};

popup.init();
