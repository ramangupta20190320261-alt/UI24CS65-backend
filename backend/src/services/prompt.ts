export const buildPrompt=(data:any)=>{

return `

Generate a school assessment.

Return ONLY valid JSON.

{
 "sections":[
   {
     "title":"",
     "instruction":"",
     "questions":[
      {
        "question":"",
        "difficulty":"",
        "marks":0
      }
     ]
   }
 ]
}

Question Types:

${JSON.stringify(data.questionTypes)}

Instructions:

${data.instructions}

`

}