import { SiteClient } from 'datocms-client'

export default async function recebedorDeRequests(request, response) {
  
  if (request.method === 'POST') {
    const TOKEN = 'dd41a5a1795d8464178294be54fe53'
    const client = new SiteClient(TOKEN)
    const comunidade = request.body
    
    const record = await client.items.create({
      itemType: '975898', //model ID
      ...comunidade
    })

    response.json({
      dado: "algum valor",
      registroCriado: record,
    })

    return;
  }

  response.status(404).json({
    message: "Não temos tratamento para o GET, somente para o POST"
  })
}