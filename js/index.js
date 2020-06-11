var webstore = openDatabase('ehealth', '1.0', 'demo', 5*1024*1024);
var locstore = window.localStorage ;

function patientRegister() {
    var name = document.getElementById("name").value;
    var age  = document.getElementById("age").value;
    var phno = document.getElementById("phno").value ;
    var mail = document.getElementById("mail").value;
    var pwrd = document.getElementById("pwrd").value;

    webstore.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS PATIENTS (name VARCHAR(50), age INT, phone INT, email VARCHAR(100), password VARCHAR(50), PRIMARY KEY (email))');
        tx.executeSql('INSERT INTO PATIENTS VALUES (?,?,?,?,?)', [name, age, phno, mail, pwrd]);
    });

    alert(mail, pwrd);

    window.location.href = "index.html";
}

function doctorRegister() {
    var name = document.getElementById("name").value;
    var age  = document.getElementById("age").value;
    var phno = document.getElementById("phno").value;
    var mail = document.getElementById("mail").value;
    var regid = document.getElementById("regid").value;
    var pwrd = document.getElementById("pwrd").value;

    webstore.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS DOCTORS (name VARCHAR(50), age INT, phone INT, email VARCHAR(100), registration_id VARCHAR(50), password VARCHAR(50), PRIMARY KEY (email))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS APPOINTMENT (email VARCHAR(50), sun INT, mon INT, tue INT, wed INT, thu INT, fri INT, sat INT, PRIMARY KEY (email))');

        tx.executeSql('INSERT INTO DOCTORS VALUES (?,?,?,?,?,?)', [name, age, phno, mail, regid, pwrd]);
        tx.executeSql('INSERT INTO APPOINTMENT VALUES (?,?,?,?,?,?,?,?)', [mail, '0', '0', '0', '0', '0', '0', '0']);
    });

    alert(mail, pwrd);

    window.location.href = "index.html";
}

function patientLogin() {
    var mail = document.getElementById("patient_mail").value;
    var pwrd = document.getElementById("patient_pwrd").value;

    webstore.transaction(function(tx) {
        tx.executeSql('SELECT * FROM PATIENTS WHERE email = ? AND password = ?', [mail, pwrd], function(tx, results) {
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


function patientForgotPwd() {
    var mail = document.getElementById("mail").value;
    var npwd = document.getElementById("npwd").value;

    webstore.transaction( function(tx) {
        tx.executeSql('UPDATE PATIENTS SET password = ? WHERE email = ?', [npwd ,mail]);
    });

    window.location.href = "index.html";
}

function doctorForgotPwd() {
    var mail = document.getElementById("mail").value;
    var npwd = document.getElementById("npwd").value;

    webstore.transaction( function(tx) {
        tx.executeSql('UPDATE DOCTORS SET password = ? WHERE email = ?', [npwd ,mail]);
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
