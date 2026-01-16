namespace Pos.Api.Dtos
{
    public class SaleCreateItemDto
    {
        public string Barcode { get; set; } = string.Empty;
        public int Qty { get; set; }
    }

    public class SaleCreateDto
    {
        public string CashierName { get; set; } = "Cashier";
        public string PaymentMethod { get; set; } = "CASH"; // CASH / CARD
        public decimal Discount { get; set; } = 0;
        public decimal TaxRate { get; set; } = 0.05m;

        public List<SaleCreateItemDto> Items { get; set; } = new();
    }
}
