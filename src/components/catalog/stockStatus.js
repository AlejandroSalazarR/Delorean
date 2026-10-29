export const STOCK_STATUS = {
  in_stock: { label: 'En Stock', className: 'bg-white/90 text-[#111111]' },
  preorder: { label: 'Preventa Exclusiva', className: 'bg-[#FF6B00] text-white' },
  low_stock: { label: 'Últimas Unidades', className: 'bg-[#111111] text-white' },
  sold_out: { label: 'Agotado', className: 'bg-white/90 text-[#111111]/50' },
}

export const isSoldOut = (product) => product.stockStatus === 'sold_out'
