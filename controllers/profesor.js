const {response} = require('express')


const GetDataAlumnos=async(req,res=response)=>{

    res.json({  
        ok: true
    })
}

module.exports={
    GetDataAlumnos
}