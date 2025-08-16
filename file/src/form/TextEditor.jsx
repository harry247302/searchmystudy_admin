import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TextEditor({content,setContent}) {

 
// console.log(content);

  return (
    <div>
      <Editor
        apiKey="25ay2rt9zs014kay8iepacupp13xjn6kv7dd4t2b6mnx148f"
        value={content}
        init={{
          height: 300,
          menubar: false,
          plugins: ["link", "image", "lists", "table", "code"],
          toolbar:
            "undo redo | formatselect | bold italic | " +
            "alignleft aligncenter alignright | bullist numlist | link image | code",
        }}
        onEditorChange={(newContent) => setContent(newContent)}
      />      
    </div>
  );
}
