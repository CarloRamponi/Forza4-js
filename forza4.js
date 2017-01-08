var player1, player2, turn=0, win=0;
var mat = new Array(6);
for(var i=0; i<6; i++)
    mat[i]=new Array(7);

for(var i=0; i<6; i++)
    for(var j=0; j<7; j++)
        mat[i][j]=0;

function init(){
    player1 = document.getElementById("player1").value;
    player2 = document.getElementById("player2").value;
    if(player1=="" || player2 ==""){
        var string = "<div class='alert alert-dismissible alert-danger'>\
                        <button type='button' class='close' data-dismiss='alert' onclick='location.reload()'>&times;</button>\
                        I <strong>campi</strong> non possono essere <strong>vuoti</strong>!!!</a>\
                    </div>";
        document.getElementById("error").outerHTML=string;
        document.getElementById("button").outerHTML="";
        document.getElementById("player1").outerHTML="";
        document.getElementById("player2").outerHTML="";
    } else {
        document.getElementById("button").outerHTML="";
        document.getElementById("player1").outerHTML="<a href='' style='float:right;' class='btn btn-danger' onclick='location.reload()' id='button'>Riavvia</a>\
                                                        <span style='margin-bottom:10px;'>Giocatore 1:  <span class='text-warning'>"+ player1 +"</span></span><br>\
                                                        <span style='margin-bottom:10px;'>Giocatore 2:  <span class='text-danger'>"+ player2 +"</span></span><br><hr>";
        document.getElementById("player2").outerHTML="";
        draw();
    }
}

function draw(){
    if(turn==0){
        var string = "";
        for(var i=0; i<7; i++)
            string += "<button class='btn btn-default' style='width:50px; height:50px; font-size:25px;' onclick='buttonPressed(" + i + ")'>↓</button>";
        string+="<br>";
        document.getElementById("buttons").outerHTML=string;
        turn=(Math.trunc(Math.random()*100)%2)+1; //numero casuale (1 o 2)
        document.getElementById("turnString").outerHTML="<span id='turnString'>Turno di <b id='turn'></b></span><br><br>";
    }
    if(!win){
        if(turn==1) document.getElementById("turn").outerHTML="<b id='turn' class='text-warning'>" + player1 + "</b>";
        if(turn==2) document.getElementById("turn").outerHTML="<b id='turn' class='text-danger'>" + player2 + "</b>";
    }
    else {
        document.getElementById("turn").outerHTML="";
        document.getElementById("turnString").outerHTML="";
    }

    var string="";

    string +="<span id='table'>";
    for(var i=0; i<6; i++){
        for(var j=0 ; j<7 ; j++){
            switch(mat[i][j]){
                case 0:
                    string+="<img src='img/vuoto.png'>";
                    break;
                case 1:
                    string+="<img src='img/giallo.png'>";
                    break;
                case 2:
                    string+="<img src='img/rosso.png'>";
                    break;
            }
        }
        string+="<br>";
    }
    string+="</span>";
    document.getElementById("table").outerHTML=string;

}

function buttonPressed(n){
    if(!win){
        //controllo la casella vuota più bassa
        for(var i=5; i>=0; i--){
            if(mat[i][n]==0)
                break;
        }

        //inserisco nella matrice il giocatore di turno (se i<0 significa che la colonna è piena)
        if(i<0){
            colonnaPienaMsg();
        } else {
            mat[i][n]=turn;
            dimissColonnaPienaMsg();
            controllaVincita();

            if(!win){
                if(turn==1)
                    turn=2;
                else
                    turn=1;
                draw();
            } else {
                draw();
                printWinnerMsg();
            }
        }
    }
}

function controllaVincita(){
    var i,j,v;
	for(v=1;v<=2;v++)
	{
		for(i=0;i<7;i++)
		{
			for(j=0;j<3;j++)
			{
				if(mat[j][i]==v && mat[j+1][i]==v && mat[j+2][i]==v && mat[j+3][i]==v)
					win=v;
			}
			for(j=0;j<4;j++)
			{
				if(i>=6)
					continue;
				if(mat[i][j]==v && mat[i][j+1]==v && mat[i][j+2]==v && mat[i][j+3]==v)
					win=v;
			}
			for(j=0;j<4;j++)
			{
				if(i>=6||i<3)
					continue;
				if(mat[i][j]==v && mat[i-1][j+1]==v && mat[i-2][j+2]==v && mat[i-3][j+3]==v)
					win=v;
			}
			for(j=0;j<4;j++)
			{
				if(i>=3)
					continue;
				if(mat[i][j]==v && mat[i+1][j+1]==v && mat[i+2][j+2]==v && mat[i+3][j+3]==v)
					win=v;
			}
		}
	}
}

function printWinnerMsg(){
    var string = "<div class='alert alert-dismissible alert-success'>\
                    <button type='button' class='close' data-dismiss='alert' onclick='location.reload()'>&times;</button>\
                    Ha vinto <strong>";
    if(win==1) string+=player1;
    if(win==2) string+=player2;
    string +=   "</strong>: Complimenti!</a></div>";
    document.getElementById("error").outerHTML=string;
}

function colonnaPienaMsg(){
    document.getElementById("error").outerHTML="\
    <div id='error' class='alert alert-dismissible alert-warning'>\
        <button type='button' class='close' data-dismiss='alert' onclick='dimissColonnaPienaMsg()'>&times;</button>\
        <h4>Attenzione!</h4>\
        <p>Colonna piena!</p>\
    </div>";
}

function dimissColonnaPienaMsg(){
    document.getElementById('error').outerHTML='<span id=\'error\'></span>';
}
