import { getSession } from "next-auth/react"
import { neo4jDriver } from './_neo4j'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    res.status(403).send({ error: "Unauthorized" })
  }

  const currUser = session.user.email
  let neo4jSession

  switch (req.method) {
    case 'GET':
      try {
        neo4jSession = neo4jDriver.session()
        const query = `match (u:User {email: $currUser})-[:BELONGS_TO]->(o:Org)
                       match (b:Budget {orgId: o.id})
                       return b`
        const result = await neo4jSession.readTransaction(tx => tx.run(query, {currUser: currUser}))

        const results = []
        result.records.forEach( record => {
          const b = record.get('b')
          results.push(b.properties)
        })
        
        res.status(200).json(results)
      } catch(error) {
        console.log(error)
        res.status(500).send()
      } finally {
        await neo4jSession.close()
      }
      break
    case 'POST':    
      try {
        neo4jSession = neo4jDriver.session()
        const query = `match (u:User {email: $currUser})-[:BELONGS_TO]->(o:Org)
                       create (b:Budget { name: $budgetName, 
                                          orgId: o.id, 
                                          createdAt: datetime.transaction(), 
                                          modifiedAt: datetime.transaction(), 
                                          id: apoc.create.uuid()
                                        })
                       return b`
        const result = await neo4jSession.writeTransaction(tx => tx.run(query, {currUser: currUser, 
                                                                                budgetName: req.body.name
                                                                               }))

        const record = result.records[0]
        const b = record.get('b')
        
        res.status(201).json(b.properties)
      } catch(error) {
        console.log(error)
        res.status(500).send()
      } finally {
        await neo4jSession.close()
      }
      break
    default:
      res.status(405).send()
  }
}