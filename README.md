# frontend-pdv

## Requisitos

- Docker e Docker Compose
- Node.js (opcional, para rodar localmente sem Docker)

## Instalação

1. Clone o projeto em sua máquina

   ```bash
   git clone git@github.com:gabrielptzlff/frontend-pdv.git
   ```

2. Crie o .env para configurar as variáveis de ambiente

   ```bash
   cp ./.env.homolog ./.env
   ```

3. Instale os pacotes necessários

   ```bash
   npm i
   ```

4. Faça o build e start do container

   ```bash
   make build && make start
   ```

## Variáveis de ambiente

Configure o arquivo `.env` conforme necessário para apontar para o backend e outros serviços.

Caso trocar a porta externa do container do backend, altere também no .env

## Observações

- O container do frontend expõe a porta 80 internamente, mapeada para a porta 3001 do host.
- O backend e o banco de dados devem estar rodando e acessíveis para o funcionamento completo do sistema.
