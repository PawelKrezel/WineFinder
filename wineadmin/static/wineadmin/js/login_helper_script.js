// this script is used to apply styles to the login page

let usrName = document.getElementById("id_username");
let pswdField = document.getElementById("id_password");

usrName.setAttribute("class", "commonStyle commonStyleAsBlock");
usrName.setAttribute("placeholder", "username 👤");

pswdField.setAttribute("placeholder", "password 🔑");
pswdField.setAttribute("class", "commonStyle commonStyleAsBlock");