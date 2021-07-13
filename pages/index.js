import Box from "../src/components/Box"
import MainGrid from "../src/components/MainGrid"
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations"
import { AlurakutMenu, OrkutNostalgicIconSet } from "../src/lib/AluraCommons"

// const Title = styled.h1`
//   font-size: 50px;
//   color: ${({ theme }) => theme.colors.primary};
// `

function ProfileSidebar(props) {
  return (
    <Box>
      <img src={`https://github.com/${props.githubUser}.png`}></img>
    </Box>
  )
}

export default function Home() {
  const user = 'raigomes'
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
  ]
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
        </div>
        <div className={"profileRelationsArea"} style={{gridArea:"profileRelationsArea"}}>
          <ProfileRelationsBoxWrapper>
            <h2 className={"smallTitle"}>{`Meus Amigos (${pessoasFavoritas.length})`}</h2>
            <ul>
              {pessoasFavoritas.map(pessoa => (
                <li>
                  <a href={`https://github.com/${pessoa}`}>
                    <img src={`https://github.com/${pessoa}.png`}></img>
                    <span>{pessoa}</span>
                  </a>
                </li>
              ))}
            </ul>
          </ProfileRelationsBoxWrapper>
          {/* <Box>
            Comunidades
          </Box> */}
        </div>
      </MainGrid>
    </>
  )
}
