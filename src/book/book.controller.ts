import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BookService } from "./book.service";
import { Books } from "./book.model";

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBooks(){
    return this.bookService.getBooks();
  }

  @Get('/:book')
  getBook(@Param('book') book: Books){
    return this.bookService.getBook(book);
  }

  @Post()
  publishBook(@Body() book: Books ){
    return this.bookService.publishBook(book);
  }

  @Put('/:book')
  updateBook(@Body() updatedBook: Books, @Param('book') book: Books){
    return this.bookService.updateBook(updatedBook, book);
  }

  @Delete('/del/:book')
  deleteBook(@Param('book') book: Books){
    return this.bookService.deleteBook(book);
  }
}
