let invited = 0; //people invited
let index = 0; //index of the actual post
let posts; //collection of posts
let maxPosts;//maximum number of posts
let urlList = [];

chrome.runtime.onMessage.addListener(gotMessage);
console.log("FacebookAutoInvite loaded.");

function gotMessage(message, sender, sendResponse){
    console.log(message.txt);
    if(message.txt === "start"){
        maxPosts = message.maxPosts;
        urlList = message.urlList;
        getPosts();
    }
    if(message.txt === "next"){
        setTimeout(function(){
            console.log("Next")
            maxPosts = message.maxPosts;
            urlList = message.urlList;
            urlList.shift();
            getPosts();
        }, 10000);
    }
}

function getPosts(){
    posts = document.querySelectorAll("._1xnd ._2x4v");
    console.log(posts);
    openPost(index);
    window.scrollBy(0, 999999);
}

function openPost(ind){ //open a post
    if(maxPosts == 0 || ind < maxPosts){
        if(ind < posts.length){
            //posts[ind].scrollIntoView({block: "start", behavior: "instant"});
            posts[ind].click();
            autoInvite(0, 0);
        }
        else{
            if(urlList.length != 0){
                chrome.runtime.sendMessage({urlList: urlList, maxPosts: maxPosts});
            }
        }
    }
    else{
        if(urlList.length != 0){
            chrome.runtime.sendMessage({urlList: urlList, maxPosts: maxPosts});
        }
    }
}

function autoInvite(p, a){
    let prevLength = p; //previous length of likers
    let actualLength = a; //actual length of likers

    let buttons = document.querySelectorAll('._4t2a ._42ft'); //get invite buttons
    actualLength = buttons.length;

    for(let i = prevLength; i < actualLength; i++){
        buttons[i].scrollIntoView({block: "start", behavior: "smooth"});
      setTimeout(function () {
        if(buttons[i].getAttribute('ajaxify') != null && //check if the button is an invite button and if its active
          buttons[i].getAttribute('ajaxify').indexOf('invite') != -1) {
            buttons[i].click();
            invited++;
            console.log(invited);
        }
      }, Math.floor(Math.random()*(3000-1000+1)+1000),
        buttons, i);
    }

    let seeMore = document.querySelector("#reaction_profile_pager > div > a"); // get "see more" links
    if(seeMore != null){
        seeMore.click();
    }
    setTimeout(function(){
        prevLength = actualLength;
        let buttons = document.querySelectorAll('._4t2a ._42ft');
        actualLength = buttons.length;
        if(prevLength !== actualLength){ //check if the previous and the actual lenght is different to continue scrapping or not
            autoInvite(prevLength, actualLength);
        }
        else{
            document.querySelector("._4t2a .layerCancel").click(); //get the close button
            window.scrollTo(0,document.body.scrollHeight);
            posts = document.querySelectorAll("._1xnd ._2x4v");
            console.log(posts);
            index++;
            setTimeout(function(){
                openPost(index);
            }, 1000);
        }
    }, 2000);
}
