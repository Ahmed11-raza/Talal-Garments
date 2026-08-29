export interface ColorType {
  name: string;
  hex: string;
}

export interface AddressType {
  street: string;
  city: string;
  province: string;
  postalCode?: string;
}

export interface CustomerType {
  name: string;
  phone: string;
  email?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid'
