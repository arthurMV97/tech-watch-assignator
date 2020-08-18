const express = require("express");
const app = express()
const fetch = require("node-fetch");
let tab = []

async function test () {
    const data = await fetch("http://localhost:8080/TechWatch")
    allTech = await data.json();
   let tab = []
    for (let i = 0; i < allTech.length; i++) {
        let date = new Date(allTech[i].date)
        tab.push({date: date, index: i})
    }

   tab.sort( (a,b)=> {
       return a.date - b.date;
   })
  
   console.log(tab)

}

test()



