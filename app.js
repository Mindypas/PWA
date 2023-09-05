var notes = [];

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("notes")) {
    notes = JSON.parse(localStorage.getItem("notes"));
  }

  renderNotes();

  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const note = document.querySelector("textarea").value;
    if (note.length == 0) {
      alert("You didn't input any content");
    } else {
      notes.push(note);
      renderNotes();
      save();
      document.querySelector("textarea").value = "";
    }
  });
});

const renderNotes = () => {
  const ul = document.querySelector("#notes");
  ul.innerHTML = "";
  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.innerHTML = note;
    const deleteButton = document.createElement("a");
    deleteButton.innerHTML = '<span class="icon">delete</span>';
    deleteButton.addEventListener("click", (event) => {
      if (confirm("Do you want to delete this note?")) {
        notes.splice(index, 1);
        renderNotes();
        save();
      }
    });
    li.appendChild(deleteButton);
    ul.appendChild(li);
  });
};

const save = () => {
  localStorage.setItem("notes", JSON.stringify(notes));
};
