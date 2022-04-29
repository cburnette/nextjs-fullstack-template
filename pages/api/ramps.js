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
                       match (r:Ramp {orgId: o.id})
                       return r`
        const result = await neo4jSession.readTransaction(tx => tx.run(query, {currUser: currUser}))

        const results = []
        result.records.forEach( record => {
          const r = record.get('r')
          results.push(r.properties)
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
                       create (r:Ramp {name: $rampName, 
                                       achievementFactor: $achievementFactor,
                                       monthlyQuota: $monthlyQuota,
                                       orgId: o.id, 
                                       createdAt: datetime.transaction(), 
                                       modifiedAt: datetime.transaction(), 
                                       id: apoc.create.uuid()})
                       return r`
        const result = await neo4jSession.writeTransaction(tx => tx.run(query, {currUser: currUser, 
                                                                                rampName: req.body.rampName, 
                                                                                achievementFactor: req.body.achievementFactor,
                                                                                monthlyQuota: req.body.monthlyQuota
                                                                               }))

        const record = result.records[0]
        const r = record.get('r')
        
        res.status(201).json(r.properties)
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