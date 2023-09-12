const express = require("express")
const { createConnection } = require("mysql2")
const { faker } = require("@faker-js/faker")

const mysql = createConnection({ 
  host: process.env.DB_HOST ?? 'localhost', 
  port: 3306, 
  user: 'root', 
  password: 'mysql', 
  database: 'names_db' 
})

mysql.query('CREATE TABLE IF NOT EXISTS people(id integer auto_increment primary key, name varchar(250));')

function getName() {
  return faker.person.fullName()
}

const app = express()

function insert(name) {
  return new Promise((resolve, reject) => {
    mysql.beginTransaction(err => {
      if (err)
        return reject(err)

      mysql.query("INSERT INTO names_db.people(name) VALUES (?)", name, (err, results) => {
        if (err)
          return reject(err)

        return resolve(results)
      })
    })
  })
}

function findAll() {
  return new Promise((resolve, reject) => {
    mysql.query('SELECT * FROM people;', (err, results) => {
      if (err)
        return reject(err)

      return resolve(results)
    })
  })
}

app.get('/', async (req, res) => {  
  try {
    await insert(getName())
    const people = await findAll()

    let title = '<h1>Full Cycle Rocks!!</h1>'
    let items = ''

    for (const person of people) {
      items += `<li>${person.name}</li>\n`
    }

    const page = `
      ${title}
      <ul>
        ${items}
      </ul>
    `

    return res.send(page)
  } catch (error) {
    return res.status(500).send(error)
  }
})

app.listen(3000, () => console.log('🚀 Process running at port 3000'))