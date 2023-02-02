const express=require("express");
const router = express.Router();
const Notes=require('../models/Notes');
const fetchuser=require('../middlewear/fetchuser');
const { body, validationResult } = require('express-validator');

//Route1:Get all notes:GET "api/auth/getuser"login is required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const notes=await Notes.find({user:req.user.id});
    
        res.json(notes)
        
    } catch (error) {
        
        console.error(error.message);
        res.status(500).send("Internal server errors occured")
    }
    
})

//Route2:Add a notes using:POST "api/notes/addnote"login is required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({ min: 3 }),
    body('description','Description must be 5 characters').isLength({ min: 5 }),

],async (req,res)=>{
    try {
        const {title,description,tag}=req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const notes=new Notes({
        title,description,tag,user:req.user.id,

    })
    const savedNotes=await notes.save()

    
    res.json(savedNotes)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server errors occured")
        
    }
    
})

//Route3:Update an existing notes using:PUT "api/notes/updatenote"login is required
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    const{title,description,tag}=req.body;
    //create a new note object
    try {
    const newNotes={};
    if(title){newNotes.title=title};
    if(description){newNotes.description=description};
    if(tag){newNotes.tag=tag};

    //Find the note to be updated and update it
    let notes=await Notes.findById(req.params.id);
    if(!notes){return res.status(404).send("Not FOUND")}

    if(notes.user.toString()!==req.user.id){
        return res.status(401).send("Not ALLOWED");
    }
    note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNotes},{new:true})
    res.json({notes});

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server errors occured")
        
    }
    
})

//Route4:Delete an existing notes using:DELETE "api/notes/deletenote"login is required
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    // const{title,description,tag}=req.body;
    try {
        //Find the note to be deleted and delete it
    let notes=await Notes.findById(req.params.id);
    if(!notes){return res.status(404).send("Not FOUND")}
     //Allow deletion only if user owns note
    if(notes.user.toString()!==req.user.id){
        return res.status(401).send("Not ALLOWED");
    }
    note=await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted",notes:notes});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server errors occured")
        
    }
    
    

})
module.exports= router;