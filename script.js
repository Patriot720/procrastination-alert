var bar = {
    node: null,
    msgNode: null,
    switchMsg: null,
    slideIn: null,
    slideOut: null,
    messages: [
        '',
        'Time to get back to work.',
        'Or go for a walk if you feel bored.',
        'Or Go to bed early if you are tired.'
    ],
    nextMsg: 0,
    startTime: Date.now(),
    indulgingTime: 25
};

bar.node = document.createElement('div');
bar.node.id = 'da-bar';

bar.msgNode = document.createElement('p');
bar.msgNode.classList.add('da-msg', 'da-fade-in');
bar.msgNode.innerHTML = `Enjoy the site for now. Will send you gentle reminders in ${bar.indulgingTime} minutes.`;

bar.node.style.minWidth = Math.max( ...bar.messages.map((m)=>m.length) )*12 + 'px';

bar.node.appendChild(bar.msgNode);

bar.switchMsg = ()=>{
    bar.msgNode.classList.remove('da-fade-in');
    setTimeout(()=>{
        bar.nextMsg %= bar.messages.length;
        bar.msgNode.innerHTML = bar.messages[bar.nextMsg];
        if (bar.nextMsg === 0){
            bar.msgNode.innerHTML = `You have spent <span class="da-minute">${Math.floor( (Date.now() - bar.startTime)/1000/60 )}</span> minutes on this site.`
        }
        bar.nextMsg++;
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
    bar.slideIn();
    setTimeout(()=>{
        bar.slideOut();
        bar.switchMsg();

        setTimeout(()=>{
            bar.slideIn();
            var t = setInterval(bar.switchMsg, 5000);
        }, 1000 * 60 * bar.indulgingTime);
    }, 1000*6);
};

bar.start();


