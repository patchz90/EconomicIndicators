
namespace ExcelEconomicIndicatorsWebAddInWeb.Models
{
    using System.Collections.Generic;

    public class IndicatorModel
    {
        public string Name { get; set; }
        public IEnumerable<TimePointModel> TimePoints { get; set; }
    }
}