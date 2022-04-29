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
                       match (role:Role {orgId: o.id})-[:HAS_RAMP]->(ramp:Ramp)
                       return role{.name, .id, .quota, rampModel: ramp{.name, .achievementFactor}}`
        const result = await neo4jSession.readTransaction(tx => tx.run(query, {currUser: currUser}))

        const roles = []
        result.records.forEach( record => {
          const role = record.get('role')
          roles.push(role)
        })
        
        res.status(200).json(roles)
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
                       match (ramp:Ramp {id: $rampModel})
                       create (r:Role {name: $roleName, 
                                       orgId: o.id,
                                       quota: $quota,
                                       createdAt: datetime.transaction(), 
                                       modifiedAt: datetime.transaction(),
                                       id: apoc.create.uuid()})
                              -[:HAS_RAMP {createdAt: datetime.transaction()}]
                              ->(ramp)
                       return r`
        const result = await neo4jSession.writeTransaction(tx => tx.run(query, {currUser: currUser, 
                                                                                roleName: req.body.roleName,
                                                                                quota: req.body.quota, 
                                                                                rampModel: req.body.rampModel}))

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