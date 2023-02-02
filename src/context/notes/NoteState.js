import React from "react";
import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState=(props)=>{
    const host="http://localhost:5000"
    const notesInitial=[]
      const[notes,setNotes]=useState(notesInitial);

      //Get All notes
      const getNotes=async()=>{
        const response = await fetch(`${host}/api/notes/fetchallnotes`,{
          method:"GET",
          headers:{
            'Content-Type':'application-json',
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMzNmEyMmUzN2FiMTViYjcxZDEwNmM3In0sImlhdCI6MTY2NDUyNDkxOH0.TCR2ggHQITuHaAeBjdBfq630UZwSHYPHlqtRa0t5hvQ"
          }
          
        }) 
        const json=await response.json()
        console.log(json)
        setNotes(json)

      }
      
      //Add a note
      const addNote=async(title,description,tag)=>{
        const response = await fetch(`${host}/api/notes/addnote`,{
          method:"POST",
          headers:{
            "Content-Type":"application-json",
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMzNmEyMmUzN2FiMTViYjcxZDEwNmM3In0sImlhdCI6MTY2NDUyNDkxOH0.TCR2ggHQITuHaAeBjdBfq630UZwSHYPHlqtRa0t5hvQ"
          },
          body:JSON.stringify({title,description,tag})
        }) 
        const json=await response.json();
        console.log(json)
        const note={
          "user": "6336a22e37ab15bb71d106c7",
          "title": title,
          "description": description,
          "tag": tag,
          "_id": "6338057e40a30fd344f18ef6",
          "date": "2022-10-01T09:16:46.407Z",
          "__v": 0
        }
        setNotes(notes.concat(note))

      }

      //Delete a note
      const deleteNote=async (id)=>{
        //API CALL
        const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
          method:"DELETE",
          headers:{
            'Content-Type':'application-json',
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMzNmEyMmUzN2FiMTViYjcxZDEwNmM3In0sImlhdCI6MTY2NDUyNDkxOH0.TCR2ggHQITuHaAeBjdBfq630UZwSHYPHlqtRa0t5hvQ"
          },
          
        }) 
        const json=response.json
        console.log("Deleting the note with id" + id);
        const newNotes=notes.filter((note)=>{return note._id!==id});
        setNotes(newNotes);

      }

      //Edit a note

      
      const editNote= async (id,title,description,tag)=>{
        //API CALL
        const response = await fetch(`${host}/api/notes/updatenote/${id}`,{
          method:"PUT",
          headers:{
            'Content-Type':'application-json',
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMzNmEyMmUzN2FiMTViYjcxZDEwNmM3In0sImlhdCI6MTY2NDUyNDkxOH0.TCR2ggHQITuHaAeBjdBfq630UZwSHYPHlqtRa0t5hvQ"
          },
          body:JSON.stringify({title,description,tag})
        }) 
        const json=await response.json();
        console.log(json)
      
        //Logic to edit in API
        let newNotes=JSON.parse(JSON.stringify(notes))
        for(let index=0;index<newNotes.length;index++){
          const element=newNotes[index];
        if (element._id===id){
          newNotes[index].title=title;
          newNotes[index].description=description;
          newNotes[index].tag=tag;
          break;
        }
        
        }
        setNotes(newNotes);
      }
    
    return(
        
        <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes}}>
            {props.children};
        </NoteContext.Provider>

    )
}

export default NoteState;