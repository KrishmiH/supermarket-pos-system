using MongoDB.Driver;
using Pos.Api.Dtos;
using Pos.Api.Models;

namespace Pos.Api.Services
{
    public class SaleService
    {
        private readonly IMongoCollection<Sale> _sales;
        private readonly IMongoCollection<Product> _products;

        public SaleService(IMongoDatabase db)
        {
            _sales = db.GetCollection<Sale>("Sales");
            _products = db.GetCollection<Product>("Products");
        }

        private static string NewReceiptNo()
        {
            // Example: R-20260116-153045-1234
            var rand = Random.Shared.Next(1000, 9999);
            return $"R-{DateTime.UtcNow:yyyyMMdd-HHmmss}-{rand}";
        }

        public async Task<Sale> CreateSaleAsync(SaleCreateDto dto)
        {
            if (dto.Items == null || dto.Items.Count == 0)
                throw new ArgumentException("Cart is empty.");

            // 1) Build sale items by looking up products by barcode
            var saleItems = new List<SaleItem>();

            foreach (var reqItem in dto.Items)
            {
                if (string.IsNullOrWhiteSpace(reqItem.Barcode))
                    throw new ArgumentException("Barcode is required.");

                if (reqItem.Qty <= 0)
                    throw new ArgumentException("Quantity must be > 0.");

                var product = await _products
                    .Find(p => p.Barcode == reqItem.Barcode && p.IsActive)
                    .FirstOrDefaultAsync();

                if (product == null)
                    throw new KeyNotFoundException($"Product not found for barcode: {reqItem.Barcode}");

                if (product.Stock < reqItem.Qty)
                    throw new InvalidOperationException($"Not enough stock for {product.Name}. Available: {product.Stock}");

                var lineTotal = product.Price * reqItem.Qty;

                saleItems.Add(new SaleItem
                {
                    ProductId = product.Id,
                    Barcode = product.Barcode,
                    Name = product.Name,
                    UnitPrice = product.Price,
                    Qty = reqItem.Qty,
                    LineTotal = lineTotal
                });
            }

            // 2) Calculate totals
            var subTotal = saleItems.Sum(i => i.LineTotal);
            var discount = dto.Discount < 0 ? 0 : dto.Discount;
            if (discount > subTotal) discount = subTotal;

            var taxable = subTotal - discount;
            var taxRate = dto.TaxRate < 0 ? 0 : dto.TaxRate;
            var taxAmount = Math.Round(taxable * taxRate, 2);

            var grandTotal = taxable + taxAmount;

            // 3) Deduct stock (important!)
            foreach (var i in saleItems)
            {
                var update = Builders<Product>.Update
                    .Inc(p => p.Stock, -i.Qty)
                    .Set(p => p.UpdatedAt, DateTime.UtcNow);

                var res = await _products.UpdateOneAsync(p => p.Id == i.ProductId, update);

                if (res.ModifiedCount == 0)
                    throw new InvalidOperationException("Stock update failed.");
            }

            // 4) Save sale record
            var sale = new Sale
            {
                ReceiptNo = NewReceiptNo(),
                CashierName = string.IsNullOrWhiteSpace(dto.CashierName) ? "Cashier" : dto.CashierName.Trim(),
                PaymentMethod = string.IsNullOrWhiteSpace(dto.PaymentMethod) ? "CASH" : dto.PaymentMethod.Trim().ToUpper(),
                Items = saleItems,
                SubTotal = subTotal,
                Discount = discount,
                TaxRate = taxRate,
                TaxAmount = taxAmount,
                GrandTotal = grandTotal,
                CreatedAt = DateTime.UtcNow
            };

            await _sales.InsertOneAsync(sale);
            return sale;
        }

        public async Task<List<Sale>> GetRecentSalesAsync(int limit = 20)
        {
            return await _sales.Find(_ => true)
                .SortByDescending(s => s.CreatedAt)
                .Limit(limit)
                .ToListAsync();
        }

        public async Task<decimal> GetTodayRevenueAsync()
        {
            var start = DateTime.UtcNow.Date;
            var end = start.AddDays(1);

            var filter = Builders<Sale>.Filter.Gte(s => s.CreatedAt, start)
                        & Builders<Sale>.Filter.Lt(s => s.CreatedAt, end);

            var sales = await _sales.Find(filter).ToListAsync();
            return sales.Sum(s => s.GrandTotal);
        }

        public async Task<Sale?> GetByIdAsync(string id)
        {
            return await _sales.Find(s => s.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Sale?> GetByReceiptNoAsync(string receiptNo)
        {
            return await _sales.Find(s => s.ReceiptNo == receiptNo).FirstOrDefaultAsync();
        }
    }
}
