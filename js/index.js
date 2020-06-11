var webstore = openDatabase('ehealth', '1.0', 'demo', 2*1024*1024);
var locstore = window.localStorage ;

function register() {
    var name = document.getElementById("name").value;
    var age  = document.getElementById("age").value;
    var phno = document.getElementById("phno").value ;
    var mail = document.getElementById("mail").value;
    var pwrd = document.getElementById("pwrd").value;

    webstore.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (name VARCHAR(50), age INT, phone INT, email VARCHAR(100), password VARCHAR(50), PRIMARY KEY (email))');
        tx.executeSql('INSERT INTO USERS VALUES (?,?,?,?,?)', [name, age, phno, mail, pwrd]);
    });

    alert(mail, pwrd);

    window.location.href = "index.html";
}

function userLogin() {
    var mail = document.getElementById("patient_mail").value;
    var pwrd = document.getElementById("patient_pwrd").value;

    webstore.transaction(function(tx) {
        tx.executeSql('SELECT * FROM USERS WHERE email = ? AND password = ?', [mail, pwrd], function(tx, results) {
            var len = results.rows.length;

            if (len == 1) {
                locstore.setItem("mail", mail);

                var name = results.rows.item(0).name;
                locstore.setItem("name", name);

                window.location.href = "home.html";
            }
            else {
                alert('error');

                var msg = "error";
                // make use of this later
            }
        }, null);
    });
}

function doctorLogin() {
    var mail = document.getElementById("doctor_mail").value;
    var pwrd = document.getElementById("doctor_pwrd").value;

    webstore.transaction(function(tx) {
        tx.executeSql('SELECT * FROM DOCTORS WHERE email = ? AND password = ?', [mail, pwrd], function(tx, results) {
            var len = results.rows.length;

            if (len == 1) {
                locstore.setItem("mail", mail);

                var name = results.rows.item(0).name;
                locstore.setItem("name", name);

                window.location.href = "home.html";
            }
            else {
                alert('error');

                var msg = "error";
                // make use of this later
            }
        }, null);
    });
}


function forgot_pwd() {
    var mail = document.getElementById("mail").value;
    var npwd = document.getElementById("npwd").value;

    webstore.transaction( function(tx) {
        tx.executeSql('UPDATE USERS SET password = ? WHERE email = ?', [npwd ,mail]);
    });

    window.location.href = "index.html";
}


function logout() {
    locstore.removeItem("name");
    locstore.removeItem("mail");

    window.location.href = 'index.html';
}

// navbars 
function openNav() {
    document.getElementById('sidenav').style.width = "80%";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    document.getElementById("header").style.backgroundColor = "rgba(0,128,0,0.4)"
}

function closeNav() {
    document.getElementById('sidenav').style.width = "0";
    document.body.style.backgroundColor = "#f0f0f0";
    document.getElementById("header").style.backgroundColor = "green"

}

// toggle login pages 

function showDoctorLogin() {
    document.getElementById("patient").style.right = "100%";
    document.getElementById("doctor").style.right  = "0";
}

function showPatientLogin() {
    document.getElementById("doctor").style.right  = "100%";
    document.getElementById("patient").style.right = "0";
}
