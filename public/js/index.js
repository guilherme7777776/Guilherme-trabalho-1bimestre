
class usuario{
    constructor(nome, senha, tipo){
        this.nome = nome
        this.senha = senha
        this.tipo = tipo
    }
}

let listausuarios= [
    new usuario("berola","sla1","admin"),
    new usuario("WonderOfU","sla2","cliente"),
    new usuario("abobrinha","sla3","cliente"),
];

console.log(listausuarios);

function logar(){
    const name = document.getElementById("idnome").value;
    const password = document.getElementById("idsenha").value;
    let l = listausuarios
    for(let i = 0; i<l.length; i++){
        if(password === l[i].senha && name === l[i].nome){
            alert("parabens");
            window.location.href='p1.html'
        }
    }
    alert("login incorreto");
}