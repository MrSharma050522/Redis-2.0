const net = require("net");
const Parser = require("redis-parser");

const store = {};

const server = net.createServer((connection) => {
	console.log("Client connected . . . ");

	connection.on("data", (data) => {
        const parser = new Parser({
            returnReply: (reply) => {
                const command = reply[0];
                switch (command){
                    case 'set' : {
                        const key = reply[1];
                        const value = reply[2];
                        store[key] = value;
                        connection.write("+OK\r\n");
                    }
                    break;

                    case 'get':{
                        const key = reply[1];
                        const value = store[key];
                        if(!value){
                            connection.write("$-1\r\n");
                        }else {
                            connection.write(`$${value.length}\r\n${value}\r\n`);
                        }
                    }
                }
                console.log("Reply -> ", reply);
                console.log("Store -> ", store);
            }, 
            returnError: (error) => {
                console.log("Error -> ", error);
            }
        })

		// console.log(data.toString());
        parser.execute(data);

		// connection.write("+OK\r\n");
	});
});

server.listen(8080, () => {
	console.log("Custom Redis server running on port 8000");
});
