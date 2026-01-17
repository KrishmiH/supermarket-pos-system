using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pos.Api.Dtos;
using Pos.Api.Models;
using Pos.Api.Services;

namespace Pos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Manager")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _service;

        public ProductsController(ProductService service)
        {
            _service = service;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetAll()
        {
            var products = await _service.GetAllAsync();
            return Ok(products);
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetById(string id)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        // GET: api/products/barcode/{barcode}
        [HttpGet("barcode/{barcode}")]
        public async Task<ActionResult<Product>> GetByBarcode(string barcode)
        {
            var product = await _service.GetByBarcodeAsync(barcode);
            if (product == null) return NotFound();
            return Ok(product);
        }

        // GET: api/products/search?q=milk
        [HttpGet("search")]
        public async Task<ActionResult<List<Product>>> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("Query 'q' is required.");

            var results = await _service.SearchAsync(q);
            return Ok(results);
        }

        // POST: api/products
        [HttpPost]
        public async Task<ActionResult<Product>> Create(ProductCreateDto dto)
        {
            // Basic validation
            if (string.IsNullOrWhiteSpace(dto.Barcode) || string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Barcode and Name are required.");

            if (dto.Price < 0) return BadRequest("Price cannot be negative.");
            if (dto.Stock < 0) return BadRequest("Stock cannot be negative.");

            // Ensure barcode unique
            var existing = await _service.GetByBarcodeAsync(dto.Barcode);
            if (existing != null)
                return Conflict("Barcode already exists.");

            var product = new Product
            {
                Barcode = dto.Barcode.Trim(),
                Name = dto.Name.Trim(),
                Category = dto.Category.Trim(),
                Price = dto.Price,
                Stock = dto.Stock,
                ReorderLevel = dto.ReorderLevel,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _service.CreateAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        // PUT: api/products/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, ProductUpdateDto dto)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();

            // If barcode changed, check uniqueness
            if (!string.Equals(existing.Barcode, dto.Barcode, StringComparison.OrdinalIgnoreCase))
            {
                var barcodeOwner = await _service.GetByBarcodeAsync(dto.Barcode);
                if (barcodeOwner != null)
                    return Conflict("Barcode already exists.");
            }

            existing.Barcode = dto.Barcode.Trim();
            existing.Name = dto.Name.Trim();
            existing.Category = dto.Category.Trim();
            existing.Price = dto.Price;
            existing.Stock = dto.Stock;
            existing.ReorderLevel = dto.ReorderLevel;
            existing.IsActive = dto.IsActive;
            existing.UpdatedAt = DateTime.UtcNow;

            var ok = await _service.UpdateAsync(id, existing);
            if (!ok) return StatusCode(500, "Update failed");

            return NoContent();
        }

        // DELETE: api/products/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();

            var ok = await _service.DeleteAsync(id);
            if (!ok) return StatusCode(500, "Delete failed");

            return NoContent();
        }
    }
}
