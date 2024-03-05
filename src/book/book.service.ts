import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Books } from "./book.model";

@Injectable()
export class BookService {
  private readonly books: Books[] = [];

  public getBooks(){
    return this.books;
  }

  public getBook(input: Books){
    return this.books.find(book =>
      book.title === input.title
      &&
      book.author === input.author
      &&
      book.published === input.published
    );
  }

  public publishBook(book: Books){
    if (isNaN(parseInt(book.published))){
      throw new BadRequestException();
    }else if (this.books.findIndex(currentBook =>
      currentBook.title === book.title
      &&
      currentBook.author === book.author
      &&
      currentBook.published === book.published
    ) !== -1){
      return "This book already exists!";
    }else {
      this.books.push(book);
      return "Book created!";
    }
  }

  public updateBook(updatedBook: Books, book: Books){
    for (const currentBook of this.books) {
      if (
        currentBook.title === book.title
        &&
        currentBook.author === book.author
        &&
        currentBook.published === book.published
      ){
        Object.assign(currentBook, updatedBook);
        return currentBook;
      }
    }
    throw new NotFoundException();
  }

  public deleteBook(book: Books){
    const index = this.books.findIndex(currentBook=>
      currentBook.title === book.title
      &&
      currentBook.author === book.author
      &&
      currentBook.published === book.published
    );
    if (index === -1){
      throw new NotFoundException();
    }
    this.books.splice(index, 1);
  }
}
