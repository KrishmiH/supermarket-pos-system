using Microsoft.AspNetCore.Mvc;
using Pos.Api.Dtos;
using Pos.Api.Models;
using Pos.Api.Services;

namespace Pos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly SaleService _service;

        public SalesController(SaleService service)
        {
            _service = service;
        }

        // POST: api/sales/checkout
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
        [HttpGet("recent")]
        public async Task<ActionResult<List<Sale>>> Recent([FromQuery] int limit = 20)
        {
            var sales = await _service.GetRecentSalesAsync(limit);
            return Ok(sales);
        }

        // GET: api/sales/today-revenue
        [HttpGet("today-revenue")]
        public async Task<ActionResult<object>> TodayRevenue()
        {
            var revenue = await _service.GetTodayRevenueAsync();
            return Ok(new { todayRevenue = revenue });
        }
    }
}
