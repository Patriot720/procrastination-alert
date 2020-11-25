var bar = {
    node: null,
    msgNode: null,
    switchMsg: null,
    slideIn: null,
    slideOut: null,
    messages: [
        '',
        '',
        'Time to get back to work.',
        'If you feel bored, go for a walk.',
        'If you are tired, go to bed early.'
    ],
    currMsg: -1,
    startTime: Date.now(),
    indulgeTime: 25
};

bar.node = document.createElement('div');
bar.node.id = 'da-bar';

bar.msgNode = document.createElement('p');
bar.msgNode.classList.add('da-msg', 'da-fade-in');

bar.node.style.minWidth = Math.max( ...bar.messages.map((m)=>m.length) )*12 + 'px';

bar.node.appendChild(bar.msgNode);

bar.refreshMsg = ()=>{
    bar.msgNode.innerHTML = bar.messages[bar.currMsg];
    if (bar.currMsg === 0){
        var minutes = Math.floor( (Date.now() - bar.startTime)/1000/60 );
        bar.msgNode.innerHTML = `You have spent <span class="da-minute">${minutes}</span> minutes on this site.`
    } else if (bar.currMsg === 1){
        bar.msgNode.innerHTML = `<span class="da-minute">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
    }
};

bar.switchMsg = ()=>{
    bar.msgNode.classList.remove('da-fade-in');
    setTimeout(()=>{
        bar.currMsg++;
        bar.currMsg %= bar.messages.length;
        bar.refreshMsg();
        bar.msgNode.classList.add('da-fade-in');
    }, 300);
};


bar.slideIn = ()=>{
    bar.node.classList.add('da-slide-in');
};

bar.slideOut = ()=>{
    bar.node.classList.remove('da-slide-in');
};

bar.start = ()=>{
    document.getElementsByTagName('html')[0].prepend(bar.node);
    
    setTimeout(()=>{bar.slideIn();}, 1000);

    setTimeout(()=>{
        bar.slideOut();
        bar.switchMsg();

        setTimeout(()=>{
            bar.refreshMsg();
            bar.slideIn();
            var t = setInterval(bar.switchMsg, 5000);
        }, 1000 * 60 * bar.indulgeTime);
    }, 1000*6);
};

chrome.storage.sync.get('enabled', (result)=>{
    if (result.enabled){

        chrome.storage.sync.get('indulgeTime', (result)=>{
            if (result && result.indulgeTime && typeof(result.indulgeTime) === 'number'){
                bar.indulgeTime = result.indulgeTime;
            } else{
                bar.indulgeTime = 25;
            }
            
            bar.msgNode.innerHTML = `Enjoy the site for now. Will send you gentle reminders in ${bar.indulgeTime} minutes.`;
            bar.start();
        });

    }
});




