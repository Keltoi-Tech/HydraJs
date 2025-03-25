# HydraJs Boilerplate

A starting point for building APIs using the Repository Pattern.

## Features

* Repository Pattern architecture
* Support for Knex.js database operations
* Axios for HTTP requests
* Rollup for bundling and minification

## Getting Started

1. Clone the repository: `git clone https://github.com/Keltoi-Tech/HydraJs.git`
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Start the API: `node index.js`


## Overview
------------

The `model` represents the domain model. This class is responsible for defining the structure and behavior of the data used by the application.



## Folder Structure
---------------------

* `index.js`: The main entry point for the model folder, which exports the various models and interfaces.
* `thing.js`: Represents a thing entity, which is a basic building block of the domain model.
* `logged.js`: Represents a logged entity, which extends the thing entity and adds additional properties and behavior.
* `linking.js`: Represents a linking entity, which defines the relationships between things.
* `interfaces`: Contains interface definitions for the models, which are used to define the structure and behavior of the data.

## Models
----------

### Model





# Model Entity Documentation
=====================================

## Overview
------------

The `Model` entity is a fundamental component of the application's domain model. It represents a basic entity that can be used to define the structure and behavior of data in the application.

## Features
------------

The `Model` entity has the following features:

* **Id**: A unique identifier for the entity.
* **Key**: A set of key-value pairs that define the entity's properties.
* **Entity**: A method that returns the entity's data as a JSON object.
* **Build**: A method that creates a new instance of the entity.

## Structure
-------------

The `Model` entity has the following structure:

```javascript
class Model {
  #key;

  constructor(key = {}) {
    this.#key = key;
  }

  key() {
    return this.#key;
  }

  key(value = {}) {
    this.#key = value;
  }

  entity() {
    return {};
  }

  build(key = {}) {
    return new Model(key);
  }
}
```

## Properties
-------------

The `Model` entity is the base of any data persistence representation. 

* **#key**: An object that stores the entity's key in repository, which can be a database or 
an external api. It must returns and stores the exactly format keys are stored on you databse/api

* **entity()**: Returns data the exactly way they are recorded on database/api. Entity must be written 
as a JSON object that corresponds fields in database/api used as repository

* **build(key={})**:  Used as Factory to build new instance of a model, it must receive an object that 
corresponds the exactly structure returned by database/api


## Usage
---------

To use the `Model` entity, simply extend it with your own entity class.

```javascript
class MyEntity extends Model {
  // ...
  #name
  #id
  
  constructor({name='',id=0}){
    //informs model that {id} is the database key
    super({id})
  }

  static build({name,id}){
    return new MyEntity({name,id})
  }

  entity(){
    return {
        name:this.#name
    }
  }

  get name(){return this.#name}
  set name(value=''){this.#name = name}

  //id is already getted/setted by 'key' inherited attribute

}
```

You can then use the `MyEntity` class to create new instances of the entity.

```javascript
const myEntity = new MyEntity();
```

You can also use the `build` method to create new instances of the entity.

```javascript
const myEntity = MyEntity.build();
```

### Thing

The `thing.js` file defines the `Thing` model, which represents a basic entity in the domain model. The `Thing` model has the following properties:

* `id`: A unique identifier for the thing.
* `name`: The name of the thing.

The `Thing` model also defines several methods for working with things, including:

* `makeMe`: Creates a new thing instance.
* `entity`: Returns the thing's entity data.

### Logged

The `logged.js` file defines the `Logged` model, which extends the `Thing` model and adds additional properties and behavior. The `Logged` model has the following properties:

* `createdAt`: The date and time when the logged entity was created.
* `updatedAt`: The date and time when the logged entity was last updated.
* `active`: A boolean indicating whether the logged entity is active or not.

The `Logged` model also defines several methods for working with logged entities, including:

* `makeMe`: Creates a new logged instance.
* `entity`: Returns the logged entity's entity data.

### Linking

The `linking.js` file defines the `Linking` model, which represents a relationship between two things. The `Linking` model has the following properties:

* `abscissa`: The thing that is being linked to.
* `ordinate`: The thing that is being linked from.

The `Linking` model also defines several methods for working with linkings, including:

* `makeMe`: Creates a new linking instance.
* `entity`: Returns the linking's entity data.

## Interfaces
--------------

The `interfaces` folder contains interface definitions for the models, which are used to define the structure and behavior of the data. The interfaces are used to ensure that the models conform to a specific contract, making it easier to work with the data and ensuring that the data is consistent.

## Conclusion
----------

The `model` folder is a critical component of the application, providing the business logic and domain model for the application. By following the Ports and Adapters architecture approach, the `model` folder is able to separate the business logic from the infrastructure and presentation layers, making the code more modular, testable, and maintainable.

## Contributing

* [Contribution guidelines](#contributing)

## License

* [MIT License](#license)