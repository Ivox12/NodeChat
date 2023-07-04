const express = require('express');
const http = require('http');
let fs = require('fs');
let socketio = require('socket.io');
const sql = require('./.env');
const {hashCode, newUser, pegarDataAtual, empty, getNick, auth } = require('./functions');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

sql.query("SELECT * FROM users", function(err, rows){
    if(!err) {
        console.log("resultados:", rows);
    }
    else {
        console.log("falha na consulta");
    }
})

const port = 3000;
server.listen(port, () => {
  console.log(`Aplicação está em execução na porta ${port}`);
});

app.use(function(req, res) {
    res.status(404).send('Página ou arquivo não encontrados');
});
let tempChat = []
let userArr = []
io.on("connection", function(socket){
    socket.on("users", async function(user){
        try{
            user.nick =await getNick(user);
            userInfo ={name: user.nick, id: socket.id}
            userArr.push(userInfo);
            io.sockets.emit("atualizar users", userArr);
            hi = "[ " + pegarDataAtual() + " ] " + userInfo.name + " Entrou no Chat."; 
            socket.emit("restore chat", tempChat);
            tempChat.push(hi);
            io.sockets.emit("atualizar mensagens", hi);
        }
        catch(err) {
            console.log(err);
        }
    });

    socket.on("auth",async function (str){
        try {
            let crpPass = hashCode(str.password)
            ok = await auth(str.userName, crpPass);
            if(!empty(ok)){
                socket.emit("rauth", true);
            } else {
                socket.emit("rauth", false);
            }
        }
        catch(err) {
            console.log(err);
        }

    })

    socket.on("register",async function (user){
        if (empty(user.userName) || empty(user.nick) || empty(user.password)){
            socket.emit("registered", '2');
        } else {
            let userInfo ={name: user.userName, nick:user.nick, password:user.password, id: socket.id}
            let id = await newUser(userInfo)
            socket.emit("registered", id);
        }
    })

    socket.on("disconnect", function(){
        userArr = userArr.filter(function(info){
            if(info.id == socket.id){
                mensagem = "[ " + pegarDataAtual() + " ] " + info.name + " Saiu do Chat."; 
                tempChat.push(mensagem);
                io.sockets.emit("atualizar mensagens", mensagem)
            }
            return info.id !== socket.id
        })
        io.sockets.emit("atualizar users", userArr);
    })

    socket.on("enviar mensagem", function(mensagem_enviada){
        userArr = userArr.map(function(info){
            if(info.id === socket.id){
                mensagem_enviada ="[ " + pegarDataAtual() + " ] "+ info.name + ": " + mensagem_enviada.payload;
                tempChat.push(mensagem_enviada);
                io.sockets.emit("atualizar mensagens", mensagem_enviada);
            }
            return info;
        })
    }); 
});

