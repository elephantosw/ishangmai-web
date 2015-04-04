function init_socket() {
	socket = new WebSocket("ws://192.168.0.116/api/socket");
	socket.onopen = function(evt) {
		onOpen(evt)
	};
	socket.onclose = function(evt) {
		onClose(evt)
	};
	socket.onmessage = function(evt) {
		onMessage(evt)
	};
	socket.onerror = function(evt) {
		onError(evt)
	};
}

function onOpen(evt) {
	console.log("Socket open");
	registerSocketService();
}

function onClose(evt) {
	console.log("Socket closed");
}

function onMessage(evt) {
	console.log(evt.data);
	var recvData = $.parseJSON(evt.data);
	if (1) {
		var type = parseInt(recvData.type);
		switch (type) {
			case 0:
				{
					socket_token = recvData.token.access_token;
					console.log("registered socket service");
				}
				break;
			case 1:
				{

				}
				break;
			case 2:
				{
					socket_token = recvData.token.access_token;
				}
				break;
			case 3:
				{
					if (socket_token == recvData.token.access_token) {
						
					}
				}
				break;
		}
	}
}

function onError(evt) {
	console.log(JSON.stringify(evt));
}

function registerSocketService() {
	alert('______opid');
	var param = {
		message_type: 0,  //0注册，1刷新， 2发信息
		identifier: '_____opid',
		token: '',
		paramters: null
	}
	socket.send(JSON.stringify(param));
	console.log("registering socket service");
}