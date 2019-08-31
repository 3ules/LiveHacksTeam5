const WebSocket = require('ws');


const eventName = 'MindReader';

const ws = new WebSocket(`ws://stagecast.se/api/events/${eventName}/ws?x-user-listener=1`);

const USER = JSON.stringify({
    email: "fkarlsson@solidsport.com",
    password: "Team5Team5",
});
let STATE = {
    AUTHENTICATED: undefined,
    USERS: {},
    GAME: {}
}

const handleMessage = (m) => {
    if(m.type === 'auth' && m.user) {
        STATE.USERS[m.user.id] = {
            name: m.user.name,
            guess: undefined,
            //image: undefined,
        }
        console.log(STATE.USERS);
    }
};

ws.on('open', () => {
    ws.send(USER);
});

ws.on('message', data => {
	try {
        if(data.toString() === "ok") {
            STATE.AUTHENTICATED = true;
            console.log('Authenticated');
        } else {
            data = JSON.parse(data);
            handleMessage(data);
        }
    } catch (e) {
        console.log(e);
    }
});

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

process.on('SIGINT', () => {
	output.closePort();
	process.exit(2);
});