using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Pos.Api.Models
{
    public class SaleItem
    {
        [BsonElement("productId")]
        public string ProductId { get; set; } = string.Empty;

        [BsonElement("barcode")]
        public string Barcode { get; set; } = string.Empty;

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("unitPrice")]
        public decimal UnitPrice { get; set; }

        [BsonElement("qty")]
        public int Qty { get; set; }

        [BsonElement("lineTotal")]
        public decimal LineTotal { get; set; }
    }

    public class Sale
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("receiptNo")]
        public string ReceiptNo { get; set; } = string.Empty;

        [BsonElement("cashierName")]
        public string CashierName { get; set; } = "Cashier";

        [BsonElement("paymentMethod")]
        public string PaymentMethod { get; set; } = "CASH"; // CASH / CARD

        [BsonElement("items")]
        public List<SaleItem> Items { get; set; } = new();

        [BsonElement("subTotal")]
        public decimal SubTotal { get; set; }

        [BsonElement("taxRate")]
        public decimal TaxRate { get; set; } = 0.05m;

        [BsonElement("taxAmount")]
        public decimal TaxAmount { get; set; }

        [BsonElement("discount")]
        public decimal Discount { get; set; }

        [BsonElement("grandTotal")]
        public decimal GrandTotal { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
