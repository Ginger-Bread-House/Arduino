document.getElementById("test").addEventListener("click", function() {
  this.style.color = "#87fe2c";
});

// Wacht tot de hele pagina geladen is
window.onload = function() {
  // VexFlow object
  const VF = Vex.Flow;

  // Zoek de div waar de notenbalk in moet
  const div = document.getElementById("notation");

  // Maak een SVG renderer en verbind hem met de div
  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

  // Grootte van de SVG
  renderer.resize(600, 200);

  // Haal de teken context op
  const context = renderer.getContext();

  // Eerste maat
  const stave1 = new VF.Stave(10, 40, 300);      // x=10 y=40 breedte=300
  stave1.addClef("treble");                      // g-sleutel
  stave1.setEndBarType(VF.Barline.type.SINGLE);  // maatstreep
  stave1.setContext(context);
  stave1.draw();                                 // teken hier pas


  // teken een voorbeeldnoot op de balk
  const notes1 = [
    new VF.StaveNote({ keys: ["c/4"], duration: "w" }) // hele noot
    .addAccidental(0, new VF.Accidental("b")) // 0 = eerste noot in de chord
  ];

  // Maak een voice en verbind met de context
  const voice1 = new VF.Voice({num_beats: 4, beat_value: 4}); // num_beats is de hoeveelheid kwartnoten. beat_value is de maatsoort, hier dus 4/4
  voice1.addTickables(notes1);

  // Format zodat de noten op de balk passen en teken de noten
  new VF.Formatter().joinVoices([voice1]).format([voice1], 280);
  voice1.draw(context, stave1);

  // tweede maat
  const stave2 = new VF.Stave(310, 40, 300);      // x=310 y=40 breedte=300
  stave2.setContext(context);
  stave2.setEndBarType(VF.Barline.type.DOUBLE);  // maatstreep
  stave2.draw();                                 // teken hier pas


  // teken een voorbeeldnoot op de balk
  const notes2 = [
    new VF.StaveNote({ keys: ["e/4"], duration: "h" }) // halve noot
    .addAccidental(0, new VF.Accidental("n")),

    new VF.StaveNote({ keys: ["g/4", "b/4"], duration: "q" }) // kwart noot
    .addAccidental(0, new VF.Accidental("#")),

    new VF.StaveNote({ keys: ["b/4"], duration: "q" })

  ];

  // Maak een voice en verbind met de context
  const voice2 = new VF.Voice({num_beats: 4, beat_value: 4}); // num_beats is de hoeveelheid tellen. beat_value is de maatsoort, hier dus 4/4
  voice2.addTickables(notes2);

  // Format zodat de noten op de balk passen en teken de noten
  new VF.Formatter().joinVoices([voice2]).format([voice2], 280);
  voice2.draw(context, stave2);
};

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

