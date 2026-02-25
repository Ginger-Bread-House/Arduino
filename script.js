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
  renderer.resize(980, 200);

  //Breedte notenbalk
  const staveWidth = 300;

  // Haal de teken context op
  const context = renderer.getContext();

  // Eerste maat
  const stave1 = new VF.Stave(40, -10, staveWidth);      // x=40 y=-10 breedte=300
  stave1.addClef("treble");                      // g-sleutel
  stave1.setEndBarType(VF.Barline.type.SINGLE);  // maatstreep
  stave1.setContext(context);
  stave1.draw();                                 // teken hier pas


  // teken noten op de balk
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
  const stave2 = new VF.Stave(340, -10, staveWidth);      // x=340 y=-10 breedte=300
  stave2.setContext(context);
  stave2.setEndBarType(VF.Barline.type.SINGLE);  // maatstreep
  stave2.draw();                                 // teken hier pas


  // teken noten op de balk
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

   // derde maat
  const stave3 = new VF.Stave(640, -10, staveWidth);      // x=640 y=-10 breedte=300
  stave3.setContext(context);
  stave3.setEndBarType(VF.Barline.type.SINGLE);  // maatstreep
  stave3.draw();                                 // teken hier pas


  // teken noten op de balk
  const notes3 = [
    new VF.StaveNote({ keys: ["e/4"], duration: "h" }) // halve noot
    .addAccidental(0, new VF.Accidental("n")),

    new VF.StaveNote({ keys: ["g/4", "b/4"], duration: "q" }) // kwart noot
    .addAccidental(0, new VF.Accidental("#")),

    new VF.StaveNote({ keys: ["b/4"], duration: "q" })

  ];

  // Maak een voice en verbind met de context
  const voice3 = new VF.Voice({num_beats: 4, beat_value: 4}); // num_beats is de hoeveelheid kwartnoten. beat_value is de maatsoort, hier dus 4/4
  voice3.addTickables(notes3);

  // Format zodat de noten op de balk passen en teken de noten
  new VF.Formatter().joinVoices([voice3]).format([voice3], 280);
  voice3.draw(context, stave3);


  // Vierde maat
  const stave4 = new VF.Stave(40, 80, staveWidth);      // x=40 y=80 breedte=300
  stave4.addClef("treble");                      // g-sleutel
  stave4.setEndBarType(VF.Barline.type.SINGLE);  // maatstreep
  stave4.setContext(context);
  stave4.draw();                                 // teken hier pas


  // teken noten op de balk
  const notes4 = [
    new VF.StaveNote({ keys: ["c/4"], duration: "w" }) // hele noot
    .addAccidental(0, new VF.Accidental("b")) // 0 = eerste noot in de chord
  ];

  // Maak een voice en verbind met de context
  const voice4 = new VF.Voice({num_beats: 4, beat_value: 4}); // num_beats is de hoeveelheid kwartnoten. beat_value is de maatsoort, hier dus 4/4
  voice4.addTickables(notes4);

  // Format zodat de noten op de balk passen en teken de noten
  new VF.Formatter().joinVoices([voice4]).format([voice4], 280);
  voice4.draw(context, stave4);

  // vijfde maat
  const stave5 = new VF.Stave(340, 80, staveWidth);      // x=340 y=80 breedte=300
  stave5.setContext(context);
  stave5.setEndBarType(VF.Barline.type.SINGLE);  // maatstreep
  stave5.draw();                                 // teken hier pas


  // teken noten op de balk
  const notes5 = [
    new VF.StaveNote({ keys: ["e/4"], duration: "h" }) // halve noot
    .addAccidental(0, new VF.Accidental("n")),

    new VF.StaveNote({ keys: ["g/4", "b/4"], duration: "q" }) // kwart noot
    .addAccidental(0, new VF.Accidental("#")),

    new VF.StaveNote({ keys: ["b/4"], duration: "q" })

  ];

  // Maak een voice en verbind met de context
  const voice5 = new VF.Voice({num_beats: 4, beat_value: 4}); // num_beats is de hoeveelheid tellen. beat_value is de maatsoort, hier dus 4/4
  voice5.addTickables(notes5);

  // Format zodat de noten op de balk passen en teken de noten
  new VF.Formatter().joinVoices([voice5]).format([voice5], 280);
  voice5.draw(context, stave5);

   // Zesde maat
  const stave6 = new VF.Stave(640, 80, staveWidth);      // x=640 y=80 breedte=300
  stave6.setContext(context);
  stave6.setEndBarType(VF.Barline.type.DOUBLE);  // maatstreep
  stave6.draw();                                 // teken hier pas


  // teken noten op de balk
  const notes6 = [
    new VF.StaveNote({ keys: ["e/4"], duration: "h" }) // halve noot
    .addAccidental(0, new VF.Accidental("n")),

    new VF.StaveNote({ keys: ["g/4", "b/4"], duration: "q" }) // kwart noot
    .addAccidental(0, new VF.Accidental("#")),

    new VF.StaveNote({ keys: ["b/4"], duration: "q" })

  ];

  // Maak een voice en verbind met de context
  const voice6 = new VF.Voice({num_beats: 4, beat_value: 4}); // num_beats is de hoeveelheid tellen. beat_value is de maatsoort, hier dus 4/4
  voice6.addTickables(notes6);

  // Format zodat de noten op de balk passen en teken de noten
  new VF.Formatter().joinVoices([voice6]).format([voice6], 280);
  voice6.draw(context, stave6);
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

