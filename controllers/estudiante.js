const {response} = require('express')


const ConsultaChatGPT=async(req,res=response)=>{

    res.json({  
        ok: true,
        resp: "Respuesta de ChatGPT"

    })
}


module.exports={
    ConsultaChatGPT
}