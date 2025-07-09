$(document).ready(function () {
  let preguntas = [];
  let indice = 0;
  let puntaje = 0;

  function mostrarPregunta() {
    if (indice < preguntas.length) {
      const q = preguntas[indice];
      const pregunta = q.pregunta || q.question;
      const opciones = q.opciones || q.options;
      const respuesta = q.respuesta || q.answer;

      const imgHTML = q.image
        ? `<img src="${q.image}" alt="question image" class="mb-4 w-full max-h-64 object-contain rounded-xl shadow-md">`
        : "";

      let opcionesHTML = "";
      for (let i = 0; i < opciones.length; i++) {
        opcionesHTML += `
          <div class="flex items-center mb-2">
            <input class='mr-2 accent-blue-500' type="radio" name="opcion" value="${opciones[i]}" id="${opciones[i]}">
            <label for="${opciones[i]}" class='text-gray-700'>${opciones[i]}</label>
          </div>`;
      }

      $("#quiz-container").html(`
        <h2 class='text-xl font-semibold mb-4 text-gray-800'>${pregunta}</h2>
        ${imgHTML}
        ${opcionesHTML}
        <button id="enviar" class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full">✅ Submit</button>
      `);
    } else {
      finalizarQuiz();
    }
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
    const q = preguntas[indice];
    const correcta = q.respuesta || q.answer;
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
    $("#viewScores").addClass("hidden");
    mostrarPregunta();
  });

  // Eventos del modal
  $("#btnCancel").click(function () {
    $("#saveModal").addClass("hidden");
  });

  // Función para guardar el puntaje
  function saveScore(name, message, category, score) {
    const scoreData = {
      name,
      message,
      category,
      score,
      date: new Date().toISOString().split("T")[0]
    };

    fetch("guardar_score.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(scoreData)
    })
      .then((res) => res.json())
      .then((data) => {
        alert("✅ Puntaje guardado exitosamente!");
        $("#saveModal").addClass("hidden");
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Error al guardar el puntaje.");
      });
  }

  // Evento del formulario
  $("#scoreForm").submit(function (e) {
    e.preventDefault();
    const name = $("#playerName").val();
    const message = $("#playerMessage").val();
    const category = $("input[name='category']:checked").val();
    saveScore(name, message, category, puntaje);
  });

  // Mostrar modal de guardado
  function finalizarQuiz() {
    $("#score").text("Score: " + puntaje + "/" + preguntas.length);
    $("#quiz-container").html("<h4 class='text-lg text-green-700 font-bold'>🎉 Quiz finished!</h4>");
    $("#restart, #viewScores").removeClass("hidden");
    $("#finalScoreDisplay").text(puntaje + "/" + preguntas.length);
    $("#saveModal").removeClass("hidden");
  }

  // Ver puntuaciones
  $("#viewScores").click(function () {
    window.location.href = "scores.html";
  });

  // Cargar preguntas
  $.getJSON("preguntasKids.json", function (data) {
    preguntas = data;
    mostrarPregunta();
  });
});
