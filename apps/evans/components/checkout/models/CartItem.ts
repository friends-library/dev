import { price } from '@friends-library/lulu';
import type { EditionType, PrintSize } from '@friends-library/types';

export interface CartItemData {
  editionId: UUID;
  displayTitle: string;
  title: string;
  edition: EditionType;
  quantity: number;
  printSize: PrintSize;
  isbn: string;
  isCompilation: boolean;
  customCss?: string;
  customHtml?: string;
  numPages: [number, ...number[]];
  author: string;
}

export default class CartItem {
  public displayTitle: string;
  public title: string;
  public editionId: UUID;
  public edition: EditionType;
  public quantity: number;
  public printSize: PrintSize;
  public numPages: [number, ...number[]];
  public author: string;
  public isbn: string;
  public isCompilation: boolean;
  public customCss?: string;
  public customHtml?: string;

  public constructor(config: CartItemData) {
    this.displayTitle = config.displayTitle;
    this.title = config.title;
    this.editionId = config.editionId;
    this.edition = config.edition;
    this.quantity = config.quantity;
    this.printSize = config.printSize;
    this.numPages = config.numPages;
    this.author = config.author;
    this.isbn = config.isbn;
    this.isCompilation = config.isCompilation;
    this.customCss = config.customCss;
    this.customHtml = config.customHtml;
  }

  public printJobTitle(): string {
    let title = this.title;
    if (this.edition !== `updated`) {
      title += ` (${this.edition})`;
    }
    return title;
  }

  public price(): number {
    return price(this.printSize, this.numPages);
  }

  public equals(other: CartItem): boolean {
    return this.editionId === other.editionId && this.edition === other.edition;
  }

  public toJSON(): CartItemData {
    return {
      displayTitle: this.displayTitle,
      title: this.title,
      author: this.author,
      editionId: this.editionId,
      edition: this.edition,
      quantity: this.quantity,
      printSize: this.printSize,
      numPages: this.numPages,
      isbn: this.isbn,
      isCompilation: this.isCompilation,
      customCss: this.customCss,
      customHtml: this.customHtml,
    };
  }
}
