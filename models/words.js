class Unit {
    constructor(which) {
        this.words = [];
        this.which = which;
    }
    add(word) {
        this.words.push(word);
    }
    unit() {
        return this.which;
    }
    print() {
        console.log(this.words);
    }
}

class Book {
    constructor(name) {
        this.name = name;
        this.units = [];
    }
    add(unit) {
        this.units.add(unit);
    }
}

module.exports.Unit = Unit;
module.exports.Book = Book;