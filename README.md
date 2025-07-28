# frontend-pdv

## Requisitos

- Docker e Docker Compose
- Node.js (opcional, para rodar localmente sem Docker)

## Instalação

### Usando Docker

1. Construa a imagem:
   ```bash
   sudo make build
   ```
2. Inicie os containers:
   ```bash
   sudo make start
   ```
3. O frontend estará disponível em [http://localhost:3001](http://localhost:3001)

### Rodando localmente (sem Docker)

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
3. Acesse [http://localhost:3001](http://localhost:3001)

## Variáveis de ambiente

Configure o arquivo `.env` conforme necessário para apontar para o backend e outros serviços.

## Observações

- O container do frontend expõe a porta 80 internamente, mapeada para a porta 3001 do host.
- O backend e o banco de dados devem estar rodando e acessíveis para o funcionamento completo do sistema.
