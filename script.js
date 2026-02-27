// Opslaan van de noten

let notesData = [];         // Array waarin de noten worden opgeslagen
let selectedIndex = null;   // Houdt bij welke noot geselecteerd is

const beatsPerMeasure = 4;  // Maatsoort, 4/4
const beatValue = 4;        // 4 kwartnoten passen in één maat


document.addEventListener("DOMContentLoaded", function () {  // Voert JavaScript uit als de hele HTML pagina geladen is

  // Reset knop
  document.getElementById("test").addEventListener("click", function() {
  this.style.color = "#87fe2c";
  });

  renderScore();  // Tekent een lege notenbalk

  document.querySelectorAll(".noteButton").forEach(button => {  // Zoekt de afbeeldingen met de class "noteButton"
    button.addEventListener("click", function () {              // Voegt klikfuctie toe aan die afbeeldingen

      const duration = this.dataset.duration;           // Leest de duur van de noot af uit de html
      const accidental = this.dataset.accidental || ""; // Leest af of de noot eventueel een mol of kruis heeft

      // Noot toevoegen aan de array
      notesData.push({
        key: "c/4",         // Standaard hoogte van de noot
        duration: duration,  // De duur van de noot op de gekozen afbeelding
        accidental: accidental  // Of er eventueel een mol of kruis staat bij de noot
      });

      selectedIndex = notesData.length - 1; // Automatisch selecteren van de laatste noot

      renderScore();  // Tekent alles opnieuw
    });
  });

  document.addEventListener("keydown", handleArrowKeys);  // Luistert naar de pijltjestoetsen
});


// Functie om alles te tekenen
function renderScore() {

  const VF = Vex.Flow;  // Verkort de naam van van VexFlow

  const div = document.getElementById("notation");  // Pakt de div waarin wordt getekend

  div.innerHTML = "";   // Maakt de notenbalk leeg

  // Maakt een renderer
  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  renderer.resize(980, 200);             // Breedte en hoogte van het tekengebied
  const context = renderer.getContext();  // Ophalen van de tekencontext

  const staveWidth = 280; // Breedte van een maat
  const marginX = 70;     // Marge aan de linkerkant
  const marginY = -10;     // Marge aan de bovenkant

  let currentX = marginX; // Startpositie X
  let currentY = marginY; // Startpositie Y

  let i = 0;              // Index voor de noten
  let measureNumber = 0;  // Telt hoeveel maten er zijn

  // Toont een lege maat als er nog geen noten zijn in die maat
  if (notesData.length === 0) {
    const stave = new VF.Stave(currentX, currentY, staveWidth); // Maakt een maat
    stave.addClef("treble");  // Voegt de g-sleutel toe
    stave.setContext(context).draw(); // Tekent de maat
    return;  // Stopt hier
  }


  // Als er nog noten zijn
  while (i < notesData.length) {

    const stave = new VF.Stave(currentX, currentY, staveWidth); // Maakt een nieuwe maat

    // Voeg alleen bij de eerste maat in een regel de g-sleutel toe
    if (currentX === marginX) { 
      stave.addClef("treble");
    }

    stave.setContext(context).draw(); // Tekent de maat

    let beatsUsed = 0;      // Houdt bij hoeveel teller er gebruikt zijn
    let measureNotes = [];  // De noten in deze maat

    // Vult de maat totdat deze vol is
    while (i < notesData.length) {

      const noteData = notesData[i];  // De huidige noot

      // Waarde van de noot?
      const beats =
        noteData.duration === "w" ? 4 :
        noteData.duration === "h" ? 2 :
        1;

      if (beatsUsed + beats > beatsPerMeasure) break; // Als de maat vol is dan stoppen

      const parts = noteData.key.split("/");
      const pitch = parts[0];
      const octave = parts[1];
      
      const keyWithAccidental = pitch + (noteData.accidental || "") + "/" + octave;

      const staveNote = new VF.StaveNote({
        keys: [keyWithAccidental],  // De toonhoogte van de noot
        duration: noteData.duration // De duur van de noot
      });

      // ALS er een accidental is → voeg die toe aan VexFlow
      if (noteData.accidental) {
        staveNote.addModifier(
          new VF.Accidental(noteData.accidental),
          0
        );
      }

      // Als de noot geselecteerd is, dan wordt hij rood
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
      num_beats: beatsPerMeasure,
      beat_value: beatValue
    });

    voice.setStrict(false); // Voorkomt tick errors bij een lege maat of een maat die nog niet vol is

    voice.addTickables(measureNotes); // Voegt noten toe aan de voice

    // Zorgt dat de noten netjes worden verdeeld
    new VF.Formatter()
      .joinVoices([voice])
      .format([voice], staveWidth - 20);

    voice.draw(context, stave); // Tekent de noten in de maat

    currentX += staveWidth; // Ga naar de volgende maat
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

  // Als er op het pijltje omhoog wordt geklikt
  if (e.key === "ArrowUp") {  
    index++;  // Een noot omhoog
    if (index > 6) {  // Als het de zevende noot uit het octaaf is
      index = 0;      // De noot wordt de eerste noot uit het octaaf: de c
      octave++;       // Het octaaf gaat omhoog
    }
  }

  // Als er op het pijltje omlaag wordt geklikt
  if (e.key === "ArrowDown") {
    index--;  // Een noot omlaag
    if (index < 0) { // Als het de nulde noot uit het octaaf is
      index = 6;     // De noot wordt de laatste noot uit het octaaf: de b
      octave--;      // Het octaaf gaat omlaag
    }
  }

  // De nieuwe noot opslaan
  notesData[selectedIndex].key = 
    scale[index] + "/" + octave;

  renderScore();  // Opnieuw tekenen met de nieuwe toonhoogte
}

//document.getElementById("speelKnop").addEventListener("click", function() {


 //fetch("http://localhost:3000/
 //.catch(error => console.error("Fout:", error));


//});start", {
   //method: "POST",
   //headers: {
     //"Content-Type": "application/json"
   //},
   //body: JSON.stringify({
     //command: "play"
   //})
 //})
 //.then(response => response.text())
 //.then(data => console.log("Server zegt:", data))

