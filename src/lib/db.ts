import Dexie, { Table } from 'dexie';

export interface Product {
  id?: number;
  nama: string;
  kode: string;
  penerbit: string;
  kategori: string;
  lokasi: string;
  hargaModal: number;
  hargaJual: number;
  stok: number;
  deskripsi?: string;
  updatedAt: number;
}

export interface Category {
  id?: number;
  nama: string;
}

export interface Publisher {
  id?: number;
  nama: string;
}

export interface Location {
  id?: number;
  nama: string;
}

export interface Staff {
  id?: number;
  nama: string;
  jabatan: string;
  phone: string;
  status: string;
  updatedAt: number;
}

export class TokoMekkahDatabase extends Dexie {
  products!: Table<Product>;
  categories!: Table<Category>;
  publishers!: Table<Publisher>;
  locations!: Table<Location>;
  staff!: Table<Staff>;

  constructor() {
    super('TokoMekkahDB');
    this.version(5).stores({
      products: '++id, nama, kode, kategori, penerbit, updatedAt',
      categories: '++id, &nama',
      publishers: '++id, &nama',
      locations: '++id, &nama',
      staff: '++id, nama, jabatan, phone'
    });
  }
}

export const db_local = new TokoMekkahDatabase();
