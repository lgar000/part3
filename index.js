const express = require('express')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())

app.get('/api/persons',(request, response)=>{ 
    response.json(persons)
})

app.get('/info', (request, response)=>{ 
    const date=  new Date()
    const numberPersons = persons.length
    let messae = `<p>Ponebook as info for ${numberPersons} people</p><br><p>${date}</p>`;
    response.send(messae)
})

app.get('/api/persons/:id',(request, response)=>{ 
    const id= Number(request.params.id)
    const person= persons.find(p=> p.id===id) 

    if(person){ 
         response.json(person)
    }else{ 
         response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response)=>{ 
    const id= Number(request.params.id)
    persons= persons.filter(p=> p.id!==id)
    response.status(204).end()
})

const generateId = () => {
    let id;
    do {
        id = Math.floor(Math.random() * 1000000);
    } while (persons.find(p => p.id === id));
    
    return id;
};


app.post('/api/persons', (reques, response)=>{
    const body = reques.body
   
    if(persons.find(p=>p.name===body.name)  ){
        return response.status(400).json({
            error: 'name  must be unique.' 
        })
    }if(!body.name){
        return response.status(400).json({
            error: 'name missin.' 
        })
    }if( !body.number){
        return response.status(400).json({
            error: 'number missin'
        })
    }

    const person= {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons= persons.concat(person)

    response.json(person)
})
const PORT= 3001
app.listen(PORT, ()=>{ 
    console.log(`Server running on port ${PORT}`)
})