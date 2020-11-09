# PCVT Tool :: Backend

*Esse repositório é uma cópia [Original](https://github.com/allan-mlpe/experiment-planning-tool), sendo usado como base para um Trabalho de Conclusão de Curso (TCC) na Universidade Católica de Pernambuco. O objetivo é agregar novas funcionalidades voltadas a avaliação de usabilidade de uma ferramenta orientado à validade de seus resultados.*

Projeto de desenvolvimento do módulo _backend_ da aplicação **PCVT Tool**  implementado em linguagem de programação Java, com o objetivo de prover as funcionalidades necessárias para o módulo _frontend_ implementado no framework Angular.

```
                    :: PCVT TOOL ::

┌────────────┐       ┌───┬─────────┐       ┌──────────────┐
│  PCVT Tool │       │ R │PCVT Tool│       │              │
│  Frontend  │ <===> │ E │ Backend │ <===> │      BD      │
│  (Angular) │       │ S │ (Java)  │       │ (PostgreSQL) │
│            │       │ T │         │       │              │
└────────────┘       └───┴─────────┘       └──────────────┘
```

Este projeto usa as seguintes tecnologias:
- [Java 8](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
- [Jersey](https://eclipse-ee4j.github.io/jersey/)
- [Jetty](https://www.eclipse.org/jetty/)
- [Maven](https://maven.apache.org/)
- [Hibernate](https://hibernate.org/)
- [Docker](https://www.docker.com/)

## 1- Ferramentas e Configurações

O setup de configuração do ambiente de desenvolvimento é simples e independente da (s) IDE (s) e SGBD que o desenvolvedor preferir utilizar. Utilizei o IntelliJ para desenvolver as funcionalidades do backend, porém, para facilidade da maioria, segue o guia para configurar no Eclipse(OpenSource IDE).

### 1.1- Eclipse

**Instalação**

Baixar e descompactar um dos pacotes (Win ou Linux 64-bit) da versão `Eclipse IDE for Java Developers` que pode ser encontrado [aqui](https://www.eclipse.org/downloads/packages/).

**Importação do Projeto (Git)**

Após abrir o Eclipse, importar projeto do Git:

1. _File_ -> _Import..._ -> _Projects from Git_ -> _Clone URI_
2. URI: `git@github.com:rodrigorjsf/pcvt-backend.git` -> _Next_
3. Escolher _branch_ `dev`
4. Local destination: _pasta-do-workspace_
5. _Import as general project_ -> _Next_ -> _Finish_

**Configuração do Projeto**

1. Clicar com botão direito no projeto -> _Configure_ -> _Convert to Maven project_
2. Clicar com botão direito no projeto -> _Maven_ -> _Update Project..._
3. OK (incluir opção `Force Update os Snapshots/Releases`)

Incluir `Run Configurations`:

1. _**Maven Build**_ -> New launch configuration -> Name: `pcvt-backend [clean package]`, Base directory: `selecionar-nome-do-projeto`, Goals: `clean package`
2. _**Java Application**_ -> New launch configuration -> (Main) Name: `pcvt-backend [run]`, Project: `selecionar-nome-do-projeto`, Main class: `br.ufpe.cin.pcvt.app.APIServer`

### 1.2- pgAdmin

Para baixar a ferramenta pgAdmin, clique [aqui](https://www.pgadmin.org/).

**Banco de Dados:**
host: `ec2-54-237-155-151.compute-1.amazonaws.com`
port: `5432`
database: `d7stc7nik93g3m`

## 2- Arquitetura do Sistema

Este projeto segue um padrão arquitetural em camadas [[1](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html),[2](https://en.wikipedia.org/wiki/Multitier_architecture)] para fornecer uma API REST [[3](https://dzone.com/articles/intro-rest),[4](https://www.quora.com/What-are-RESTful-APIs-and-how-do-they-work),[5](https://blog.caelum.com.br/rest-principios-e-boas-praticas/)] ao módulo _frontend_ da aplicação. A camada mais externa do sistema (_Resources_) implementa os serviços REST (Jersey/JAX-RS), tendo esta camada a responsabilidade de validar os dados de entrada, assim como realizar as restrições de segurança necessárias (autenticação/autorização) no acesso aos serviços disponibilizados. A camada imediatamente abaixo (_Controllers_) é responsável pela execução da lógica de negócio de cada serviço, que incluem validações de negócio e transformação dos dados de entrada antes de atualizá-los. A última camada (_Persistence_) do modelo é responsável pelas funcionalidades diretas de acesso/atualização dos dados do sistema no banco de dados.

```
┌───────────────────┐
│  Resources (REST) │ Jersey RESTful Web Services that provides support for JAX-RS APIs and serves as a JAX-RS (JSR 311 & JSR 
├───────────────────┤ 339 & JSR 370)
│  Controllers (BC) │
├───────────────────┤
│ Persistence (DAO) │ JPA, Hibernate
└───────────────────┘
         ||
     ┌────────┐
     │   BD   │ Postgresql
     └────────┘
```
O projeto foi desenvolvido usando a ferramenta [Jersey](https://eclipse-ee4j.github.io/jersey/) utilizando sua implementação de servlet container junto com a ferramenta [Jetty](https://www.eclipse.org/jetty/) que é um servidor HTTP e Servlet Container, sendo assim, a aplicação é executada em contêineres do Docker. Para isto, basta rodar o seguinte comando com o Docker:

Para gerar a imagem a partir do Dockerfile contido no projeto, vá até ao diretório onde se encontra o arquivo e execute o seguinte comando:
```sh
$ docker build -t pcvt-backend .
```

Para executar a imagem gerada da aplicação em um container, basta executar o seguinte comando:

```sh
$ docker run -p 7007:80 pcvt-backend
```

A organização e significado de cada um dos pacotes do projeto segue abaixo:

```
src
├── main
│   ├── java/br/ufpe/cin/pcvt
│   │   ├── api                                      	-> classes comuns à camada de serviço (xxxxResource.java)
│   │   ├── app                                   	 	-> classes de
│   │   ├── business                                 	-> classes da camada de negócio
│   │   ├── controllers                              	-> classes qde controle
│   │   ├── converters                               	-> classes de conversão
│   │   ├── data                              		 	-> classes das entidades/models principais e persistência das mesmas
│   │   ├── exceptions                               	-> classes de exceções
│   │   ├── util                                 	 	->  classes utilitárias
│   │   └── validators                               	-> classes de validadores de dados
│   ├── resources
│   │   ├── json-resources/  	
│   │       └── instrument_questions.json               -> arquivo json com questões do instrumento
│   │   ├── META-INF                             		-> arquivo de manifesto do projeto
│   │       └── persistance.xml                         -> arquivo de configuracao do driver do postgresql
│   │   └── log4j.properties                    		-> arquivo de propriedades de log
```
