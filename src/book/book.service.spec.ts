import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  describe('get', () =>{
    it("should return an empty object by default", () => {
      const books = service.getBooks();
      expect(books).toEqual([]);
    });
    it("should return undefined if book doesn't exist", () => {
      const book = service.getBook({title: 'test', author: 'is', published: '1924'});
      expect(book).toBeUndefined();
    });
  });
  describe('create', () =>{
    it('should return a single book after create', () => {
      service.publishBook({title: 'test', author: 'book', published: '1924'});
      const todos = service.getBooks();
      expect(todos).toEqual([{title: 'test', author: 'book', published: '1924'}]);
    });

    it('should return two books after create', () => {
      service.publishBook({title: 'test', author: 'book', published: '1924'});
      service.publishBook({title: 'another', author: 'test', published: '1925'});
      const todos = service.getBooks();
      expect(todos).toEqual([{title: 'test', author: 'book', published: '1924'},{title: 'another', author: 'test', published: '1925'}]);
    });

    it("should throw bad request if the book publish date isNaN", () => {
      expect(
        () => service.publishBook({title: 'test', author: 'book', published: 'here'})
      ).toThrow(BadRequestException);
    });
    it("should return 'Book created!' and 'This book already exists!'", () => {
      const book1 = service.publishBook({title: 'test', author: 'book', published: '1924'});
      const book2 = service.publishBook({title: 'test', author: 'book', published: '1924'});
      expect(book1).toEqual("Book created!");
      expect(book2).toEqual("This book already exists!");
    });
  });
  describe('update', () => {
    it('should update a given book to the correct value', () => {
      service.publishBook({title: 'test', author: 'failed', published: '1924'});
      service.publishBook({title: 'test', author: 'book', published: '1987'});
      service.updateBook({title: 'test', author: 'passed', published: '1924'}, {title: 'test', author: 'failed', published: '1924'});
      const todos = service.getBooks();
      expect(todos).toEqual([{title: 'test', author: 'passed', published: '1924'},{title: 'test', author: 'book', published: '1987'}]);
    });
    it('should return not found if given a book that does not exist', () => {
      expect(() => {
        service.updateBook({title: 'test', author: 'book', published: '1924'}, {title: 'test', author: 'booooook', published: '1924'});
      }).toThrow(NotFoundException);
    });
    it('should return the updated book after update', () => {
      service.publishBook({title: 'test', author: 'failed', published: '1924'});
      const updatedTodo = service.updateBook({title: 'test', author: 'passed', published: '1924'}, {title: 'test', author: 'failed', published: '1924'});
      expect(updatedTodo).toEqual({title: 'test', author: 'passed', published: '1924'});
    });
    it('should return the updated book with getBooks after update', () => {
      const todo = service.publishBook({title: 'test', author: 'failed', published: '1924'});
      service.updateBook({title: 'test', author: 'passed', published: '1924'}, {title: 'test', author: 'failed', published: '1924'});
      expect(service.getBooks()).toEqual([{title: 'test', author: 'passed', published: '1924'}]);
    });
  });
  describe('delete', () => {
    it('should delete the existing book', () => {
      service.publishBook({title: 'test', author: 'book', published: '1924'});
      service.publishBook({title: 'test', author: 'not', published: '1924'});
      service.publishBook({title: 'test', author: 'passed', published: '1924'});

      service.deleteBook({title: 'test', author: 'not', published: '1924'});

      expect(service.getBooks()).toEqual([
        { title: 'test', author: 'book', published: '1924' },
        { title: 'test', author: 'passed', published: '1924' }
      ])
    });
    it('should throw NotFoundException, if did not find a book', () => {
      expect(
        () => service.deleteBook({ title: "test", author: "passed", published: "1924" })
      ).toThrow(NotFoundException);
    });
  });
});
