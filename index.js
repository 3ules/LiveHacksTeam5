const WebSocket = require('ws');

const EVENT_NAME = 'MindReader';
const ws = new WebSocket(`ws://stagecast.se/api/events/${EVENT_NAME}/ws?x-user-listener=1`);
const SERVER_USER = JSON.stringify({
    email: "fkarlsson@solidsport.com",
    password: "Team5Team5",
});


// users states
// 'ready'
// 'waiting'
// 'quit'
// ''


// Game states
// new
// guess
// reveal
// result

let state = {
    authenticated: undefined,
    users: {},
    game: {
        state: "new",
        user_scores: {},
    }
}

const game_init = () => {

    ws.send(JSON.stringify({state: state.game.state}))
}

const handleMessage = (m) => {
    if(m.type === 'auth' && m.user) {
        state.users[m.user.id] = {
            name: m.user.name,
            guess: undefined,
            state: 'authenticated',
            score: 0,
        }
        console.log(Object.keys(state.users));
    } else if (m.type === 'game_command' && m.command) {
        if(command === 'start' && state.game.state === 'new') {
            state.game.state === 'start',
            game_init();
        }
    } else if (m.type === 'user_guess' && m.user) {
        if(state.users[m.user.id]) {
            state.users[m.user.id].guess = m.user.guess
        }
    }
};

ws.on('open', () => {
    ws.send(SERVER_USER);
});

ws.on('message', data => {
	try {
        if(data.toString() === "ok") {
            state.authenticated = true;
            console.log('Authenticated');
        } else {
            data = JSON.parse(data);
            handleMessage(data);
        }
    } catch (e) {
        console.log(e);
    }
});

process.on('SIGINT', () => {
	output.closePort();
	process.exit(2);
});