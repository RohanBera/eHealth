var webstore = openDatabase('ehealth', '1.0', 'demo', 5*1024*1024);
var locstore = window.localStorage ;
webstore.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS PATIENTS (name VARCHAR(50), age INT, phone INT, email VARCHAR(100), password VARCHAR(50), PRIMARY KEY (email))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS DOCTORS (name VARCHAR(50), age INT, phone INT, email VARCHAR(100), registration_id VARCHAR(50), password VARCHAR(50), PRIMARY KEY (email))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS APPOINTMENTS (patient VARCHAR(50), doctor VARCHAR(50), date VARCHAR(6), day VARCHAR(3), symptoms VARCHAR(100))');
});


// webstore.transaction(function(tx) {
//     tx.executeSql('DROP TABLE APPOINTMENTS ');
// });

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
        tx.executeSql('INSERT INTO DOCTORS VALUES (?,?,?,?,?,?)', [name, age, phno, mail, regid, pwrd]);
    });

    alert(mail);

    window.location.href = "index.html";
}

function patientLogin() {
    var mail = document.getElementById("patient_mail").value;
    var pwrd = document.getElementById("patient_pwrd").value;

    webstore.transaction(function(tx) {
        tx.executeSql('SELECT * FROM PATIENTS WHERE email = ? AND password = ?', [mail, pwrd], function(tx, results) {
            var len = results.rows.length;

            if (len == 1) {
                locstore.setItem("user", "patient")
                locstore.setItem("mail", mail);

                var name = results.rows.item(0).name;
                locstore.setItem("name", name);

                window.location.href = "patient_home.html";
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
                locstore.setItem("user", "doctor");
                locstore.setItem("mail", mail);

                var name = results.rows.item(0).name;
                locstore.setItem("name", name);

                window.location.href = "doctor_home.html";
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
    locstore.clear();

    window.location.href = 'index.html';
}

// navbars 
function openNav() {
    document.getElementById('sidenav').style.width = "80%";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    document.getElementById("header").style.backgroundColor = "rgba(0,128,0,0.4)"
    document.getElementById("profile_header").style.backgroundColor = "rgba(0,128,0,0.4)"
}

function closeNav() {
    document.getElementById('sidenav').style.width = "0";
    document.body.style.backgroundColor = "#f0f0f0";
    document.getElementById("header").style.backgroundColor = "green"
    document.getElementById("profile_header").style.backgroundColor = "green"

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

// patient home page

function getDoctors() {
    webstore.transaction(function(tx) {
        tx.executeSql('SELECT * FROM DOCTORS', [], function(tx, results) {
            var len = results.rows.length;
            var i;

            if (len == 0) {
                var container = '<h1>No doctors available!</h1>';
                document.getElementById('doc_container').innerHTML += container;
            }
            else {
                for (i = 0; i < len; i++) {
                    var name = results.rows.item(i).name;
                    var mail = results.rows.item(i).email;
                    var func = "displayDocProfile('" +mail+ "')";

                    name = toTitleCase(name);

                    var container = '';
                    container += '<div class="doc" onclick="' +func+ '">';
                    container += '<div class="img">';
                    container += '</div>';
                    container += '<div class="name">';
                    container += 'Dr. ' + name;
                    container += '</div>';
                    container += '<a href="#">Book an appointment</a>';
                    container += '</div>';

                    document.getElementById('doc_container').innerHTML += container;
                }
            }
        });
    });
}

// first letter of each word made capital
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
} 

// doctor profile

function displayDocProfile(mail) {
    locstore.setItem("docmail", mail);
    document.location.href = 'patient_docprofile.html';
}

var arrDates = new Array(7);
var arrDays  = new Array(7);

function getDoctorDetails() {
    var mail = locstore.getItem("docmail");
    // locstore.removeItem("docmail");

    webstore.transaction(function(tx) {
        tx.executeSql('SELECT * FROM DOCTORS WHERE email = ?', [mail], function(tx, results) {
            var name = results.rows.item(0).name;
            document.getElementById("profile_name").innerHTML = "Dr. " +name; 
        });
    });

    var startDate = new Date();
    GetDates(startDate, 7);

    var dates_container = '';

    for (var i = 0; i < 6; i++) {
        dates_container += '<input type="button" onclick="bookAppointment(this)" class="dates" name="' +arrDays[i]+ '" id="' +arrDates[i]+ '" value="' +arrDates[i]+ '">';
    }
    dates_container += '<input type="button" onclick="bookAppointment(this)" class="dates last" name="' +arrDays[6]+ '" id="' +arrDates[6]+ '" value="' +arrDates[6]+ '"></input>';
    document.getElementById('dates_container').innerHTML = dates_container;

    arrDates.forEach (function(date) {
        webstore.transaction(function(tx) {
            tx.executeSql('SELECT * FROM APPOINTMENTS WHERE doctor = ? AND date = ?', [mail, date], function(tx, results) {
                var len = results.rows.length;

                if (len == 1) {
                    document.getElementById(date).classList.add('booked');
                }
            });
        });
    });
}

// booking appointment 

function bookAppointment(dates_container) {
    if (dates_container.classList.contains('booked')) {
        alert('doctor already has an appointment');
    }
    else {
        var doc  = locstore.getItem('docmail');
        var ptnt = locstore.getItem('mail');
        var date = dates_container.id;
        var day  = dates_container.name;
        var smpt = document.getElementById('symptoms').value;
    

        webstore.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS APPOINTMENTS (patient VARCHAR(50), doctor VARCHAR(50), date VARCHAR(6), day VARCHAR(3), symptoms VARCHAR(100))');
            tx.executeSql('INSERT INTO APPOINTMENTS VALUES (?,?,?,?,?)', [ptnt, doc, date, day, smpt]);
        });

        alert("appointment booked!");

        locstore.removeItem("docmail");
        window.location.href = "patient_home.html";
    }
}


// date stuff

function GetDates(startDate, daysToAdd) {
    for (var i = 0; i < daysToAdd; i++) {
        var currentDate = new Date();
        currentDate.setDate(startDate.getDate() + i);
        arrDates[i] = currentDate.getDate() + '/' + currentDate.getMonth();
        arrDays[i]  = DayAsString(currentDate.getDay());
    }
}

function DayAsString(dayIndex) {
    var weekdays = new Array(7);
    weekdays[0] = "Sun";
    weekdays[1] = "Mon";
    weekdays[2] = "Tue";
    weekdays[3] = "Wed";
    weekdays[4] = "Thu";
    weekdays[5] = "Fri";
    weekdays[6] = "Sat";

    return weekdays[dayIndex];
}

// profile 
// both users (doctors and patients )

function displayUserProfile() {
    var mail = locstore.getItem("mail");
    var user = locstore.getItem("user");

    if (user == "patient") {
        webstore.transaction(function(tx) {
            tx.executeSql('SELECT APP.*, DOC.name FROM APPOINTMENTS AS APP, DOCTORS AS DOC WHERE APP.doctor = DOC.email AND APP.patient = ?', [mail], function(tx, results) {
                var len = results.rows.length;
                var appointment = '';

                if (len == 0 ) {
                    appointment += '<h1>No Appointments!</h1>'
                }
                else {
                    for (var i = 0; i < len; i++) {
                        var date = results.rows.item(i).date.split('/')[0];
                        var mont = results.rows.item(i).date.split('/')[1];
                        var d    = new Date();
                        var now  = new Date();
                        d.setDate(date);
                        d.setMonth(mont);
                        now.setHours(0,0,0,0);

                        if (d < now) {
                            appointment += '<div class="appointments old">';
                        }
                        else {
                            appointment += '<div class="appointments">';
                        }    

                        appointment += '<div class="date-day">';
                        appointment += '<div class="date">' +results.rows.item(i).date+ '</div>';
                        appointment += '<div class="day">' +results.rows.item(i).day+ '</div>';
                        appointment += '</div>';
                        appointment += '<div class="details">';
                        appointment += '<div class="main">Dr. '+results.rows.item(i).name+'</div>';
                        appointment += '<div class="sub">' +results.rows.item(i).symptoms+ '</div>';
                        appointment += '</div>';
                        appointment += '</div>';
                    }
                }
                document.getElementById('appointments_container').innerHTML = appointment;
            });
        });
    }
    else {
        webstore.transaction(function(tx) {
            tx.executeSql('SELECT APP.*, PAT.name FROM APPOINTMENTS AS APP, PATIENTS AS PAT WHERE APP.patient = PAT.email AND APP.doctor = ?', [mail], function(tx, results) {
                var len = results.rows.length;
                var appointment = '';

                if (len == 0 ) {
                    appointment += '<h1>No Appointments!</h1>'
                }
                else {
                    for (var i = 0; i < len; i++) {
                        var date = results.rows.item(i).date.split('/')[0];
                        var mont = results.rows.item(i).date.split('/')[1];
                        var d    = new Date();
                        var now  = new Date();
                        d.setDate(date);
                        d.setMonth(mont);
                        now.setHours(0,0,0,0);

                        if (d < now) {
                            appointment += '<div class="appointments old">';
                        }
                        else {
                            appointment += '<div class="appointments">';
                        }            

                        appointment += '<div class="date-day">';
                        appointment += '<div class="date">' +results.rows.item(i).date+ '</div>';
                        appointment += '<div class="day">' +results.rows.item(i).day+ '</div>';
                        appointment += '</div>';
                        appointment += '<div class="details">';
                        appointment += '<div class="main">'+results.rows.item(i).name+'</div>';
                        appointment += '<div class="sub">' +results.rows.item(i).symptoms+ '</div>';
                        appointment += '</div>';
                        appointment += '</div>';
                    }
                }
                document.getElementById('appointments_container').innerHTML = appointment;
            });
        });
    }
}