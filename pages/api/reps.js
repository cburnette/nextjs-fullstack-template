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
                       match (rep:Rep {orgId: o.id})-[:HAS_ROLE]->(role:Role)
                       return rep{.firstName, .lastName, .id, role: role{.name}}`
        const result = await neo4jSession.readTransaction(tx => tx.run(query, {currUser: currUser}))

        const reps = []
        result.records.forEach( record => {
          const rep = record.get('rep')
          reps.push(rep)
        })
        
        res.status(200).json(reps)
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
                       match (role:Role {id: $role})
                       create (r:Rep {firstName: $firstName, 
                                      lastName: $lastName, 
                                      orgId: o.id, 
                                      createdAt: datetime.transaction(), 
                                      modifiedAt: datetime.transaction(),
                                      id: apoc.create.uuid()})
                              -[:HAS_ROLE {createdAt: datetime.transaction()}]
                              ->(role)
                       return r`
        const result = await neo4jSession.writeTransaction(tx => tx.run(query, {currUser: currUser, 
                                                                                firstName: req.body.firstName, 
                                                                                lastName: req.body.lastName, 
                                                                                role: req.body.role}))

        const record = result.records[0]
        const r = record.get('r')
        
        res.status(201).json(r.properties)
      } catch(error) {
        res.status(500).send()
      } finally {
        await neo4jSession.close()
      }
      break
    default:
      res.status(405).send()
  }
}