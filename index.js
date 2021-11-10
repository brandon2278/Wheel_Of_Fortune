// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var home = document.getElementById("home");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal

home.onload = function () {
  modal.style.display = "block";
}

var translater = document.getElementById("translater");

// Get the button that opens the modal
var btn = document.getElementById("translate");
var answer = document.getElementById("subm");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  translater.style.display = "block";
}
answer.onclick = function () {
  translater.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  translater.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    translater.style.display = "none";
  }
}


