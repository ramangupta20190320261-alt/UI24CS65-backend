import express from "express"

import { buildPrompt }
from "../services/prompt"

import { generateQuestions }
from "../services/aiService"

const router = express.Router()

router.post(
"/create",

async(req,res)=>{

try{

const prompt=
buildPrompt(
req.body
)

const result=
await generateQuestions(
prompt
)

res.json({

success:true,

data:{
generatedPaper:result
}

})

}
catch(err:any){

console.log(
"FULL BACKEND ERROR:"
)

console.log(err)

res.status(500).json({
message:err?.message,
stack:err?.stack
})

}

})

export default router