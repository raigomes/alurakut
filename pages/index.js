import React from 'react'
import nookies from 'nookies' //Lib de cookies
import jwt from 'jsonwebtoken' //Lib para decodificar tokens
import Box from "../src/components/Box"
import MainGrid from "../src/components/MainGrid"
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations"
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from "../src/lib/AluraCommons"

import pessoasData from '../data/pessoas.json'
//import comunidadesData from '../data/comunidades.json'

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`}></img>
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

function ProfileRelationsSidebar(props) {
  const MAX_NUMBER_OF_ITEMS = 6

  //console.log(props.items)

  return (
    <ProfileRelationsBoxWrapper>
      <h2 className={"smallTitle"}>{`${props.title} (${props.items.length})`}</h2>
      <ul>
        {props.items.map((currentItem, index) => (
          index >= MAX_NUMBER_OF_ITEMS ? '' :
            <li key={currentItem.id}>
              <a href={currentItem.html_url || currentItem.url} target="_blank" rel="noopener noreferrer">
                <img src={currentItem.avatar_url || currentItem.image}></img>
                <span>{currentItem.login || currentItem.title}</span>
              </a>
            </li>
        ))}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const user = props.githubUser
  const pessoasFavoritas = pessoasData
  const [comunidades, setComunidades] = React.useState([])
  const [seguidores, setSeguidores] = React.useState([])
  // Pegando array de dados do Github com useEffect para ser executado em cada renderização 
  // (o segundo parâmetro indica para ser executado apenas uma vez)
  React.useEffect(function (){
    fetch(`https://api.github.com/users/${user}/followers`)
      .then(response => response.json())
      .then(items => {
        //Fix para atualizar "seguidores" somente se o retorno for um array
        if(Array.isArray(items)) setSeguidores(items) 
      })
      .catch(error => console.error('[DEU RUIM]', error))

    fetch(`https://graphql.datocms.com/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization' : 'Bearer 956bcdeeeae1d15e5594f7e4f1d4aa',
      },
      body: JSON.stringify({"query": `query {
        allCommunities {
          id,
          title,
          image,
          url,
        }
      }`})
    })
      .then(async (response) => {
        const respostaDoDato = await response.json()
        console.log(respostaDoDato)
        setComunidades(respostaDoDato.data.allCommunities)
      })
  }, [])

  return (
    <>
      <AlurakutMenu githubUser={user} />
      <MainGrid>
        <div className={"profileArea"} style={{gridArea:"profileArea"}}>
          <ProfileSidebar githubUser={user} />
        </div>
        <div className={"welcomeArea"} style={{gridArea:"welcomeArea"}}>
          <Box>
            <h1 className={"title"}>
              Bem vindo(a), {user}
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
          
          <Box>
            <h2 className={"subTitle"}>O que você deseja fazer?</h2>
            <form onSubmit={function handleSubmitForm(e) {
              e.preventDefault()
              
              const myForm = new FormData(e.target)
              const title = myForm.get('title')
              const image = myForm.get('image')
              const url = myForm.get('url')
              const comunidade = {
                title,
                image,
                url
              }
              
              if(title && image) {
                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
                })
                .then(async (response) => {
                  const dados = await response.json()
                  //console.log(dados.registroCriado)
                  setComunidades([...comunidades, dados.registroCriado])
                })
              }
            }}>
              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque a URL da comunidade"
                  name="url"
                  aria-label="Coloque a URL da comunidade"
                />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className={"profileRelationsArea"} style={{gridArea:"profileRelationsArea"}}>
          <ProfileRelationsSidebar title={"Seguidores"} items={seguidores} />
          <ProfileRelationsSidebar title={"Comunidades"} items={comunidades} />
          <ProfileRelationsSidebar title={"Pessoas da Comunidade"} items={pessoasFavoritas} />
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN
  const payload = jwt.decode(token) //JWT Token decoded
  
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((response) => response.json())
  
  //console.log('isAuthenticated', isAuthenticated)
  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  } 

  return {
    props: {
      githubUser: payload.githubUser
    }, // will be passed to the page component as props
  }
}