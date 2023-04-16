# Http Bounded Context

Abstração e desacoplamento de Frameworks HTTP em uma aplicação Node.Js

### Referencial teórico

### Bounded context

> Um [bounded context](https://martinfowler.com/bliki/BoundedContext.html) é uma parte definida do software em que determinados termos, definições e regras se aplicam de forma consistente
> ”Eric Evans” - Domain Driven Design

### Liskov Substitution Principle

O princípio define que objetos de uma superclasse devem ser substituíveis por objetos de suas subclasses sem quebrar a aplicação. Isso requer que os objetos de suas subclasses se comportem da mesma maneira que os objetos de sua superclasse.

Um método sobrescrito de uma subclasse precisa aceitar os mesmos valores de parâmetro de entrada que o método da superclasse. Isso significa que você pode implementar regras de validação menos restritivas, mas não tem permissão para impor regras mais rígidas em sua subclasse.

Regras semelhantes se aplicam ao valor de retorno do método. O valor de retorno de um método da subclasse precisa obedecer às mesmas regras que o valor de retorno do método da superclasse.

### GOF/FC Design Patterns

- Adapter
- HOFs
- Template Method
- Command/Lambda functions

## Open Closed Principle

Estabelece que "_entidades de software (classes, módulos, funções, etc.) devem ser abertas para extensão, mas fechadas para modificação_"; isto é, a entidade pode permitir que o seu comportamento seja estendido sem modificar seu código fonte.

# Contrato Http

A api principal baseia-se fortemente na implementação de um servidor Http presente no microframework Restify. A entidade Server descreve o contrato disponível para a implementação de aplicações e adaptadores:

```typescript
type HttpErrorFn = (request: HttpRequest, response: HttpResponse, error: Error) => HttpResponse;
export interface ServerOptions {
  uploadDir?: string;
}
class Server {
  constructor(options: ServerOptions) {}
  listen(port: number, callback: () => void): void; // Responsável por iniciar o servidor Http
  close(): Promise<void>; // Responsável por encerrar o servidor Http
  setErrorHandler(onError: HttpErrorFn); // Define uma função global para tratativa de erros
  get(path: string, ...middlewares: Array<HttpHandler>); // Tratativa de endpoints get
  post(path: string, ...middlewares: Array<HttpHandler>); // Tratativa de endpoints post
  put(path: string, ...middlewares: Array<HttpHandler>); // Tratativa de endpoints put
  patch(path: string, ...middlewares: Array<HttpHandler>); // Tratativa de endpoints patch
  del(path: string, ...middlewares: Array<HttpHandler>); // Tratativa de endpoints delete
  opts(path: string, ...middlewares: Array<HttpHandler>); // Tratativa de endpoints options
}
```

## Recursos adicionais

### Módulo de tratativa de cookies e headers

Os objetos **Request** e **Response** possuem funções para simplificar a adição e manipulação de headers e cookies:

```typescript
setCookie(name: string, value: string, options?: CookieSerializeOptions) : void;
getCookie(name): string | undefined;
setHeader(name: string, value: string): void;
getHeader(name: string): string | string[] | undefined;
```

# Uso dos adaptadores

## RestifyServerAdapter

Implementação do contrato utilizando como base a infraestrutura Restify v10.x. Além das opções de configuração da classe base Server, recebe também opções adicionais exclusivas do framework, são estas:

```typescript
type RestifyServerAdapterOptions = RestifyOptions & {
  corsOptions: Options; // Opções de cors no modelo presente no plugin restify-cors-middleware2
  mapBodyToParams: boolean; // Realiza o mapeamento de atributos vindos do corpo da requisição para request.params
  mapQueryToParams: boolean; // Realiza o mapeamento de atributos vindos como parâmetros de busca da requisição para request.params
};
```

Exemplo de uso:

```typescript
import { RestifyServerAdapter } from 'http-bounded-context-lib/lib/adapters/restify';

const app = new RestifyServerAdapter(
  {},
  {
    corsOptions: {
      origins: [/(https?:\/\/)?((www|local)\.)?sample-site\.com(\.br)?/],
      allowHeaders: ['custom-header'],
    },
  }
);

app.setErrorHandler((request, response, error) => {
  let status = 500;
  let errorCode = 'sampleApi:unknown';
  if (error instanceof AppError) {
    status = error.status;
    errorCode = error.errorCode;
  }
  console.error(`[${status}] ${request.url} - ${error.message}`);
  response.statusCode = status;
  return response.json({
    error: error.message,
    errorCode,
  });
});

server.get('/', async (request, response) => {
  return response.json(request);
});

const port = 3333;
app.listen(port, () => {
  console.log(`Api is listening, ${port} is the magic port!`);
});
```
