var socket = io.connect();

console.log("conectado")

$("#login").click(function(){
    userName = $("#userName").val();
    password = $("#password").val();
    info = {"userName": userName, "password": password};
    socket.emit("auth", info); 
})

socket.on("rauth", function(e){
    if(e)
    {
        $("#chatBD").fadeIn("fast");
        $("#init").fadeOut("fast");
        userName = $("#userName").val();
        password = $("#password").val();
        info = {"userName": userName, "password": password};
        socket.emit("users", info);
    }
    else 
    {
        $("#warning").fadeIn("fast");
        setTimeout(() => {
            $("#warning").fadeOut("fast");
        }, 3000);
    }
})

$("#register").click(function(){
    newName = $("#newName").val();
    newPass = $("#newPassword").val();
    nick = $("#nickName").val();
    info = {"userName": newName, "password": newPass, "nick": nick};
    socket.emit("register", info);
})

socket.on("registered", function(e){
    switch (e){
        case '1': 
            $("#success").fadeIn("fast");
            setTimeout(() => {
                $("#success").fadeOut("fast");
            }, 3000);
            break;
        case '2':
            $("#fail").fadeIn("fast");
            setTimeout(() => {
                $("#fail").fadeOut("fast");
            }, 3000);
            break;
        case '3':
            $("#user-fail").fadeIn("fast");
            setTimeout(() => {
                $("#user-fail").fadeOut("fast");
            }, 3000);
            break;
        case '4':
            $("#nick-fail").fadeIn("fast");
            setTimeout(() => {
                $("#nick-fail").fadeOut("fast");
            }, 3000);
            break;
    }
})

$("form#chat").submit(function(e){
    e.preventDefault();
    if ($("#texto_mensagem").val() != ''){
        socket.emit("enviar mensagem", {payload: $(this).find("#texto_mensagem").val()});
        $("form#chat #texto_mensagem").val("");
    }
});

socket.on("atualizar users", function(users){
    $(".users").empty();
    users.forEach(function(users) {
        $(".users").append("<p>" + users.name + "</p>");
    });
});
socket.on("atualizar mensagens", function(mensagem){
    var mensagem_formatada = $("<p />").text(mensagem);
    $("#historico_mensagens").append(mensagem_formatada);
});

socket.on("restore chat", function(hist){
    hist.forEach(function(message){
        var mensagem_formatada = $("<p />").text(message);
        $("#historico_mensagens").append(mensagem_formatada);
    });
});
