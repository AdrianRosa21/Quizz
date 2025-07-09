$(document).ready(function () {
  let preguntas = [];
  let indice = 0;
  let puntaje = 0;

  function mostrarPregunta() {
    if (indice < preguntas.length) {
      const q = preguntas[indice];
      let opcionesHTML = "";
      for (let i = 0; i < q.opciones.length; i++) {
        opcionesHTML += `
          <div class="flex items-center mb-2">
            <input class='mr-2 accent-blue-500' type="radio" name="opcion" value="${q.opciones[i]}" id="${q.opciones[i]}">
            <label for="${q.opciones[i]}" class='text-gray-700'>${q.opciones[i]}</label>
          </div>`;
      }
      $("#quiz-container").html(`
        <h2 class='text-xl font-semibold mb-4 text-gray-800'>${q.pregunta}</h2>
        ${opcionesHTML}
        <button id="enviar" class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full">✅ Submit</button>
      `);
    } else {
      finalizarQuiz();
    }
  }

  function finalizarQuiz() {
    $("#score").text("Score: " + puntaje + "/" + preguntas.length);
    $("#quiz-container").html("<h4 class='text-lg text-green-700 font-bold'>Quiz finished!</h4>");
    $("#restart").removeClass("hidden");
    
    // Mostrar modal de guardado
    $("#finalScore").text(puntaje);
    $("#totalQuestions").text(preguntas.length);
    $("#saveModal").removeClass("hidden");
  }

  function mostrarFeedback(elegida, correcta) {
    const clase = elegida === correcta ? "text-green-600" : "text-red-600";
    const retro = `
      <div class="feedback ${clase}">
        <p><strong>Your answer:</strong> ${elegida} ${elegida === correcta ? "✅" : "❌"}</p>
        <p><strong>Correct:</strong> ${correcta} ✅</p>
      </div>`;
    $("#feedback").append(retro);
  }

  $(document).on("click", "#enviar", function () {
    const seleccion = $("input[name='opcion']:checked").val();
    if (!seleccion) return;
    const correcta = preguntas[indice].respuesta;
    if (seleccion === correcta) puntaje++;
    mostrarFeedback(seleccion, correcta);
    indice++;
    mostrarPregunta();
  });

  $("#restart").click(function () {
    indice = 0;
    puntaje = 0;
    $("#feedback").empty();
    $(this).addClass("hidden");
    mostrarPregunta();
  });

  // Eventos del modal
  $("#btnSave").click(function() {
    alert("Score saved! (Aquí implementarías la lógica de guardado)");
    $("#saveModal").addClass("hidden");
  });

  $("#btnCancel").click(function() {
    $("#saveModal").addClass("hidden");
  });

  $.getJSON("preguntas.json", function (data) {
    preguntas = data;
    mostrarPregunta();
  });


  // Función para guardar en JSON
function saveScore(name, message, category, score) {
  const scoreData = {
    name,
    message,
    category,
    score,
    date: new Date().toISOString().split('T')[0]
  };

  fetch('guardar_score.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(scoreData)
  })
  .then(response => response.json())
  .then(data => {
    alert("✅ Puntaje guardado exitosamente!");
    $("#saveModal").addClass("hidden");
  })
  .catch(error => {
    alert("❌ Error al guardar el puntaje.");
    console.error(error);
  });
}

// Evento del formulario
$("#scoreForm").submit(function(e) {
  e.preventDefault();
  const name = $("#playerName").val();
  const message = $("#playerMessage").val();
  const category = $("input[name='category']:checked").val();
  saveScore(name, message, category, puntaje);
});

// Mostrar modal al finalizar
function finalizarQuiz() {
  $("#score").text("Score: " + puntaje + "/" + preguntas.length);
  $("#quiz-container").html("<h4 class='text-lg text-green-700 font-bold'>Quiz finished!</h4>");
  $("#restart, #viewScores").removeClass("hidden");
  $("#finalScoreDisplay").text(puntaje + "/" + preguntas.length);
  $("#saveModal").removeClass("hidden");
}

// Botón para ver puntuaciones
$("#viewScores").click(function() {
  window.location.href = "scores.html";
});
});