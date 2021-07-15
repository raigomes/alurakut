import React from 'react'
import Box from "../src/components/Box"
import MainGrid from "../src/components/MainGrid"
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations"
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from "../src/lib/AluraCommons"

import pessoasData from '../data/pessoas.json'
import comunidadesData from '../data/comunidades.json'

// const Title = styled.h1`
//   font-size: 50px;
//   color: ${({ theme }) => theme.colors.primary};
// `

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

  return (
    <ProfileRelationsBoxWrapper>
      <h2 className={"smallTitle"}>{`${props.title} (${props.items.length})`}</h2>
      <ul>
        {props.items.map((currentItem, index) => (
          index >= MAX_NUMBER_OF_ITEMS ? '' :
            <li key={currentItem.id}>
              <a href={currentItem.url} target="_blank" rel="noopener noreferrer">
                <img src={currentItem.image}></img>
                <span>{currentItem.title}</span>
              </a>
            </li>
        ))}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const user = 'raigomes'
  const pessoasFavoritas = pessoasData
  const [comunidades, setComunidades] = React.useState(comunidadesData)

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className={"profileArea"} style={{gridArea:"profileArea"}}>
          <ProfileSidebar githubUser={user} />
        </div>
        <div className={"welcomeArea"} style={{gridArea:"welcomeArea"}}>
          <Box>
            <h1 className={"title"}>
              Bem vindo(a), Raí
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
              
              if(title && image) {
                setComunidades([...comunidades, {
                  id: new Date().toISOString(),
                  title: title,
                  image: image,
                  url: url,
                }])
              }

              myForm.set('title', '')
              myForm.set('image', '')
              myForm.set('url', '')
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
          <ProfileRelationsSidebar title={"Comunidades"} items={comunidades} />
          <ProfileRelationsSidebar title={"Pessoas da Comunidade"} items={pessoasFavoritas} />
        </div>
      </MainGrid>
    </>
  )
}
