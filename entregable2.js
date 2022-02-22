const fs  = require('fs')          

class Contenedor {

  constructor(ruta) {           
    this.ruta = ruta;           
  }


  
  async save(obj) {             
    const objs = await this.getAll()    
    let newId                           
    if (objs.length == 0) {             
      newId = 1                         
    } else {
      newId = objs[objs.length - 1].id + 1  

    const newObj = { ...obj, id: newId }   
    objs.push(newObj)                       

    try {
      await fs.promises.writeFile(this.ruta, JSON.stringify(objs, null, 2)) 
      return newId                                                         
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`)
    }
  }
  }
  async getById(id) {                       
    const objs = await this.getAll()        
    const buscado = objs.find(o => o.id == id)  
    return buscado                              
  }

  async getAll() {
    try {
      const objs = await fs.promises.readFile(this.ruta, 'utf-8')
      return JSON.parse(objs)
    } catch (error) {
      return []
    }
  }  

  async deleteById(id) {
    const objs = await this.getAll()
    const index = objs.findIndex(o => o.id == id)
    if (index == -1) {
      throw new Error(`Error al borrar: no se encontró el id ${id}`)
    }

    objs.splice(index, 1)
    try {
      await fs.promises.writeFile(this.ruta, JSON.stringify(objs, null, 2))
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`)
    }
  }

  async deleteAll() {
    await fs.promises.writeFile(this.ruta, JSON.stringify([], null, 2))
  }
}


const p1 = {
    title: "Escuadra",
    price: 123.45,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
  }
  
  const p2 = {
    title: "Calculadora",
    price: 234.56,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
  }
  
  const p3 = {
    title: "Globo Terráqueo",
    price: 345.67,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
  }
  


async function pruebas(){

    const prods = new Contenedor('./productos.txt') 
                                                    
    console.log('muestro todo')
    let objs = await prods.getAll();               
    console.log(objs);
  
    console.log('guardo p1')
    let idP1 = await prods.save(p1);                
    console.log('id de p1: ', idP1);
  
    console.log('guardo p2')
    let idP2 = await prods.save(p2);
    console.log('id de p2: ', idP2);
  
    console.log('muestro todo')
    objs = await prods.getAll();                   
    console.log(objs);  
  
    console.log('busco p1 por id')
    const res = await prods.getById(idP1);
    console.log('resultado: ', res)
  
    console.log('busco por id inexistente')
    const noexiste = await prods.getById(999);
    console.log('resultado: ', noexiste)
  
    console.log('borro p1 por id')
    await prods.deleteById(idP1);
  
    console.log('muestro todo')
    objs = await prods.getAll();
    console.log(objs);
  
    console.log('borro todo')
    await prods.deleteAll();
  
    console.log('muestro todo')
    objs = await prods.getAll();
    console.log(objs);

}

pruebas()