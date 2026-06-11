# Lunar Engine

Portal web para consultar dados públicos da NASA. O front-end (Vue 3) consome exclusivamente a API FastAPI do projeto, que atua como proxy entre o cliente e os serviços externos da NASA e parceiros.

## Arquitetura

```
Navegador (Vue 3)
      ↓  /api/*
FastAPI (Python) — proxy + tratamento de erros
      ↓
APIs externas (NASA, JPL, EONET, CelesTrak, etc.)
```

O front-end **não** chama a API da NASA diretamente para dados JSON. Em desenvolvimento, o Vite redireciona `/api` para o back-end local.

## Pré-requisitos

- Python 3.11+
- Node.js 18+
- Chave da API da NASA ([cadastro gratuito](https://api.nasa.gov/))

## Configuração

1. Clone o repositório e entre na pasta do projeto.

2. Copie o arquivo de ambiente e preencha sua chave:

```bash
cp .env.example .env
```

Edite `.env`:

```env
NASA_API_KEY=sua_chave_aqui
```

> O arquivo `.env` não é versionado. Nunca commite a chave real.

## Back-end (FastAPI)

### Instalação

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt
```

### Executar

```bash
uvicorn main:app --reload --port 8002
```

- API: http://127.0.0.1:8002
- Documentação interativa (Swagger): http://127.0.0.1:8002/docs
- ReDoc: http://127.0.0.1:8002/redoc

## Front-end (Vue 3 + Vite)

### Instalação

```bash
cd frontend
npm install
```

### Executar

```bash
npm run dev
```

- App: http://127.0.0.1:5173

O proxy do Vite encaminha requisições de `/api/*` para `http://127.0.0.1:8002`.

### Build de produção

```bash
npm run build
npm run preview
```

## Estrutura do projeto

```
Lunar-Engine/
├── main.py              # Entrada FastAPI
├── core/
│   ├── config.py        # Variáveis de ambiente e URLs base
│   └── proxy.py         # Cliente HTTP e repasse de respostas
├── routers/             # Rotas GET por domínio (APOD, NEO, DONKI, etc.)
├── frontend/
│   └── src/
│       ├── modules/     # Telas por tema (asteroides, APOD, satélites…)
│       ├── composables/ # useApi.js — chamadas ao back-end
│       └── components/  # Layout, loader, navegação
├── .env.example
└── requirements.txt
```

## Módulos do front-end

| Rota | Conteúdo |
|------|----------|
| `/` | Home com globo 3D |
| `/foto-do-dia` | Astronomy Picture of the Day (APOD) |
| `/asteroides` | Lista e detalhe de asteroides (NeoWs) |
| `/camera-terra` | Imagens EPIC (DSCOVR) |
| `/clima-marte` | Clima em Marte (InSight) |
| `/imagens-terra` | Imagens da Terra via GIBS |
| `/rovers-marte` | Fotos dos rovers em Marte |
| `/clima-espacial` | Clima espacial (DONKI) |
| `/eventos-naturais` | Eventos naturais (EONET) |
| `/satelites` | Busca de satélites (TLE) |
| `/sistema-solar` | Sistema solar / NEOs (SSD) |
| `/exoplanetas` | Exoplanetas |
| `/ciencia-aberta` | Ciência aberta (OSDR) |
| `/midias` | Biblioteca de imagens e vídeos da NASA |
| `/projetos` | Projetos NASA (TechPort) |
| `/techtransfer` | Patentes, software e spinoffs |

## Endpoints do back-end

Todos os métodos expostos são **GET**. Resumo por prefixo:

| Prefixo | API de origem |
|---------|----------------|
| `/apod` | NASA APOD |
| `/neo` | NeoWs (asteroides) |
| `/donki` | DONKI (clima espacial) |
| `/epic` | EPIC (câmera da Terra) |
| `/insight` | InSight (clima em Marte) |
| `/mars-rovers` | Fotos dos rovers |
| `/images` | NASA Image & Video Library |
| `/ssd` | SSD / CNEOS |
| `/eonet` | EONET |
| `/tle` | CelesTrak (elementos orbitais) |
| `/exoplanet` | NASA Exoplanet Archive |
| `/osdr` | Open Science Data Repository |
| `/earth` | Imagens da Terra (GIBS/WMS) |
| `/techport` | TechPort |
| `/techtransfer` | TechTransfer |

Consulte `/docs` para a lista completa com parâmetros e exemplos de resposta.

## Tratamento de erros

O proxy converte falhas externas em respostas HTTP adequadas:

- **504** — timeout do serviço externo
- **502** — resposta JSON inválida
- **503** — falha de conexão
- Status original repassado quando a API externa retorna erro HTTP

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NASA_API_KEY` | Sim | Chave da API da NASA |
