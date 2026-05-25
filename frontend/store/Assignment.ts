import {create}
from "zustand"

export const useAssignment=
create((set)=>({

paper:null,

setPaper:
(data:any)=>
set({
paper:data
})

}))