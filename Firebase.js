class Firebase {
    constructor(url) {
        this.url = url;
    }

    createUser = user => {
        return new Promise(resolve => {
            $.ajax({
                'url': `${this.url}/users.json`,
                'type': 'POST',
                'contentType': 'application/json',
                'data': JSON.stringify(user),
                'success': function() {
                    resolve();
                },
                'error': function(error) {
                    console.error(error);
                }
            })
        })
    }

    createTweet = tweet => {
        return new Promise(resolve => {
            $.ajax({
                'url': `${this.url}/tweets.json`,
                'type': 'POST',
                'contentType': 'application/json',
                'data': JSON.stringify(tweet),
                'success': function() {
                    resolve();
                },
                'error': function(error) {
                    console.error(error);
                }
            })
        })
    }

    getUsers = () => {
        return new Promise(resolve => {
            $.ajax({
                'url': `${this.url}/users.json`,
                'type': 'GET',
                'contentType': 'application/json',
                'success': function(data) {
                    let users = [];
                    for (const id in data) {
                        const image = data[id].image;
                        const firstName = data[id].firstName;
                        const lastName = data[id].lastName;
                        const username = data[id].username;
                        const password = data[id].password;

                        const user = new User (id, image, firstName, lastName, username, password)
                        users.push(user);
                    }
                    resolve(users);
                },
                'error': function(error) {
                    console.error(error);
                }
            })
        })
    }

    getTweets = () => {
        return new Promise(resolve => {
            $.ajax({
                'url': `${this.url}/tweets.json`,
                'type': 'GET',
                'contentType': 'application/json',
                'success': function(data) {
                    const stringData = JSON.stringify(data);
                    const parseData = JSON.parse(stringData);
                    
                    let tweets = [];
                    for (const id in parseData) {
                        const userID = parseData[id].userID;
                        const image = parseData[id].image;
                        const author = parseData[id].author;
                        const username = parseData[id].username;
                        const time = parseData[id].time;
                        const content = parseData[id].content;

                        const tweet = new Tweet (id, userID, image, author, username, time, content);
                        tweets.push(tweet);
                    }
                    
                    resolve(tweets);
                },
                'error': function(error) {
                    console.error(error);
                }
            })
        })
    }

    getTweet = tweetID => {
        return new Promise(resolve => {
            $.ajax({
                'url': `${this.url}/tweets/${tweetID}.json`,
                'type': 'GET',
                'contentType': 'application/json',
                'success': function(data) {
                    resolve(data);
                },
                'error': function(error) {
                    console.error(error);
                }
            })
        })
    }

    updateTweet = (tweet, tweetID) => {
        return new Promise(resolve => {
            $.ajax({
                'url': `${this.url}/tweets/${tweetID}.json`,
                'type': 'PUT',
                'contentType': 'application/json',
                'data': JSON.stringify(tweet),
                'success': function() {
                    resolve();
                },
                'error': function(error) {
                    console.error(error);
                }
            })
        })
    }

    deleteTweet = tweetID => {
        return new Promise(resolve => {
            $.ajax({
                'url': `${this.url}/tweets/${tweetID}.json`,
                'type': 'DELETE',
                'contentType': 'application/json',
                'success': function() {
                    resolve();
                },
                'error': function(error) {
                    console.error(error);
                }
            })
        })
    }

}

