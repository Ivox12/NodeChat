const sql = require('./.env');

// CALCULO
function hashCode(s) {
    return s.split("").reduce(function(a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
}

//VAZIO
function empty(value){
    if (value == null || value == undefined){
        return true;
    }

    if (typeof value === 'string' || Array.isArray(value)) {
        return value.length === 0;
    }
    
    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }

    return false;
}
  
function pegarDataAtual(){
    var dataAtual = new Date();
    var dia = (dataAtual.getDate()<10 ? '0' : '') + dataAtual.getDate();
    var mes = ((dataAtual.getMonth() + 1)<10 ? '0' : '') + (dataAtual.getMonth() + 1);
    var ano = dataAtual.getFullYear();
    var hora = (dataAtual.getHours()<10 ? '0' : '') + dataAtual.getHours();
    var minuto = (dataAtual.getMinutes()<10 ? '0' : '') + dataAtual.getMinutes();
    var segundo = (dataAtual.getSeconds()<10 ? '0' : '') + dataAtual.getSeconds();

    var dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
    return dataFormatada;
}

// SQL COMMANDS //

async function execute(query){
    return new Promise((resolve, reject) => {
        sql.connect(function (err){
            if(err) reject(err);
            sql.query(query, function (err,rows){
                if(err) reject(err);
                    resolve(rows) 
            })
        });
    })
}

async function auth(name,pass){
    consult = await execute(`SELECT name, password FROM nodetest.users WHERE name='${name}' and password='${pass}'`)    
    return consult;
}


async function newUser(info){
    let tempName = await execute(`SELECT name FROM nodetest.users WHERE name='${info.name}'`)
    let tempNick = await execute(`SELECT nick FROM nodetest.users WHERE nick='${info.nick}'`)
    if (!empty(tempName)){
        return '3';
    }
    if (!empty(tempNick)) {
        return '4';
    } else {
        let crpPass = hashCode(info.password);
        await execute(`INSERT INTO nodetest.users (name, nick, password) VALUES ('${info.name}', '${info.nick}', '${crpPass}')`);
        return '1';
    }
}

async function getNick(info){
    let crpPass = hashCode(info.password);
    nick = await execute(`SELECT nick FROM nodetest.users WHERE name='${info.userName}' and password='${crpPass}';`);
    nick = nick[0].nick;
    return nick; 
}

module.exports = { hashCode, newUser, pegarDataAtual, empty, getNick, auth };