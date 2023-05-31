import React,{useContext,useState} from "react";
import NoteContext from "../context/notes/noteContext";

const AddNotes = (props) => {
    const context = useContext(NoteContext);
    const{addNote} = context;
    const [note, setNotes] = useState({title:"",description:"",tag:"default"});
    const handleClick =(e)=>{
        e.preventDefault();// This is used for preventing a page reload
        // eslint-disable-next-line
        addNote(note.title,note.description,note.tag);
        setNotes({title:"",description:"",tag:""})
        props.showAlert("Notes Added Successfully","success");
    }
    const onChange=(e)=>{
        setNotes({...note,[e.target.name]:e.target.value});
    }
  return (
    <div className="container my-3">
      <h2>Add a Notes</h2>
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            aria-describedby="emailHelp"
            value={note.title}
            // placeholder="Title"
            onChange={onChange}
            minLength={3}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={note.description}
            // placeholder="Description"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            value={note.tag}
            // placeholder="Tag"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNotes;
