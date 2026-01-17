using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pos.Api.Dtos;
using Pos.Api.Models;
using Pos.Api.Services;

namespace Pos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SalesController : ControllerBase
    {
        private readonly SaleService _service;

        public SalesController(SaleService service)
        {
            _service = service;
        }

        // POST: api/sales/checkout
        [Authorize(Roles = "Admin,Manager,Cashier")]
        [HttpPost("checkout")]
        public async Task<ActionResult<Sale>> Checkout(SaleCreateDto dto)
        {
            try
            {
                var sale = await _service.CreateSaleAsync(dto);
                return Ok(sale);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/sales/recent?limit=20
        [Authorize(Roles = "Admin,Manager")]
        [HttpGet("recent")]
        public async Task<ActionResult<List<Sale>>> Recent([FromQuery] int limit = 20)
        {
            var sales = await _service.GetRecentSalesAsync(limit);
            return Ok(sales);
        }

        // GET: api/sales/today-revenue
        [Authorize(Roles = "Admin,Manager")]
        [HttpGet("today-revenue")]
        public async Task<ActionResult<object>> TodayRevenue()
        {
            var revenue = await _service.GetTodayRevenueAsync();
            return Ok(new { todayRevenue = revenue });
        }

        // GET: api/sales/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Sale>> GetById(string id)
        {
            var sale = await _service.GetByIdAsync(id);
            if (sale == null) return NotFound();
            return Ok(sale);
        }

        // GET: api/sales/receipt/{receiptNo}
        [Authorize(Roles = "Admin,Manager,Cashier")]
        [HttpGet("receipt/{receiptNo}")]
        public async Task<ActionResult<Sale>> GetByReceipt(string receiptNo)
        {
            var sale = await _service.GetByReceiptNoAsync(receiptNo);
            if (sale == null) return NotFound();
            return Ok(sale);
        }
    }
}
