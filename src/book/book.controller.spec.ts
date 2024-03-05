import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import mock = jest.mock;

describe('BookController', () => {
  let controller: BookController;
  let mockBookService: BookService;

  beforeEach(async () => {
    mockBookService = {} as BookService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [{
        provide: BookService,
        useValue: mockBookService
      }],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  describe('get', () =>{
    it('should return the list of books returned by bookService.getBooks()',()=> {
      mockBookService.getBooks = () =>[{title: 'test', author: 'book', published: '1924'}];
      const books = controller.getBooks();
      expect(books).toEqual([{title: 'test', author: 'book', published: '1924'}]);
    });
  });
  describe('create', () =>{
    it('should return the single book returned by bookService.publishBook()', () => {
      mockBookService.publishBook = () => ("Book created!");
      const book = controller.publishBook({title: 'test', author: 'book', published: '1924'});
      expect(book).toEqual("Book created!");
    });
  });
  describe('update', () =>{
    it('should update and return the updated todo', () => {
      mockBookService.publishBook = () => ("Book created!");
      mockBookService.updateBook = () => ({title: 'test', author: 'passed', published: '1924'});
      controller.publishBook({title: 'test', author: 'failed', published: '1924'});
      const update = controller.updateBook({title: 'test', author: 'passed', published: '1924'},{title: 'test', author: 'book', published: '1924'});
      expect(update).toEqual({title: 'test', author: 'passed', published: '1924'});
    });
  });
});
