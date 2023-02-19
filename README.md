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
