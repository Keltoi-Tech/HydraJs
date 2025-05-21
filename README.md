# HydraJs

HydraJs is a library that provides a set of classes to implement the Repository Pattern in your code. By using these classes, you can abstract away the data storage and retrieval logic, making it easier to switch between different data storage systems. It uses `Knex.js`, a popular SQL query builder for Node.js that allows you to build and execute SQL queries in a safe and efficient way. Knex provides a simple and intuitive API for building queries, and supports a wide range of database management systems, including MySQL, PostgreSQL, SQLite, and more.

For more information about Knex.js, including documentation, tutorials, and examples, visit the official Knex.js website.

https://knexjs.org/

For APIContext, HydraJs uses Axios, a popular JavaScript library used for making HTTP requests in Node.js and web applications. It provides a simple and intuitive way to send HTTP requests and interact with web servers.

https://axios-http.com/

**Key Features**
----------------

* **Modular Design**: Hydra.JS is designed to be highly modular, allowing developers to easily add or remove features as needed.
* **Extensible Architecture**: The framework's architecture is designed to be extensible, making it easy to add new features and functionality.
* **Flexible Database Integration**: Hydra.JS provides a flexible way to integrate with various databases, making it easy to switch between different databases as needed.
* **Robust Query Execution**: The framework provides a robust way to execute queries, including support for transactions and batch operations.
* **Efficient Data Management**: Hydra.JS provides an efficient way to manage data, including support for caching and data validation.

## Provided Abstractions
---------

### Entity
-----------

The `Entity` class represents a single entity in your data storage system. It is a fundamental class in the HydraJs library, and it plays a crucial role in representing a single entity in your data storage system.

**Class Definition**

The `Entity` class is defined as follows:
```javascript
Class Entity:
  Fields:
    #key
    #data
  constructor(key = {}, data = {}) {
    this.#data = data;
    this.#key = key;
  }
  Methods:
    key()
    data()
    $()
    migrations()
    structMe(db = knex())
    build({ })
    fromResult(result = new Result())
```
**Fields**

The `Entity` class has two private fields:

* `#key`: This field represents the unique identifier of the entity. It is an object that contains the key-value pairs that uniquely identify the entity.
* `#data`: This field represents the data associated with the entity. It is an object that contains the key-value pairs that represent the entity's data.

**Constructor**

The `Entity` class has a constructor that takes two optional parameters:

* `key`: This parameter is an object that represents the unique identifier of the entity. If not provided, an empty object is used.
* `data`: This parameter is an object that represents the data associated with the entity. If not provided, an empty object is used.

The constructor initializes the `#key` and `#data` fields with the provided values.

**Methods**

The `Entity` class has several methods that provide various functionalities:

* `key()`: This method returns the `#key` field, which represents the unique identifier of the entity.
* `data()`: This method returns the `#data` field, which represents the data associated with the entity.
* `$()`: This method returns a new object that contains the merged `#key` and `#data` fields. This method is useful for creating a single object that represents the entity's data and key.
* `migrations()`: This method is not implemented in the provided code snippet, but it is likely used to handle database migrations for the entity.
* `structMe(db = knex())`: This method takes a `db` parameter, which is an instance of the `knex` library. The method returns a new object that represents the entity's structure.
* `build({ })`: This method takes an object with key-value pairs that represent the entity's data. The method returns a new `Entity` instance with the provided data.
* `fromResult(result = new Result())`: This method takes a `result` parameter, which is an instance of the `Result` class. The method returns a new `Entity` instance with the data from the `result` object.

**Usage**

The `Entity` class can be used to represent a single entity in your data storage system. For example:
```javascript
const entity = new Entity({ id: 1 }, { name: 'John Doe' });
console.log(entity.key()); // Output: { id: 1 }
console.log(entity.data()); // Output: { name: 'John Doe' }
console.log(entity.$()); // Output: { id: 1, name: 'John Doe' }
```
Note that this is just a basic example, and you will need to customize the usage to fit your specific use case.

### Model
------------

The `Model` class is an abstract class that represents a data model. It has a constructor that takes an object with properties that will be used to initialize the model and an abstract method `validate` that can be override to cover specifics validation scenario

### Linking
------------

The `Linking` class represents a relationship between two entities. It has properties for `abscissa` and `ordinate`, which represent the two entities being linked as a cartesian model.

### Repository
-------------

The `Repository` class is an abstract class that provides a set of methods for creating, reading, updating, and deleting entities in a data storage system. It plays several roles in the HydraJS library:

* **Data Abstraction**: The `Repository` class abstracts the data storage and retrieval logic, making it easier to switch between different data storage systems.
* **Entity Management**: The `Repository` class is responsible for managing entities in a data storage system, including creating, reading, updating, and deleting entities.
* **Context Management**: The `Repository` class is responsible for managing the context in which it operates, including database connections, API endpoints, and other data storage systems.

**Class Definition**
--------------------

The `Repository` class is defined as follows:
```javascript
Class Repository:
  Fields:
    #entity
    #context
  constructor(entity = Entity, context = Context) {
    this.#entity = entity;
    this.#context = context;
  }
  Methods:
    create(entity)
    insert(entity)
    get(entity)
    update(entity)
    delete(entity)
    list()
```
**Fields**
----------

The `Repository` class has two private fields:

* `#entity`: This field represents the entity class that the repository is responsible for managing.
* `#context`: This field represents the context in which the repository operates. The context can be a database, an API, or any other data storage system.

**Constructor**
--------------

The `Repository` class has a constructor that takes two optional parameters:

* `entity`: This parameter is the entity class that the repository is responsible for managing. If not provided, the `Entity` class is used by default.
* `context`: This parameter is the context in which the repository operates. If not provided, the `Context` class is used by default.

The constructor initializes the `#entity` and `#context` fields with the provided values.

**Methods**
------------

The `Repository` class provides a set of methods for creating, reading, updating, and deleting entities in a data storage system:

* `include(entity)`: This method includes an entity in the data storage system.
* `create(entity)`: This method includes a new entity in the data storage system and returns the new `key` created in database. The difference between `include` and `create` is that the first one entry a new data in storage system, and is accountable for manages it's ids on database, so it can includes an autoincrement key and retrieve the created id.
* `get(entity)`: This method retrieves an entity from the data storage system based on its unique identifier, structured by `key` property.
* `update(entity)`: This method updates an existing entity in the data storage system, structured by `key` property.
* `delete(entity)`: This method deletes an entity from the data storage system based on its unique identifier, structured by `key` property.
* `list`: This method retrieves all elements of a data storage entity.

**Usage**
---------

The `Repository` class can be used to create a repository for managing entities in a data storage system. For example:
```javascript
const repository = new Repository(Entity, Context);
const entity = new Entity({ id: 'f47ac10b-58cc-43e8-9b9a-8f8f9f9f9f9f' }, { name: 'Cthulhu da Silva' });

await repository.create(entity);
//created {id:'f47ac10b-58cc-43e8-9b9a-8f8f9f9f9f9f', name:'Cthulhu da Silva'} in Entity table

const retrievedEntity = await repository.get(entity);
//retrieves {id:'f47ac10b-58cc-43e8-9b9a-8f8f9f9f9f9f', name:'Cthulhu da Silva'} from Entity table

retrievedEntity.changeName('Cthulhu de Souza')

await repository.update(entity);
//Now changes from 'Cthulhu da Silva' name to 'Cthulhu de Souza'

await repository.delete(entity);
//Removes {id:'f47ac10b-58cc-43e8-9b9a-8f8f9f9f9f9f', name:'Cthulhu de Souza'} from database

```
Note that this is just a basic example, and you will need to customize the usage to fit your specific use case.

### Context
------------

The `Context` class represents a database context and is responsible for managing the database connection, executing queries, and handling transactions. It can be extended by two classes `ApiContext` and `DbContext`

### Api Context ###
--------------------

The `ApiContext` class is defined as follows:
```javascript
Class Context:
  Fields:
    #http
  constructor(config = axios.create({})) {
    this.#http = config;
  }
  Methods:
    http()
```
**Fields**
----------

The `ApiContext` class has one private field:

* `#http`: This field represents the HTTP client instance used to execute queries.

**Constructor**
--------------

The `ApiContext` class has a constructor that takes an optional `config` parameter:

* `config`: This parameter is an object that configures the HTTP client instance using `axios`. If not provided, a default configuration is used.

The constructor initializes the `#http` field with the provided configuration.

**Methods**
------------

The `ApiContext` class provides one method:

* `http()`: This method returns the HTTP client instance used to execute queries.

**Axios Configuration**
----------------------

The `ApiContext` class uses the `axios` library to create an HTTP client instance. You can configure the HTTP client instance by passing a `config` object to the constructor.

For example:
```javascript
const config = {
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
};
const context = new ApiContext(config);
```

### DbContext ###
------------

The `DbContext` class is defined as follows:
```javascript
Class DbContext:
  Fields:
    #db
  constructor(database=knex()) {
    this.#db = database
  }
  Methods:
    db()
    unitOfWork(...repositories)
    terraform(models = [Model])
```

**Constructor**
--------------

The `DbContext` class has a constructor that takes a `database` parameter:

* `database`: This parameter is Knex.js instance.

**Methods**
------------

The `Context` class provides several methods:

* `db()`: This method returns the database instance used to execute queries.
* `unitOfWork(...repositories)`: This method creates a unit of work that can be used to execute multiple queries in a single transaction.
* `terraform(models = [Model])`: This method define initial state of database and execute table migrations.

**Knex.js Configuration**
-------------------------

The `DbContext` class uses the `knex` library to create a Knex.js instance. You can configure the Knex.js instance by passing a `knexConfig` instance to the constructor of `knex`.

For example:
```javascript
const knexConfig = {
  client: 'pg',
  connection: 'postgresql://user:password@host:port/database',
  migrations: {
    directory: './migrations',
  },
};

const database = knex(knexConfig)
const context = new DbContext(database);
```
This configuration sets the database client, connection string, and migration directory for the Knex.js instance.

**UnitOfWork**
-------------

**Method Signature**
--------------------

`unitOfWork(...repositories)`

The `unitOfWork` method creates a unit of work that can be used to execute multiple queries in a single transaction. The method takes one or more `Repository` instances as arguments.

For example:
```javascript
const userRepository = new UserRepository(context);
const orderRepository = new OrderRepository(context);
const tx = await context.unitOfWork(userRepository, orderRepository);
```
**Parameters**
--------------

* `repositories`: A variable number of repository objects that will be used to execute queries within the unit of work.

**Return Type**
--------------

The `unitOfWork` method returns an object with two methods: `done` and `rollback`.


**Example Usage**
-----------------

```javascript
const unitOfWork = context.unitOfWork(repo1, repo2);

// Execute queries on the repositories
repo1.create({ name: 'John Doe' });
repo2.create({ userId: 1, total: 100 });

// Commit the transaction
unitOfWork.done().then(() => {
  console.log('Transaction committed');
});

// Alternatively, roll back the transaction
unitOfWork.rollback().then(() => {
  console.log('Transaction rolled back');
});
```
**Terraform**
-------------

The `terraform` method creates initial database state of every `Model` type passed by parameters and execute eventual database migrations. The method takes an array of types based on `Model` as an argument.

For example:
```javascript

await context.terraform([UserModel, OrderModel]);
```
This code creates initial state on database and execute database migrations for the `User` and `Order` tables.

