namespace Pos.Api.Dtos
{
    public class ProductUpdateDto
    {
        public string Barcode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = "General";
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int ReorderLevel { get; set; } = 10;
        public bool IsActive { get; set; } = true;
    }
}
