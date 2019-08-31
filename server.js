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

const wp_send = (type, json) => {
    ws.send(JSON.stringify({
        type,
        ...json,
    }));
}

const wp_user_send = (command, string) => {
    ws.send(command);
    ws.send(string);
}

const wait_for_users = () => {

}

const game_start = () => {
    if(state.game.state === 'start') {
        wp_user_send('game', 'choices');
    }
}

const handleMessage = (m) => {
    if(m.type === 'name' && m.user_id) {
        state.users[m.user_id] = {
            name: m.user.name,
            guess: undefined,
            state: 'authenticated',
            score: 0,
        }
        console.log(Object.keys(state.users));
    } else if(m.type === 'user_number' && m.user_id && state.game.state) {
        state.users[m.user_id].number = m.number;
    } else if (m.type === 'game_command' && m.command) {
        if(m.command === 'start' && state.game.state === 'new') {
            state.game.state === 'start',
            wp_user_send('command: game', 'start');
            game_start();
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