import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const NoteDiaryComponent = () => {
  const [notes, setNotes] = useState([
    { title: "Sample Note", content: "This is a sample note content." },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [expandedNote, setExpandedNote] = useState(null);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  const handleDialogOpen = (index = null) => {
    if (index !== null) {
      setNewNote(notes[index]);
      setEditingNoteIndex(index);
    } else {
      setNewNote({ title: "", content: "" });
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingNoteIndex(null);
  };

  const handleNoteChange = (e) => {
    setNewNote({ ...newNote, [e.target.name]: e.target.value });
  };

  const saveNote = () => {
    if (editingNoteIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editingNoteIndex] = newNote;
      setNotes(updatedNotes);
    } else {
      setNotes([...notes, newNote]);
    }
    handleDialogClose();
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, noteIndex) => noteIndex !== index);
    setNotes(updatedNotes);
  };

  const toggleNote = (index) => {
    setExpandedNote(expandedNote === index ? null : index);
  };

  const applyStyle = () => {
    let style = {};
    if (bold) style.fontWeight = "bold";
    if (italic) style.fontStyle = "italic";
    if (underline) style.textDecoration = "underline";
    return style;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        height: "100vh",
        marginLeft: "20%",
        marginTop: "-200px",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleDialogOpen()}
        style={{ backgroundColor: "black" }}
      >
        Add Note
      </Button>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {editingNoteIndex !== null ? "Edit Note" : "Add a New Note"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            name="title"
            value={newNote.title}
            onChange={handleNoteChange}
          />
          <TextField
            margin="dense"
            id="content"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={8}
            variant="standard"
            name="content"
            value={newNote.content}
            onChange={handleNoteChange}
          />
          <div>
            <FormControlLabel
              control={
                <Checkbox checked={bold} onChange={() => setBold(!bold)} />
              }
              label="Bold"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={italic}
                  onChange={() => setItalic(!italic)}
                />
              }
              label="Italic"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={underline}
                  onChange={() => setUnderline(!underline)}
                />
              }
              label="Underline"
            />
            <IconButton color="primary" component="label">
              <AttachFileIcon />
              <input type="file" hidden onChange={handleFileUpload} />
            </IconButton>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={saveNote}>Save</Button>
        </DialogActions>
      </Dialog>

      <List>
        {notes.map((note, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleDialogOpen(index)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteNote(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemButton onClick={() => toggleNote(index)}>
              <ListItemText primary={note.title} style={applyStyle()} />
              {expandedNote === index && (
                <ListItemText secondary={note.content} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default NoteDiaryComponent;
