// Opslaan van de noten

let notesData = [];         // Array waarin de noten worden opgeslagen
let selectedIndex = null;   // Houdt bij welke noot geselecteerd is

const beatsPerMeasure = 4;  // Maatsoort, 4/4
const beatValue = 4;        // 4 kwartnoten passen in één maat


document.addEventListener("DOMContentLoaded", function () {  // Voert JavaScript uit als de hele HTML pagina geladen is

// Run knop
  document.getElementById("runMelodie").addEventListener("click", function() {
// De tekst wordt even groen om visueel te laten zien dat hij gereset is
      this.style.color = "#87fe2c"; 
      setTimeout(() => {
        this.style.color = "";
      }, 600);

  alert("Uw melodie wordt verzonden!");

// zelf gecomponeerde melodie verzenden:

  if (notesData.length === 0) {
    console.log("Geen noten om te versturen");
    return;
  }

  fetch("http://192.168.2.12:8080/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "melodie",
      notes: notesData
    })
  })
  .then(response => response.text())
  .then(data => console.log("Server zegt:", data))
  .catch(error => console.error("Fout:", error));

});

  // Reset knop
  document.getElementById("resetNotenbalk").addEventListener("click", function() {

    if (confirm("Weet je zeker dat je alle noten wilt verwijderen?")) {
  
      notesData = [];        // Leegt de array
      selectedIndex = null;  // Zorgt ervoor dat er geen noten meer geselecteerd zijn
      renderScore();         // Tekent een lege notenbalk

      // De tekst wordt even groen om visueel te laten zien dat hij gereset is
      this.style.color = "#87fe2c"; 

      setTimeout(() => {
        this.style.color = "";
      }, 600);

    }
  
  });

  renderScore();  // Tekent een lege notenbalk bij het opstarten

  document.querySelectorAll(".noteButton").forEach(button => {  // Zoekt de afbeeldingen met de class "noteButton"
    button.addEventListener("click", function () {              // Voegt klikfuctie toe aan die afbeeldingen

      const duration = this.dataset.duration;           // Leest de duur van de noot af uit de html
      const accidental = this.dataset.accidental || ""; // Leest af of de noot eventueel een mol of kruis heeft

      // Noot toevoegen aan de array
      notesData.push({
        key: "c/4",         // Standaard hoogte van de noot
        duration: duration,  // De duur van de noot of rust op de gekozen afbeelding
        accidental: accidental  // Of er eventueel een mol of kruis staat bij de noot
      });

      selectedIndex = notesData.length - 1; // Automatisch selecteren van de laatste noot

      renderScore();  // Tekent de notenbalk opnieuw met de nieuwe noot
    });
  });

  document.addEventListener("keydown", handleArrowKeys);  // Luistert naar de pijltjestoetsen
});


// Functie om alles te tekenen
function renderScore() {

  const VF = Vex.Flow;  // Verkort de naam van van VexFlow

  const div = document.getElementById("notation");  // Pakt het element waarin wordt getekend

  div.innerHTML = "";   // Maakt het tekengebied leeg

  // Maakt een SVG renderer
  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  renderer.resize(980, 200);             // Breedte en hoogte van het tekengebied
  const context = renderer.getContext();  // Ophalen van de tekencontext

  const staveWidth = 280; // Breedte van één maat
  const marginX = 70;     // Marge aan de linkerkant
  const marginY = -10;     // Marge aan de bovenkant

  let currentX = marginX; // Houdt bij waar de volgende maat horizontaal moet komen
  let currentY = marginY; // Houdt bij waar de volgende maat verticaal moet komen

  let i = 0;              // Teller voor de noten array
  let measureNumber = 0;  // Telt hoeveel maten er zijn

  // Toont een lege maat als er nog geen noten zijn in die maat
  if (notesData.length === 0) {
    const stave = new VF.Stave(currentX, currentY, staveWidth); // Maakt een lege maat
    stave.addClef("treble");  // Voegt de g-sleutel toe
    stave.setContext(context).draw(); // Tekent de maat
    return;  // Stopt de functie hier
  }


  // Als er nog noten zijn
  while (i < notesData.length) {

    const stave = new VF.Stave(currentX, currentY, staveWidth); // Maakt een nieuwe maat

    // Voeg alleen bij de eerste maat in een regel de g-sleutel toe
    if (currentX === marginX) { 
      stave.addClef("treble");
    }

    stave.setContext(context).draw(); // Tekent de maat

    let beatsUsed = 0;      // Houdt bij hoeveel tellen er gebruikt zijn
    let measureNotes = [];  // De noten van deze maat worden hier opgeslagen

    // Vult de maat totdat deze vol is
    while (i < notesData.length) {

      const noteData = notesData[i];  // De huidige noot uit de array

      // Verwijdert eventueel de 'r' van rusten zodat de duur bepaald kan worden
      const baseDuration = noteData.duration.replace(/r/g, "");

      // Waarde van de noot?
      const beats =
        baseDuration === "w" ? 4 :
        baseDuration === "h" ? 2 :
        1;

      if (beatsUsed + beats > beatsPerMeasure) break; // Als de maat vol is dan stoppen

      const parts = noteData.key.split("/");  // Splitst bijv. "c/4" in ["c", "4"]
      const pitch = parts[0];   // De toonletter
      const octave = parts[1];  // Het octaaf
      
      const keyWithAccidental = pitch + "/" + octave;   // Zorgt ervoor dat ["c", "4"] weer c/4 wordt, zodat VexFlow de noot herkent

      const staveNote = new VF.StaveNote({
        keys: [keyWithAccidental],  // De toonhoogte van de noot
        duration: noteData.duration // De duur van de noot
      });

      // Als er een voorteken is bij de noot, voeg die dan toe aan VexFlow
      if (noteData.accidental) {
        staveNote.addAccidental(
          0,
          new VF.Accidental(noteData.accidental)
       );
      }

      // Als dit de geselecteerde noot is, dan kleurt hij rood
      if (i === selectedIndex) {
        staveNote.setStyle({
          fillStyle: "red",
          strokeStyle: "red"
        });
      }

      measureNotes.push(staveNote); // Voegt de noot toe aan de maat

      beatsUsed += beats; // Telt de hoeveelheid beats
      i++;  // ga naar de volgende noot
    }


    // Maakt de voice
    const voice = new VF.Voice({
      num_beats: beatsPerMeasure, // De hoeveelheid tellen per maat
      beat_value: beatValue       // Welke nootwaarde 1 tel is
    });

    voice.setStrict(false); // Voorkomt tick errors bij een lege maat of een maat die nog niet vol is

    voice.addTickables(measureNotes); // Voegt noten toe aan de voice

    // Zorgt dat de noten netjes worden verdeeld over de maat
    new VF.Formatter()
      .joinVoices([voice])
      .format([voice], staveWidth - 20);

    voice.draw(context, stave); // Tekent de noten in de maat

    currentX += staveWidth; // Verschuift de volgende maat horizontaal
    measureNumber++;        // Verhoogt het maatnummer

    // Nieuwe regel na 3 maten
    if (measureNumber % 3 === 0) {
      currentX = marginX;
      currentY += 100;
    }

    // Stopt met het maken van nieuwe maten na 6 maten
    if (measureNumber % 6 === 0) {
      break
    }
  }

  makeNotesClickable(); // Maakt getekende noten klikbaar
}


// Noten klikbaar maken
function makeNotesClickable() {

  const div = document.getElementById("notation");  // Pakt het tekengebied

  const svgNotes = div.querySelectorAll("g.vf-note"); // Zoekt de noten in SVG

  svgNotes.forEach((el, index) => {

    el.style.cursor = "pointer";  // Verandert de cursor als je over een noot gaat

    el.addEventListener("click", function () {
      selectedIndex = index; // Zet de geklikte noot als geselecteerd
      renderScore();  // Tekent opnieuw de noot zodat hij rood wordt
    });
  });
}


// Werking van de pijltjestoetsen
function handleArrowKeys(e) {

  if (selectedIndex === null) return; // Stopt als er geen noot geselecteerd is

  const scale = ["c", "d", "e", "f", "g", "a", "b"];  // Toonladder

  let note = notesData[selectedIndex].key;  // De huidige noot
  let parts = note.split("/");  // Splitst "c/4" in ["c", "4"]

  let pitch = parts[0]; // De toon
  let octave = parseInt(parts[1]);  // Het octaaf

  let index = scale.indexOf(pitch); // Zoekt de positie in de toonladder
  
  if (octave !== 4) return; // Werkt alleen als de noten in octaaf 4 zitten

  if (e.key === "ArrowUp") {

    if (pitch === "b") return;  // Stopt bij B4

    index++;
  }

  if (e.key === "ArrowDown") {

    if (pitch === "c") return;  // Stopt bij C4

    index--;
  }

  // De nieuwe noot opslaan
  notesData[selectedIndex].key = 
    scale[index] + "/4";

  renderScore();  // Opnieuw tekenen met de nieuwe toonhoogte
}

//DATA VAN KNOPPEN VERZENDEN


//3 Liedjes verzenden:

//Zoek elementen met de class 'speelKnop' en luister of er op gekliktt wordt. Zo ja, voer deze functie uit voor elk van deze knoppen.
document.querySelectorAll(".liedKnop").forEach(knop => {
  knop.addEventListener("click", function() {
  
// de knop waarop is geklikt leest de waarde van data-lied. dit is dus lied1, lied2 of lied3
    const lied = this.dataset.lied;
    
// Verzend een verzoek naar het volgende IP adres om de volgende data te versturen in JSON vorm
  fetch("http://192.168.2.12:8080/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
//Stuur de volgende string. 
    body: JSON.stringify({
        lied: lied
      })
  })
//Wacht op en antwoord van de server. Als de serverd ata terug stuurt, wordt het geprint in de vorm van "Server zegt: (data)" Als er een fout is, print het ind e vorm "Fout: (data)"
  .then(response => response.text())
  .then(data => console.log("Server zegt:", data))
  .catch(error => console.error("Fout:", error));

});
});

