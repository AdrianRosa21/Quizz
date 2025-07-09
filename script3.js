

$(document).ready(function () {
// Modal de Rodrigo Rosa
$("#showModal").click(function () {
  $("#modalAutor").removeClass("hidden").addClass("flex");
});

$("#cerrarModal").click(function () {
  $("#modalAutor").addClass("hidden").removeClass("flex");
});
 // Ver puntuaciones
  $("#viewScores").click(function () {
    window.location.href = "scores.html";
  });

});