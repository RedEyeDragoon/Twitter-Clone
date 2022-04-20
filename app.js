$(document).ready(() => {
    $('#signUp').modal('show');

    getTweets();

    if(sessionStorage.id) {
        $('.before-log-in').css('visibility', 'hidden');
        $('.after-log-in').css('visibility', 'visible');
        $('#signUp').modal('hide');
    }

})

const firebase = new Firebase('https://fake-twitter-11f80-default-rtdb.firebaseio.com/');
let loggedIn = false;

const signUp = async () => {
    const image = "https://c5.rgstatic.net/m/4671872220764/images/template/default/profile/profile_default_m.jpg"
    const firstName = $('#signUpFirst').val();
    const lastName = $('#signUpLast').val();
    const username = $('#signUpUser').val();
    const password = $('#signUpPass').val();
    let nameTaken = false;

    const userArray = await firebase.getUsers();
    userArray.forEach(user => {
        if (username === user.username) {
            return nameTaken = true;
        }
    })

    if(nameTaken) {
        return alert('Username in use please select another.');
    }

    if (!firstName || !lastName || !username || !password) {
        return alert('Invalid form please complete.');
    }

    const user = new UserDB(image, firstName, lastName, username, password);

    await firebase.createUser(user);
    clearSignUp();
    $('#signUp').modal('hide')
}

const logIn = async () => {
    const username = $('#logInUser').val();
    const password = $('#logInPass').val();
    

    const userArray = await firebase.getUsers();

    userArray.forEach(user => {
        if (username === user.username && password === user.password) {
            alert('Logged In');
            sessionStorage.id = user.id;
            sessionStorage.firstName = user.firstName;
            sessionStorage.lastName = user.lastName;
            sessionStorage.username = user.username;
            sessionStorage.image = user.image;
            loggedIn = true;
        }
    })
    if (!loggedIn) {
        return alert("Incorrect username or password.")
    }
    if (loggedIn) {
        $('.before-log-in').css('visibility', 'hidden');
        $('.after-log-in').css('visibility', 'visible');
        $('#logIn').modal('hide')
    }
    clearLogIn();
    getTweets();
}

const getTweets = async () => {
    const tweets = await firebase.getTweets();

    let tweetDisplay = $('#tweetDisplay');
    tweetDisplay.empty();
    let loggedIn = [];
    
    tweets.forEach(tweet => {
        tweetDisplay.append(`
        <div class="tweet" id=${tweet.id}>
            <img class="tweet-author-img img-thumbnail" src="${tweet.image}">
            <div class="tweet-main">
                <div class="tweet-header">
                    <div class="tweet-author">${tweet.author}</div>
                    <div class="tweet-username">@${tweet.username}</div>
                    <div class="tweet-publish-time">${tweet.time}</div>
                </div>
                <div class="tweet-content">${tweet.content}</div>
            </div>
        </div>
        `) 
        if (sessionStorage.id == tweet.userID) {
            loggedIn.push(tweet);
        }
    })

    loggedIn.forEach(tweet => {
        let tweetID = $('#'+tweet.id)
        tweetID.append(`
        <div class="tweet-buttons">
            <button class="btn btn-primary btn-sm tweet-edit" onclick="editTweet('${tweet.id}')" data-toggle="modal" data-target="#editTweet">Edit</button>
            <button class="btn btn-danger btn-sm tweet-delete" onclick="deleteTweet('${tweet.id}')">Delete</button>
        </div>
        `)
    })

        
}

const editTweet = async tweetID => {
    const tweet = await firebase.getTweet(tweetID);
    $('#tweetEdit').val(tweet.content);
    $('#editTweetButton').attr('onclick', `updateTweet('${tweetID}')`);
}

const updateTweet = async tweetID => {
    const userID = sessionStorage.id;
    const image = sessionStorage.image;
    const author = `${sessionStorage.firstName} ${sessionStorage.lastName}`;
    const username = sessionStorage.username;
    let today = new Date();
    const time = `Edited: ${today.getMonth()+1}/${today.getDate()}`;
    const content = $('#tweetEdit').val();

    const tweet = new TweetDB(userID, image, author, username, time, content)
    await firebase.updateTweet(tweet, tweetID);
    getTweets();
    $('#tweetEdit').val('');
    $('#editTweet').modal('hide')
}

const deleteTweet = async tweetID => {
    if(confirm("Do you want to delete this tweet?")) {
        await firebase.deleteTweet(tweetID);
        getTweets();
    }
}

const makeTweet = async () => {
    const userID = sessionStorage.id;
    const image = sessionStorage.image;
    const author = `${sessionStorage.firstName} ${sessionStorage.lastName}`;
    const username = sessionStorage.username;
    let today = new Date();
    const time = `${today.getMonth()+1}/${today.getDate()}`;
    const content = $('#createTweet').val();

    const tweet = new TweetDB(userID, image, author, username, time, content)
    await firebase.createTweet(tweet);
    getTweets();
    $('#createTweet').val('');
}

const logOut = () => {
    sessionStorage.clear();
    loggedIn = false;
    $('.before-log-in').css('visibility', 'visible');
    $('.after-log-in').css('visibility', 'hidden');
    getTweets();
}

const clearSignUp = () => {
    $('#signUpFirst').val(''); 
    $('#signUpLast').val('');
    $('#signUpUser').val('');
    $('#signUpPass').val('');
}

const clearLogIn = () => {
    $('#logInUser').val('');
    $('#logInPass').val('');
}
