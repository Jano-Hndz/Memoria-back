const {response} = require('express')
const openAI = require('openai');

const openAIInstance = new openAI({ apiKey: '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' });


const ConsultaChatGPT=async(req,res=response)=>{
    console.log("Entro");
    // console.log(req.body.consulta);
    const respuesta = await openAIInstance.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: "system", content: "Hablame de manera abreviada como es Rapel de Navidad en Chile." }],
      });


    console.log(respuesta);
    console.log("--------------------------------");
    console.log(respuesta.choices[0].message.content);

    res.json({  
        ok: true,
        resp: "Respuesta de ChatGPT"

    })
}


module.exports={
    ConsultaChatGPT
}