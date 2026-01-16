using MongoDB.Driver;
using Pos.Api.Models;

namespace Pos.Api.Services
{
    public class ProductService
    {
        private readonly IMongoCollection<Product> _products;

        public ProductService(IMongoDatabase db)
        {
            _products = db.GetCollection<Product>("Products");
        }

        public async Task<List<Product>> GetAllAsync()
            => await _products.Find(_ => true).ToListAsync();

        public async Task<Product?> GetByIdAsync(string id)
            => await _products.Find(p => p.Id == id).FirstOrDefaultAsync();

        public async Task<Product?> GetByBarcodeAsync(string barcode)
            => await _products.Find(p => p.Barcode == barcode).FirstOrDefaultAsync();

        public async Task<List<Product>> SearchAsync(string query)
        {
            query = query.Trim();

            // Search by name OR barcode OR category (case-insensitive)
            var filter = Builders<Product>.Filter.Or(
                Builders<Product>.Filter.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(query, "i")),
                Builders<Product>.Filter.Regex(p => p.Barcode, new MongoDB.Bson.BsonRegularExpression(query, "i")),
                Builders<Product>.Filter.Regex(p => p.Category, new MongoDB.Bson.BsonRegularExpression(query, "i"))
            );

            return await _products.Find(filter).Limit(50).ToListAsync();
        }

        public async Task<Product> CreateAsync(Product product)
        {
            await _products.InsertOneAsync(product);
            return product;
        }

        public async Task<bool> UpdateAsync(string id, Product updated)
        {
            updated.UpdatedAt = DateTime.UtcNow;
            var result = await _products.ReplaceOneAsync(p => p.Id == id, updated);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _products.DeleteOneAsync(p => p.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
