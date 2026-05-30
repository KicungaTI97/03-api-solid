class Pessoa {
  constructor(name){
    this.name = name;
  }

  greeting() {
    console.log(`My name is ${this.name}`)
  }
}

const pessoa1 = new Pessoa("João")
console.log(pessoa1.greeting())