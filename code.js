document.addEventListener("DOMContentLoaded", function(event) {
    GameConnector.init();
});


var GameConnector = {
    GAME_ENTRY_CODE: '123456',
    GAME_ID: "GuessTheQuote",

    init: function() {
        document.querySelectorAll('.modal').forEach(el => el.classList.remove('--show'));
        this.showCodeScreen();
        PusherManager.init();
        PusherManager.connectToChannel();
    },

    onPusherConnected: function() {
        console.log("Pusher connected.");
    },

    showCodeScreen: function() {
        document.getElementById('code').classList.add('--show');
        const submitButton = document.getElementById('code-submit');
        const inputField = document.getElementById('code-input');

        submitButton.replaceWith(submitButton.cloneNode(true));
        document.getElementById('code-submit').onclick = () => this.onCodeSubmitClicked();

        inputField.replaceWith(inputField.cloneNode(true));
        document.getElementById('code-input').onkeypress = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.onCodeSubmitClicked();
            }
        };
    },

    onCodeSubmitClicked: function() {
        const inputField = document.getElementById('code-input');
        if(inputField.value === this.GAME_ENTRY_CODE){
            document.getElementById('code').classList.remove('--show');
            if (window.startIntroduction) {
                 window.startIntroduction();
            } else {
                console.error("startIntroduction function not found in site.js");
            }
        }else{
            inputField.value = '';
            alert('Incorrect code. Please try again.');
        }
    },

    triggerGameFinish: function () {
        PusherManager.sendMessageToChannel({
            msg: 'Game Finished!',
            gameID: this.GAME_ID
        });
        document.getElementById('MediaPlayer').classList.remove('--show');
        document.getElementById('InputDialog').classList.remove('--show');
        document.getElementById('result').classList.add('--show');
    }
};


var PusherManager = {
    CHANNEL_ID: "blockbuster",

    pusher: null,
    bIsHost: false,
    presenceChannel: null,
    sUserID: "",
    bIsConnected: false,

    init: function () {
        Pusher.logToConsole = true;

        this.pusher = new Pusher('34aeee625e438241557b', {
            cluster: 'eu',
            forceTLS: true,
            authEndpoint: 'https://interactionfigure.nl/nhl/blockbusterauth/pusher_auth.php'
        });
    },

    connectToChannel: function () {
        this.presenceChannel = this.pusher.subscribe('presence-'+this.CHANNEL_ID);
        this.presenceChannel.bind('pusher:subscription_succeeded', this.onSubscriptionSucceeded.bind(this));
    },

    onSubscriptionSucceeded: function (_data) {
        this.sUserID = _data.myID+"";

        GameConnector.onPusherConnected()
        
        this.presenceChannel.bind('pusher:member_added', this.onMemberAdded.bind(this));
        this.presenceChannel.bind('pusher:member_removed', this.onMemberRemoved.bind(this));
        this.presenceChannel.bind('client-messagetochannel', this.onMessageFromOtherPlayer.bind(this));
    },

    onMemberAdded: function (_data) {
        console.log('onMemberAdded', _data);
    },

    onMemberRemoved: function (_data) {
        console.log('onMemberRemoved', _data);
    },

    sendMessageToChannel: function (_msg) {
        this.presenceChannel.trigger('client-messagetochannel', _msg);
    },

    onMessageFromOtherPlayer: function (_msg) {
        console.log('onMessageFromOtherPlayer', _msg);
    }
};

