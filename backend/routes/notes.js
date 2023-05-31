const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Notes = require("../models/Notes");

//ROUTE 1: get all the Notes using /api/notes/fetchallnotes, Login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internel server error occure");
  }
});

//ROUTE 2: Add a New Notes using :POST/api/notes/addnotes, Login required

router.post(
  "/addnotes",
  fetchuser,
  [
    (body("title", "Enter the valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 character").isLength({
      min: 5,
    })),
  ],
  async (req, res) => {
    try {
      const { description, title, tag } = req.body;

      //IF there are error ,then return BAD request and the error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      //save notes detail

      const savenotes = await notes.save();
      res.json(savenotes);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internel server error occure");
    }
  }
);

//ROUTE 3: Update an Existing Notes using: PUT /api/notes/updatenotes, Login required
router.put(
  "/updatenotes/:id",
  fetchuser,
  [
    (body("title", "Enter the valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 character").isLength({
      min: 5,
    })),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    try {
      //Create a New Object
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      //find the Note to be updated and Update it

      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found");
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }

      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internel server error occure");
    }
  }
);

//ROUTE 4: Delete an Existing Notes using:DELETE /api/notes/deletenotes, Login required
router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  try {
    //find the Note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    //Allow deletion only if user owns  this notes
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Success Note has been deleted", note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internel server error occure");
  }
});
module.exports = router;
