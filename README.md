# Http Bounded Context

Abstração e desacoplamento de Frameworks HTTP em uma aplicação Node.Js

## Bounded context

> Um [bounded context](https://martinfowler.com/bliki/BoundedContext.html) é uma parte definida do software em que determinados termos, definições e regras se aplicam de forma consistente
”Eric Evans” - Domain Driven Design
> 

## Liskov Substitution Principle

O princípio define que objetos de uma superclasse devem ser substituíveis por objetos de suas subclasses sem quebrar a aplicação. Isso requer que os objetos de suas subclasses se comportem da mesma maneira que os objetos de sua superclasse.

Um método sobrescrito de uma subclasse precisa aceitar os mesmos valores de parâmetro de entrada que o método da superclasse. Isso significa que você pode implementar regras de validação menos restritivas, mas não tem permissão para impor regras mais rígidas em sua subclasse.

Regras semelhantes se aplicam ao valor de retorno do método. O valor de retorno de um método da subclasse precisa obedecer às mesmas regras que o valor de retorno do método da superclasse.

## GOF/FC Design Patterns

- Adapter
- HOFs
- Template Method
- Command/Lambda functions
- Dependency inversion
- Maintaining SOLID principles with HttpControllers
- Extras:
    - Abstract Factories
    - Value Objects

## Open Closed Principle

Estabelece que "*entidades de software (classes, módulos, funções, etc.) devem ser abertas para extensão, mas fechadas para modificação*"; isto é, a entidade pode permitir que o seu comportamento seja estendido sem modificar seu código fonte.

### Referências

[Design Patterns: Elements of Reusable Object-Oriented Software](https://www.amazon.com.br/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)

[Domain-Driven Design: Tackling Complexity in the Heart of Software](https://www.amazon.com.br/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215)

[Clean Architecture: A Craftsman's Guide to Software Structure and Design (Robert C. Martin Series) (English Edition)](https://www.amazon.com.br/Clean-Architecture-Craftsmans-Software-Structure-ebook/dp/B075LRM681/ref=sr_1_1?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1SEAH4964Q12X&keywords=clean+architecture&qid=1642165218&sprefix=clean+architecture%2Caps%2C183&sr=8-1&ufe=app_do%3Aamzn1.fos.4bddec23-2dcf-4403-8597-e1a02442043d)

[Patterns of Enterprise Application Architecture](https://www.amazon.com.br/Patterns-Enterprise-Application-Architecture-Martin/dp/0321127420)

## Instruções para execução do projeto exemplo:

```
mv .env.sample .env
docker-compose up -d
npm i
npm run dev:migrations run
npm run dev:server
```