var socket = io.connect();

$("#login").click(function(){
    userName = $("#userName").val();
    password = $("#password").val();
    info = {"userName": userName, "password": password};
    socket.emit("auth", info); 
});

$("#btn-reg").click(function(){
    $("#square-login").css("display","none");
    $("#square-register").fadeIn("fast");
});

$("#btn-log").click(function(){
    $("#square-register").css("display","none");
    $("#square-login").fadeIn("fast");
});

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
        $("#popups").html("<div id='warning' class='bg-warning mt-5 p-2 text-center rounded shadow text-white overflow-hidden' style='display:none; width: 250px; height: auto; font-size: 1.2rem;'><span>Login ou senha incorreto!!</span></div>")
        $("#warning").slideDown("fast");
        setTimeout(() => {
            $("#warning").slideUp("fast");
        }, 3000);
        
    }
});

$("#register").click(function(){
    newName = $("#newName").val();
    newPass = $("#newPassword").val();
    nick = $("#nickName").val();
    info = {"userName": newName, "password": newPass, "nick": nick};
    socket.emit("register", info);
});

socket.on("registered", function(e){
    switch (e){
        case '1': 
            $("#popups").html("<div id='success' class='bg-success mt-5 p-2 text-center rounded shadow text-white overflow-hidden' style='display:none; width: 250px; height: auto; font-size: 1.2rem;'><span>Criado com Sucesso!!</span></div>")
            $("#success").slideDown("fast");
            setTimeout(() => {
                $("#success").slideUp("fast");
            }, 3000);
            setTimeout(() => {
                $("#popups").html("");
            }, 4000);
            break;
        case '2':
            $("#popups").html("<div id='fail' class='bg-danger mt-5 p-2 text-center rounded shadow text-white overflow-hidden' style='display:none; width: 250px; height: auto; font-size: 1.2rem;'><span>Preencha todos os campos!!</span></div>")
            $("#fail").slideDown("fast");
            setTimeout(() => {
                $("#fail").slideUp("fast");
            }, 3000);
            setTimeout(() => {
                $("#popups").html("");
            }, 4000);
            break;
        case '3':
            $("#popups").html("<div id='user-fail' class='bg-danger mt-5 p-2 text-center rounded shadow text-white overflow-hidden' style='display:none; width: 250px; height: auto; font-size: 1.2rem;'><span>Usuario ja existente!!</span></div>")
            $("#user-fail").slideDown("fast");
            setTimeout(() => {
                $("#user-fail").slideUp("fast");
            }, 3000);
            setTimeout(() => {
                $("#popups").html("");
            }, 4000);
            break;
        case '4':
            $("#popups").html("<div id='nick-fail' class='bg-danger mt-5 p-2 text-center rounded shadow text-white overflow-hidden' style='display:none; width: 250px; height: auto; font-size: 1.2rem;'><span>Nick ja existente!!</span></div>")
            $("#nick-fail").slideDown("fast");
            setTimeout(() => {
                $("#nick-fail").slideUp("fast");
            }, 3000);
            setTimeout(() => {
                $("#popups").html("");
            }, 4000);
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
