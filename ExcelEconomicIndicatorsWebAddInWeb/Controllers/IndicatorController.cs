using Data;
using ExcelEconomicIndicatorsWebAddInWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ExcelEconomicIndicatorsWebAddInWeb.Controllers
{
    public class IndicatorController : ApiController
    {
        [HttpGet]
        [Route("api/GetIndicatorNames")]
        public IHttpActionResult GetIndicatorNames()
        {
            var result = new List<IndicatorModel>();
            using (EconindicatorsEntities entities = new EconindicatorsEntities())
            {
                var indicatorNames = entities.Indicators.Select(i => new IndicatorModel
                {
                    Name = i.Name,
                    TimePoints = i.IndicatorValues.Select(iv => new TimePointModel
                    {
                        Value = iv.Value,
                        Year = iv.TimePoint.Year
                    })
                }).ToList();

                return this.Ok(indicatorNames);
            }
        }
    }
}