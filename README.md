# Payment Gateway Service

Este é um microserviço de gateway de pagamento escrito em NodeJS com Express que trabalha em conjunto com o serviço de checkout escrito em Java Spring para processar pagamentos de pedidos. O serviço utiliza RabbitMQ para comunicação assíncrona e implementa um sistema de retry para garantir a resiliência do processamento.

## Tecnologias Utilizadas

- Node.js
- Express
- RabbitMQ
- Jest (testes)
- Docker (opcional)

## Pré-requisitos

- Node.js v16 ou superior
- npm v8 ou superior
- RabbitMQ 3.9 ou superior
- Docker & Docker Compose (opcional)

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/your-username/payment-gateway
cd payment-gateway
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
AMQP_URL=amqp://localhost
NODE_ENV=development
```

## Executando com Docker

1. Inicie o RabbitMQ:
```bash
docker run -d --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:management
```

2. Build e execução do serviço:
```bash
docker build -t payment-gateway .
docker run -d --name payment-gateway \
  --env-file .env \
  --link rabbitmq \
  payment-gateway
```

## Executando Localmente

1. Certifique-se que o RabbitMQ está rodando localmente ou via Docker

2. Inicie o serviço:
```bash
# Modo desenvolvimento (com hot-reload)
npm run dev

# Modo produção
npm start
```

## Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes com watch mode
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## Estrutura do Projeto

```
payment-gateway/
├── src/
│   ├── config/
│   │   └── rabbitmq.js
│   ├── services/
│   │   └── paymentService.js
│   └── index.js
├── tests/
│   ├── unit/
│   └── integration/
├── .env
├── .gitignore
└── package.json
```

## Funcionalidades

- Processamento assíncrono de pagamentos
- Sistema de retry automático (3 tentativas)
- Timeout de 5 segundos para processamento
- Logs detalhados de operações
- Health check endpoint
- Tratamento robusto de erros

## Endpoints da API

### Health Check
```http
GET /health
```

Resposta de Sucesso:
```json
{
  "status": "UP"
}
```

## Integração com RabbitMQ

O serviço usa as seguintes filas e exchanges:

- Exchange: `payment_exchange`
- Filas:
  - `payment_request_queue`: Recebe requisições de pagamento
  - `payment_result_queue`: Envia resultados de processamento

### Formato das Mensagens

Requisição de Pagamento:
```json
{
  "id": "123",
  "amount": 100.00,
  "customerEmail": "customer@example.com"
}
```

Resposta de Pagamento:
```json
{
  "orderId": "123",
  "success": true,
  "transactionId": "tx_abc123",
  "errorMessage": null
}
```

## Monitoramento

O serviço fornece logs detalhados de todas as operações. Os logs incluem:
- Tentativas de processamento de pagamento
- Erros de comunicação com RabbitMQ
- Timeouts e retries
- Resultados de processamento

## Troubleshooting

### RabbitMQ não conecta
1. Verifique se o RabbitMQ está rodando:
```bash
docker ps | grep rabbitmq
```

2. Verifique os logs do RabbitMQ:
```bash
docker logs rabbitmq
```

3. Verifique se a URL do RabbitMQ está correta no `.env`

### Erros nos Testes
1. Limpe o cache do Jest:
```bash
npm test -- --clearCache
```

2. Verifique se todas as dependências estão instaladas:
```bash
npm install
```